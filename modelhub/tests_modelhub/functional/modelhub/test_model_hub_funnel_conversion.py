"""
Copyright 2022 Objectiv B.V.
"""

from decimal import Decimal
import pytest

# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__, ModelHub
from bach.testing import assert_equals_data


def test_funnel_conversion(objectiv_df):
    modelhub = ModelHub()
    objectiv_df['feature_nice_name'] = objectiv_df.location_stack.ls.nice_name.str.lower().str[:7]

    columns = ['location', 'n_users', 'n_users_completed_step',
               'step_conversion_rate', 'full_conversion_rate', 'dropoff_share']

    bts = modelhub.agg.funnel_conversion(objectiv_df, location_stack='feature_nice_name')
    assert_equals_data(
        bts,
        expected_columns=columns,
        expected_data=[
            ['expanda', 1, 1, 1.0, 0.333, 0.0],
            ['link: a', 2, 1, 0.5, 0.333, 0.333],
            ['link: c', 3, 2, 0.667, 0.667, 0.333],
            ['link: d', 1, 0, 0.0, 0.0, 0.333],
            ['link: g', 1, 0, 0.0, 0.0, 0.333],
            ['link: l', 1, 1, 1.0, 0.333, 0.0],
            ['link: n', 1, 1, 1.0, 0.333, 0.0],
        ],
        use_to_pandas=True,
        order_by=['location'],
    )

    # location_stack - default
    bts = modelhub.agg.funnel_conversion(objectiv_df, location_stack=None)
    bts['sort_str'] = bts['location'].astype(dtype=str).str[15:19].str.lower()
    columns = ['sort_str', 'n_users', 'n_users_completed_step',
               'step_conversion_rate', 'full_conversion_rate', 'dropoff_share']
    assert_equals_data(
        bts[columns],
        expected_columns=columns,
        expected_data=[
            ['butt', 1, 0, 0.0, 0.0, 1.0],
            ['cate', 1, 1, 1.0, 1.0, 0.0],
            ['ion:', 1, 1, 1.0, 1.0, 0.0],
            ['loca', 1, 0, 0.0, 0.0, 1.0],
            ['loca', 1, 1, 1.0, 1.0, 0.0],
            ['loca', 1, 1, 1.0, 1.0, 0.0],
            ['ocat', 1, 1, 1.0, 1.0, 0.0],
            ['prod', 1, 1, 1.0, 1.0, 0.0],
            ['s lo', 1, 0, 0.0, 0.0, 1.0],
            ['taxo', 1, 1, 1.0, 1.0, 0.0],
            ['ted ', 1, 0, 0.0, 0.0, 1.0],
            ['ted ', 1, 1, 1.0, 1.0, 0.0],
        ],
        use_to_pandas=True,
        order_by=['sort_str', 'step_conversion_rate'],
    )
