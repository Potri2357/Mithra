"""
Data seed module — exposes seeded BIS data for fallback search.
"""
import json
from pathlib import Path

_DATA_DIR = Path(__file__).parent.parent / "data"
# Also try project root (for when running from backend/)
import os
if not (_DATA_DIR / 'standards_catalogue.json').exists():
    _DATA_DIR = Path(__file__).parent.parent.parent / "data"

def _load(fname: str) -> list:
    try:
        with open(_DATA_DIR / fname) as f:
            return json.load(f)
    except Exception:
        return []

STANDARDS_SEED = _load("standards_catalogue.json")
SCHEMES_SEED = _load("schemes_data.json")
LABS_SEED = _load("labs_directory.json")
CONSUMER_SEED = _load("consumer_guide.json")
