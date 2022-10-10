import numpy as np

import pandas as pd
import pytest
from tests.functional.bach.test_data_and_utils import get_df_with_railway_data, get_df_with_test_data

from bach.testing import assert_equals_data


def test_value_counts_basic(engine):
    bt = get_df_with_test_data(engine)['municipality']
    result = bt.value_counts()

    np.testing.assert_equal(
        bt.to_pandas().value_counts().to_numpy(),
        result.to_numpy(),
    )

    assert_equals_data(
        result.to_frame(),
        expected_columns=['municipality', 'value_counts'],
        expected_data=[
            ['Súdwest-Fryslân', 2],
            ['Leeuwarden', 1]
        ],
    )

    result_normalized = bt.value_counts(normalize=True)
    np.testing.assert_almost_equal(
        bt.to_pandas().value_counts(normalize=True).to_numpy(),
        result_normalized.to_numpy(),
        decimal=2,
    )
    assert_equals_data(
        result_normalized.to_frame(),
        expected_columns=['municipality', 'value_counts'],
        expected_data=[
            ['Súdwest-Fryslân', 2 / 3],
            ['Leeuwarden', 1 / 3]
        ],
    )


def test_value_counts_w_bins(engine) -> None:
    bins = 4
    inhabitants = get_df_with_test_data(engine, full_data_set=True)['inhabitants']
    result = inhabitants.value_counts(bins=bins)
    np.testing.assert_equal(
        inhabitants.to_pandas().value_counts(bins=bins).to_numpy(),
        result.to_numpy(),
    )
    closed = 'right'
    bin1 = pd.Interval(607.215, 23896.25,  closed)
    bin2 = pd.Interval(23896.25, 47092.5,  closed)
    bin3 = pd.Interval(47092.5, 70288.75,  closed)
    bin4 = pd.Interval(70288.75, 93485.,  closed)

    assert_equals_data(
        result.sort_index(),
        expected_columns=['range', 'value_counts'],
        expected_data=[
            [bin1, 9],
            [bin2, 1],
            [bin3, 0],
            [bin4, 1],
        ],
        use_to_pandas=True,
    )

    bin1_bach = pd.Interval(700., 23896.25, closed='both')

    result_w_bach_method = inhabitants.value_counts(bins=bins, method='bach')
    assert_equals_data(
        result_w_bach_method.sort_index(),
        expected_columns=['range', 'value_counts'],
        expected_data=[
            [bin1_bach, 9],
            [bin2, 1],
            [bin3, 0],
            [bin4, 1],
        ],
        use_to_pandas=True,
    )


def test_value_counts_w_groupby(engine) -> None:
    bt = get_df_with_railway_data(engine)[['town', 'platforms', 'station_id']].reset_index(drop=True)
    result = bt.groupby(['town', 'platforms'])['station_id'].value_counts()
    assert_equals_data(
        result.to_frame().sort_index(),
        expected_columns=['town', 'platforms', 'station_id', 'value_counts'],
        expected_data=[
            ['Drylts', 1, 1, 1],
            ['It Hearrenfean', 1, 2, 1],
            ['It Hearrenfean', 2, 3, 1],
            ['Ljouwert', 1, 5, 1],
            ['Ljouwert', 4, 4, 1],
            ['Snits', 2, 6, 1],
            ['Snits', 2, 7, 1],
        ],
    )

    result_normalized = bt.groupby(['town', 'platforms'])['station_id'].value_counts(normalize=True)
    assert_equals_data(
        result_normalized.to_frame().sort_index(),
        expected_columns=['town', 'platforms', 'station_id', 'value_counts'],
        expected_data=[
            ['Drylts', 1, 1, 1 / 7],
            ['It Hearrenfean', 1, 2, 1 / 7],
            ['It Hearrenfean', 2, 3, 1 / 7],
            ['Ljouwert', 1, 5, 1 / 7],
            ['Ljouwert', 4, 4, 1 / 7],
            ['Snits', 2, 6, 1 / 7],
            ['Snits', 2, 7, 1 / 7],
        ],
    )


def test_bins_error(engine) -> None:
    with pytest.raises(ValueError, match='Cannot calculate bins for non numeric series.'):
        get_df_with_railway_data(engine)['town'].value_counts(bins=4)


def test_method_error(engine) -> None:
    with pytest.raises(ValueError, match=r'"whatever" is not a valid method'):
        get_df_with_railway_data(engine)['platforms'].value_counts(bins=4, method='whatever')
