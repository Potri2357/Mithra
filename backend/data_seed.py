"""
Data seed module — exposes seeded BIS data for fallback search.
"""
import json
from pathlib import Path

import os
def _find_data_dir() -> Path:
    data_env = os.getenv("DATA_DIR")
    candidates = [
        Path(data_env) if data_env else None,
        Path(__file__).parent.parent.parent / "data",
        Path(__file__).parent.parent / "data",
        Path.cwd() / "data",
    ]
    for candidate in candidates:
        if candidate and (candidate / "standards_catalogue.json").exists():
            return candidate
    return Path(__file__).parent.parent.parent / "data"

_DATA_DIR = _find_data_dir()

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
