"""
Copyright 2021 Objectiv B.V.
"""
import pytest

# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__
from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
from bach.testing import assert_equals_data


@pytest.mark.skip_athena_todo('https://github.com/objectiv/objectiv-analytics/issues/1262')  # TODO: Athena
def test_frequency(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)
    s = modelhub.aggregate.frequency(df)

    assert_equals_data(
        s,
        expected_columns=['session_id_nunique', 'user_id_nunique'],
        expected_data=[
            [1, 1],
            [2, 3]
        ]
    )
