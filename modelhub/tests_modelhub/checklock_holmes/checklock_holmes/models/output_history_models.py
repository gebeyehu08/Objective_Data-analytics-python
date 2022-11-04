from enum import Enum
from typing import List

from pydantic.main import BaseModel


class ComparisonStatus(Enum):
    NO_HISTORY_FOUND = 'Cell source has no history.'
    CELL_SOURCE_NOT_FOUND = 'Cell source from old history was not found in current check.'
    DIFFERENT_OUTPUT = 'Current output differs from history output.'
    SAME_OUTPUT = 'History and current output are equal.'


class OutputComparisonResult(BaseModel):
    history_file: str
    current_file: str
    cell_source: str
    status: ComparisonStatus
    difference: str = ''


class OutputComparisonReport(BaseModel):
    notebook_name: str
    db_engine: str
    results: List[OutputComparisonResult]
