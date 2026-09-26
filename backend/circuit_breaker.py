"""
Production-grade Async Circuit Breaker and Fast Retrieval Cache.
Protects Groq and Gemini API keys from cascading failures, 429 rate limit exhaustion,
and network timeout delays.

States:
- CLOSED: Requests pass through normally.
- OPEN: Provider has failed/exhausted quota. Requests immediately fail-fast (0ms)
        to the next fallback provider without burning time or quota.
- HALF_OPEN: A trial request is permitted after cooldown. If it succeeds, the
             circuit resets to CLOSED; if it fails, it returns to OPEN.
"""

import time
import asyncio
import logging
from enum import Enum
from typing import Optional, Callable, Any
from functools import wraps

logger = logging.getLogger(__name__)


class CircuitState(str, Enum):
    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"


class CircuitBreakerOpenException(Exception):
    """Raised when an operation is attempted while the circuit breaker is OPEN."""
    def __init__(self, name: str, retry_after: float):
        self.name = name
        self.retry_after = retry_after
        super().__init__(f"Circuit breaker '{name}' is OPEN. Retry in {retry_after:.1f}s.")


class CircuitBreaker:
    def __init__(
        self,
        name: str,
        failure_threshold: int = 2,
        recovery_timeout: float = 30.0,
        half_open_max_trials: int = 1,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max_trials = half_open_max_trials

        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time: Optional[float] = None
        self._lock = asyncio.Lock()

    def is_available(self) -> bool:
        """Fast non-async check if the circuit can accept a request right now."""
        now = time.time()
        if self.state == CircuitState.CLOSED:
            return True
        elif self.state == CircuitState.OPEN:
            if self.last_failure_time and (now - self.last_failure_time) >= self.recovery_timeout:
                # Transition to HALF_OPEN to probe provider health
                self.state = CircuitState.HALF_OPEN
                logger.info(f"🔄 Circuit breaker '{self.name}' transitioned from OPEN to HALF_OPEN (probing health)")
                return True
            return False
        elif self.state == CircuitState.HALF_OPEN:
            return True
        return False

    async def can_execute(self) -> bool:
        """Async safe check."""
        async with self._lock:
            return self.is_available()

    async def record_success(self):
        """Record successful execution."""
        async with self._lock:
            if self.state == CircuitState.HALF_OPEN:
                logger.info(f"✅ Circuit breaker '{self.name}' probe succeeded. Resetting to CLOSED.")
                self.state = CircuitState.CLOSED
                self.failure_count = 0
                self.success_count += 1
            elif self.state == CircuitState.CLOSED:
                self.failure_count = 0
                self.success_count += 1

    async def record_failure(self, error: Optional[Exception] = None):
        """Record failed execution (429, timeout, network error)."""
        async with self._lock:
            self.failure_count += 1
            self.last_failure_time = time.time()
            error_msg = f" ({error})" if error else ""

            if self.state == CircuitState.HALF_OPEN:
                # Probe failed, trip immediately back to OPEN
                self.state = CircuitState.OPEN
                logger.warning(
                    f"⚠️ Circuit breaker '{self.name}' probe failed{error_msg}. "
                    f"Re-tripping to OPEN for {self.recovery_timeout}s."
                )
            elif self.state == CircuitState.CLOSED and self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN
                logger.warning(
                    f"🚨 Circuit breaker '{self.name}' TRIPPED to OPEN after {self.failure_count} failures{error_msg}. "
                    f"Fast-failing requests for {self.recovery_timeout}s to preserve API quota and eliminate latency."
                )

    def time_until_retry(self) -> float:
        """Seconds remaining before circuit transitions from OPEN to HALF_OPEN."""
        if self.state != CircuitState.OPEN or not self.last_failure_time:
            return 0.0
        elapsed = time.time() - self.last_failure_time
        remaining = self.recovery_timeout - elapsed
        return max(0.0, remaining)

    def get_status(self) -> dict:
        return {
            "name": self.name,
            "state": self.state.value,
            "failure_count": self.failure_count,
            "success_count": self.success_count,
            "retry_after_seconds": round(self.time_until_retry(), 1) if self.state == CircuitState.OPEN else 0,
        }


# ==============================================================================
# Global Circuit Breakers for Providers
# ==============================================================================
# Groq: 2 consecutive failures trip for 30s
groq_breaker = CircuitBreaker("groq", failure_threshold=2, recovery_timeout=30.0)

# Gemini: 2 consecutive failures (or 429 quota exhaustion) trip for 30s
gemini_breaker = CircuitBreaker("gemini", failure_threshold=2, recovery_timeout=30.0)

# Sarvam translation: 2 failures trip for 45s
sarvam_breaker = CircuitBreaker("sarvam", failure_threshold=2, recovery_timeout=45.0)


# ==============================================================================
# In-Memory Fast Retrieval & Response LRU Cache
# ==============================================================================
class FastMemoryCache:
    """Thread-safe in-memory cache with TTL and max size for instant (<0.5ms) retrievals."""
    def __init__(self, max_size: int = 500, default_ttl: float = 300.0):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: dict[str, tuple[Any, float]] = {}
        self._lock = asyncio.Lock()

    def _normalize_key(self, key: str) -> str:
        return " ".join(key.strip().lower().split())

    async def get(self, key: str) -> Optional[Any]:
        norm_key = self._normalize_key(key)
        async with self._lock:
            if norm_key in self._cache:
                val, expires_at = self._cache[norm_key]
                if time.time() < expires_at:
                    return val
                else:
                    del self._cache[norm_key]
        return None

    async def set(self, key: str, value: Any, ttl: Optional[float] = None):
        norm_key = self._normalize_key(key)
        expires_at = time.time() + (ttl if ttl is not None else self.default_ttl)
        async with self._lock:
            # Evict oldest if full
            if len(self._cache) >= self.max_size:
                oldest_key = next(iter(self._cache))
                del self._cache[oldest_key]
            self._cache[norm_key] = (value, expires_at)

    async def clear(self):
        async with self._lock:
            self._cache.clear()

    def size(self) -> int:
        return len(self._cache)


# Global Caches for Retrieval and Query Translation
retrieval_cache = FastMemoryCache(max_size=300, default_ttl=600.0)  # 10 min TTL
translation_cache = FastMemoryCache(max_size=500, default_ttl=900.0) # 15 min TTL
response_cache = FastMemoryCache(max_size=200, default_ttl=180.0)    # 3 min TTL
