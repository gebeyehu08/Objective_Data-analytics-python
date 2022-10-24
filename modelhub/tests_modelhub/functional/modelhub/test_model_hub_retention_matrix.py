"""
Copyright 2022 Objectiv B.V.
"""


# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__, ModelHub
import pytest
from bach.testing import assert_equals_data


@pytest.mark.parametrize('event_type', ['ClickEvent', None])
def test_retention_matrix_yearly(objectiv_df, event_type):
    modelhub = ModelHub()

    data = modelhub.aggregate.retention_matrix(
        objectiv_df,
        time_period='yearly',
        event_type=event_type,
        percentage=False,
        display=False,
    )

    assert_equals_data(
        data,
        expected_columns=['first_cohort', '_0'],
        expected_data=[
            ['2021', 4],
        ],
        use_to_pandas=True,
    )


@pytest.mark.parametrize('percentage', [True, False])
def test_retention_matrix_monthly(objectiv_df, percentage):
    modelhub = ModelHub()
    event_type = 'ClickEvent'

    data = modelhub.aggregate.retention_matrix(objectiv_df,
                                               time_period='monthly',
                                               event_type=event_type,
                                               percentage=percentage,
                                               display=False)

    # filling nan values with -999 in order to be able to do the check
    # (nan values are causing a trouble)


    cohort_0_val = 2
    cohort_1_val = 1
    missing_val = -999
    if percentage:
        cohort_0_val = 100.
        cohort_1_val = 50.
        missing_val = float(missing_val)

    data = data.fillna(value=missing_val)
    assert_equals_data(
        data,
        expected_columns=['first_cohort', '_0', '_1'],
        expected_data=[
            ['2021-11', cohort_0_val, cohort_1_val],
            ['2021-12', cohort_0_val, missing_val],
        ],
        use_to_pandas=True,
    )


def test_retention_matrix_weekly(objectiv_df):
    modelhub = ModelHub()
    event_type = 'ClickEvent'
    data = modelhub.aggregate.retention_matrix(objectiv_df,
                                               time_period='weekly',
                                               event_type=event_type,
                                               percentage=False,
                                               display=False)
    assert_equals_data(
        data,
        expected_columns=['first_cohort', '_0'],
        expected_data=[
            ['2021-11-29', 4],
        ],
        use_to_pandas=True,
    )


def test_retention_matrix_daily(objectiv_df):
    modelhub = ModelHub()
    event_type = 'ClickEvent'
    data = modelhub.aggregate.retention_matrix(objectiv_df,
                                               time_period='daily',
                                               event_type=event_type,
                                               percentage=False,
                                               display=False)

    data = data.fillna(value=-999)
    assert_equals_data(
        data,
        expected_columns=['first_cohort', '_0', '_1'],
        expected_data=[
            ['2021-11-29', 1, 1],
            ['2021-11-30', 1, 1],
            ['2021-12-02', 1, -999],
            ['2021-12-03', 1, -999],
        ],
        use_to_pandas=True,
    )


def test_retention_matrix_biweekly(objectiv_df):
    modelhub = ModelHub()
    event_type = 'ClickEvent'
    with pytest.raises(ValueError, match='biweekly time_period is not available.'):
        modelhub.aggregate.retention_matrix(objectiv_df,
                                            event_type=event_type,
                                            time_period='biweekly',
                                            display=False)


def test_retention_matrix_w_start_date(objectiv_df):
    modelhub = ModelHub()
    event_type = 'ClickEvent'
    # start_date
    data = modelhub.aggregate.retention_matrix(objectiv_df,
                                               time_period='daily',
                                               event_type=event_type,
                                               start_date='2021-11-30',
                                               percentage=False,
                                               display=False)

    data = data.fillna(value=-999)
    assert_equals_data(
        data,
        expected_columns=['first_cohort', '_0', '_1'],
        expected_data=[
            ['2021-11-30', 1, 1],
            ['2021-12-02', 1, -999],
            ['2021-12-03', 1, -999],
        ],
        use_to_pandas=True,
    )


def test_retention_matrix_w_end_date(objectiv_df):
    modelhub = ModelHub()
    event_type = 'ClickEvent'
    data = modelhub.aggregate.retention_matrix(objectiv_df,
                                               time_period='daily',
                                               event_type=event_type,
                                               end_date='2021-12-02',
                                               percentage=False,
                                               display=False)

    assert_equals_data(
        data,
        expected_columns=['first_cohort', '_0', '_1'],
        expected_data=[
            ['2021-11-29', 1, 1],
            ['2021-11-30', 1, 1],
        ],
        use_to_pandas=True,
    )


def test_retention_matrix_w_start_n_end_date(objectiv_df):
    modelhub = ModelHub()
    event_type = 'ClickEvent'
    data = modelhub.aggregate.retention_matrix(objectiv_df,
                                               time_period='daily',
                                               event_type=event_type,
                                               start_date='2021-11-30',
                                               end_date='2021-12-02',
                                               percentage=False,
                                               display=False)

    assert_equals_data(
        data,
        expected_columns=['first_cohort', '_0', '_1'],
        expected_data=[
            ['2021-11-30', 1, 1],
        ],
        use_to_pandas=True,
    )


def test_retention_matrix_non_existing_event_type(objectiv_df):
    modelhub = ModelHub()
    # non-existing event type
    data = modelhub.aggregate.retention_matrix(objectiv_df,
                                               event_type='some_event',
                                               display=False)

    assert list(data.index.keys()) == ['first_cohort']
    assert data.columns == []
