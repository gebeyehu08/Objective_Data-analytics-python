"""
Copyright 2021 Objectiv B.V.
"""
import pandas as pd

from bach import Series, SeriesString, DataFrame
from tests.functional.bach.test_data_and_utils import assert_equals_data, get_df_with_test_data


def test_from_value(engine):
    a = 'a string'
    b = 'a string\'"\'\' "" \\ with quotes'
    c = None
    d = '\'\'!@&*(HJD☢%'
    e = 'test"""test'

    bt = get_df_with_test_data(engine)[['city']]
    bt['a'] = a
    bt['b'] = b
    bt['c'] = SeriesString.from_value(base=bt, value=c, name='temp')
    bt['d'] = SeriesString.from_value(base=bt, value=d, name='temp')
    bt['e'] = e
    assert_equals_data(
        bt,
        expected_columns=['_index_skating_order', 'city', 'a', 'b', 'c', 'd', 'e'],
        expected_data=[
            [1, 'Ljouwert', a, b, c, d, e],
            [2, 'Snits', a, b, c, d, e],
            [3, 'Drylts', a, b, c, d, e]
        ]
    )


def test_string_slice(engine):
    bt = get_df_with_test_data(engine)[['city']]

    slices = [
        # single values, keep small because we don't want to go out of range
        0, 1, 3, -3, -1,
        # some single value slices
        slice(0), slice(1), slice(5), slice(-5), slice(-1),
        # simple slices
        slice(0, 3), slice(1, 3), slice(3, 3), slice(4, 3),
        # Some negatives
        slice(-4, -2), slice(-2, -2), slice(-2, 1), slice(1, -2),
        # some longer than some of the input strings
        slice(1, -8), slice(8, 1), slice(8, -4),
        # Some more with no beginnings or endings
        slice(None, 3), slice(3, None), slice(None, -3), slice(-3, None)
    ]

    expected_data = {
        '_index_skating_order': [1, 2, 3],
        'city': ['Ljouwert', 'Snits', 'Drylts'],
    }
    # Now try some slices
    for idx, s in enumerate(slices):
        print(f'slice: {s}')
        if (isinstance(s, slice)):
            bts1 = bt['city'].str[s.start:s.stop]
            bts2 = bt['city'].str.slice(s.start, s.stop)
        else:
            bts1 = bt['city'].str[s]
            bts2 = bt['city'].str.slice(s, s+1)

        assert isinstance(bts1, Series)
        assert isinstance(bts2, Series)

        bt[f'city_slice_1_{idx}'] = bts1
        bt[f'city_slice_2_{idx}'] = bts2

        expected_results = ['Ljouwert'.__getitem__(s), 'Snits'.__getitem__(s), 'Drylts'.__getitem__(s)]
        expected_data[f'city_slice_1_{idx}'] = expected_results
        expected_data[f'city_slice_2_{idx}'] = expected_results

    expected = pd.DataFrame(expected_data)
    expected = expected.set_index('_index_skating_order')

    pd.testing.assert_frame_equal(expected, bt.sort_index().to_pandas())


def test_add_string_series(engine):
    bt = get_df_with_test_data(engine)
    bts = bt['city'] + ' is in the municipality ' + bt['municipality']
    assert isinstance(bts, Series)
    assert_equals_data(
        bts,
        expected_columns=['_index_skating_order', 'city'],
        expected_data=[
            [1, 'Ljouwert is in the municipality Leeuwarden'],
            [2, 'Snits is in the municipality Súdwest-Fryslân'],
            [3, 'Drylts is in the municipality Súdwest-Fryslân']
        ]
    )


def test_get_dummies(engine) -> None:
    bt = get_df_with_test_data(engine)
    result = bt['city'].get_dummies()
    assert isinstance(result, DataFrame)

    expected_columns = ['city_Drylts', 'city_Ljouwert', 'city_Snits']
    assert set(expected_columns) == set(result.data_columns)
    assert_equals_data(
        result[expected_columns],
        expected_columns=['_index_skating_order'] + expected_columns,
        expected_data=[
            [1, 0, 1, 0],
            [2, 0, 0, 1],
            [3, 1, 0, 0]
        ],
    )


