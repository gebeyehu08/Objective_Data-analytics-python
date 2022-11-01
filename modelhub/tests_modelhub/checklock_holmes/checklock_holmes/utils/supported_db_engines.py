"""
Copyright 2022 Objectiv B.V.
"""
from enum import Enum
from typing import List


class SupportedDBEngine(str, Enum):
    ATHENA = 'athena'
    POSTGRES = 'postgres'
    BIGQUERY = 'bigquery'
    ALL = 'all'

    @classmethod
    def get_supported_engines(cls, engines_to_check: List[str]) -> List['SupportedDBEngine']:
        """
        Returns supported engines based on cli provided param
        """
        if 'all' in engines_to_check:
            return [cls(eng) for eng in cls if eng != 'all']

        return [cls(e_check) for e_check in engines_to_check]
