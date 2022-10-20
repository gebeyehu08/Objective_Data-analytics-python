"""
Copyright 2021 Objectiv B.V.
"""
import pytest

# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__, ModelHub
from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
from bach.testing import assert_equals_data


def test_frequency(objectiv_df):
    modelhub = ModelHub()
    s = modelhub.aggregate.frequency(objectiv_df)

    assert_equals_data(
        s,
        expected_columns=['session_id_nunique', 'user_id_nunique'],
        expected_data=[
            [1, 1],
            [2, 3]
        ]
    )
