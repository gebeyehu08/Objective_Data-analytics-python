"""
Copyright 2022 Objectiv B.V.
"""

import pandas as pd
from matplotlib.testing.decorators import check_figures_equal

from tests.functional.bach.test_data_and_utils import get_df_with_test_data
from bach.testing import assert_equals_data

# generates and compares 2 matplotlib figures (png, pdf)
# For more information https://matplotlib.org/3.5.0/api/testing_api.html#module-matplotlib.testing


@check_figures_equal(extensions=['png', 'pdf'])
def test_plot_hist_basic(engine, fig_test, fig_ref) -> None:
    bt = get_df_with_test_data(engine, full_data_set=False)
    pbt = bt.to_pandas()

    ax_ref = fig_ref.add_subplot(111)
    ax_test = fig_test.add_subplot(111)
    pbt.plot.hist(ax=ax_ref)
    bt.plot.hist(ax=ax_test)

    result_calc_bins = bt.plot._calculate_hist_frequencies(
        bins=10, numeric_columns=['skating_order', 'inhabitants', 'founding'],
    )
    bins_1 = pd.Interval(1., 9349.4, closed='both')
    bins_2 = pd.Interval(9349.4, 18697.8, closed='right')
    bins_3 = pd.Interval(18697.8, 28046.199999999997, closed='right')
    bins_4 = pd.Interval(28046.199999999997, 37394.6, closed='right')
    bins_5 = pd.Interval(37394.6, 46743., closed='right')
    bins_6 = pd.Interval(46743., 56091.399999999994, closed='right')
    bins_7 = pd.Interval(56091.399999999994, 65439.799999999996, closed='right')
    bins_8 = pd.Interval(65439.799999999996, 74788.2, closed='right')
    bins_9 = pd.Interval(74788.2, 84136.59999999999, closed='right')
    bins_10 = pd.Interval(84136.59999999999, 93485., closed='right')

    assert_equals_data(
        result_calc_bins,
        expected_columns=['column_label',  'frequency', 'range'],
        order_by=['column_label', 'range'],
        expected_data=[
            ['empty_bins', 0, bins_2],
            ['empty_bins', 0, bins_3],
            ['empty_bins', 0, bins_5],
            ['empty_bins', 0, bins_6],
            ['empty_bins', 0, bins_7],
            ['empty_bins', 0, bins_8],
            ['empty_bins', 0, bins_9],
            ['founding',   3, bins_1],
            ['inhabitants', 1, bins_1],
            ['inhabitants', 1, bins_4],
            ['inhabitants', 1, bins_10],
            ['skating_order', 3, bins_1],
        ],
        use_to_pandas=True,
    )


@check_figures_equal(extensions=['png', 'pdf'])
def test_plot_hist_bins(engine, fig_test, fig_ref) -> None:
    bt = get_df_with_test_data(engine, full_data_set=True)[['inhabitants']]
    pbt = bt.to_pandas()
    bins = 5

    ax_ref = fig_ref.add_subplot(111)
    ax_test = fig_test.add_subplot(111)
    pbt.plot.hist(bins=bins, ax=ax_ref)
    bt.plot.hist(bins=bins, ax=ax_test)

    result_calc_bins = bt.plot._calculate_hist_frequencies(
        bins=5, numeric_columns=['inhabitants'],
    )
    bins_1 = pd.Interval(700., 19257., closed='both')
    bins_2 = pd.Interval(19257., 37814., closed='right')
    bins_3 = pd.Interval(37814., 56371., closed='right')
    bins_4 = pd.Interval(56371., 74928., closed='right')
    bins_5 = pd.Interval(74928., 93485., closed='right')

    assert_equals_data(
        result_calc_bins,
        expected_columns=['column_label', 'frequency', 'range'],
        order_by=['column_label', 'range'],
        expected_data=[
            ['empty_bins', 0, bins_3],
            ['empty_bins', 0, bins_4],
            ['inhabitants', 9, bins_1],
            ['inhabitants', 1, bins_2],
            ['inhabitants', 1, bins_5],
        ],
        use_to_pandas=True,
    )

