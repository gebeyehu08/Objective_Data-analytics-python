"""
Copyright 2022 Objectiv B.V.
"""


class CuriousIncident(Exception):
    def __init__(self, notebook_name: str, exc: Exception):
        super().__init__(f'{exc} that was the curious incident when executing {notebook_name} notebook')


class OutputHistoryException(Exception):
    def __init__(self, exc: Exception):
        super().__init__(
            f'Cannot ready history file, might be corrupted. '
            f'Please manually delete it and generate again!. {exc}'
        )