def test_string_replace(engine) -> None:
    bt = get_df_with_test_data(engine)
    municipality = bt['municipality'].sort_index()
    assert isinstance(municipality, SeriesString)

    municipalities = ['Leeuwarden', 'Súdwest-Fryslân', 'Súdwest-Fryslân']
    replace_pat = ['-', 'west', 'ee', 'ú', 'â', 'e']

    result_df = municipality.to_frame()

    expected_columns = ['_index_skating_order', 'municipality']
    expected_data = [[idx + 1, mun] for idx, mun in enumerate(municipalities)]
    for idx, pat in enumerate(replace_pat):
        result_df[f'repl_{idx}'] = municipality.str.replace(pat=pat, repl='_')
        expected_columns.append(f'repl_{idx}')
        for idx, m in enumerate(municipalities):
            expected_data[idx].append(m.replace(pat, '_'))

    assert_equals_data(result_df, expected_columns=expected_columns, expected_data=expected_data)


def test_to_json_array(engine):
    df = get_df_with_test_data(engine, full_data_set=True)
    s_muni = df['municipality']
    assert isinstance(s_muni, SeriesString)

    series_json_array = s_muni.to_json_array()
    assert series_json_array.dtype == 'json'
    assert_equals_data(
        series_json_array,
        use_to_pandas=True,
        expected_columns=['municipality'],
        # single row, single column, with a list of strings in that cell
        expected_data=[[
            ['De Friese Meren', 'Harlingen', 'Leeuwarden', 'Noardeast-Fryslân', 'Súdwest-Fryslân',
             'Súdwest-Fryslân', 'Súdwest-Fryslân', 'Súdwest-Fryslân', 'Súdwest-Fryslân', 'Súdwest-Fryslân',
             'Waadhoeke']
        ]]
    )


def test_to_json_array_sorting(engine):
    df = get_df_with_test_data(engine, full_data_set=True)
    # We'll call to_json_array() multiple times and combine that in one dataframe. This way we can fit all
    # tests in a single query
    result_df = df['city'].to_json_array().to_frame()
    result_df = result_df.rename(columns={'city': 'no_sorting'})
    result_df['ascending'] = df['city'].sort_values(ascending=False).to_json_array()
    result_df['muni'] = df['city'].sort_by_series(by=[df['municipality']]).to_json_array()
    by = [df['municipality'], df['skating_order']]
    result_df['muni_skating_order'] = df['city'].sort_by_series(by=by).to_json_array()
    assert_equals_data(
        result_df,
        use_to_pandas=True,
        expected_columns=['no_sorting', 'ascending', 'muni', 'muni_skating_order'],
        # single row, with two columns cells, each column containing a json that is a list of strings
        expected_data=[[
            # no sorting: ascending by value
            ['Boalsert', 'Dokkum', 'Drylts', 'Frjentsjer', 'Harns', 'Hylpen', 'Ljouwert', 'Sleat', 'Snits','Starum', 'Warkum'],
            # acending by value
            ['Warkum', 'Starum', 'Snits', 'Sleat', 'Ljouwert', 'Hylpen', 'Harns', 'Frjentsjer', 'Drylts', 'Dokkum', 'Boalsert'],
            # sorted by municipality, within each municipality by value
            ['Sleat', 'Harns', 'Ljouwert', 'Dokkum', 'Boalsert', 'Drylts', 'Hylpen', 'Snits', 'Starum', 'Warkum', 'Frjentsjer'],
            # sorted by municipality, within each municipality by skating_order
            ['Sleat', 'Harns', 'Ljouwert', 'Dokkum', 'Snits', 'Drylts', 'Starum', 'Hylpen', 'Warkum', 'Boalsert', 'Frjentsjer']
        ]]
    )


def test_to_json_array_groupby(engine):
    df = get_df_with_test_data(engine, full_data_set=True)
    df = df.reset_index()
    df = df.groupby('municipality')
    by = [df['_index_skating_order']]
    series_json_array = df['city'].sort_by_series(by=by, ascending=False).to_json_array()
    assert series_json_array.dtype == 'json'
    assert_equals_data(
        series_json_array,
        use_to_pandas=True,
        expected_columns=['municipality', 'city'],
        expected_data=[
            ['De Friese Meren', ['Sleat']],
            ['Harlingen', ['Harns']],
            ['Leeuwarden', ['Ljouwert']],
            ['Noardeast-Fryslân', ['Dokkum']],
            ['Súdwest-Fryslân', ['Boalsert', 'Warkum', 'Hylpen', 'Starum', 'Drylts', 'Snits']],
            ['Waadhoeke', ['Frjentsjer']]
        ]
    )
