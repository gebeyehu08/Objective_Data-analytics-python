"""
Copyright 2022 Objectiv B.V.
"""

from decimal import Decimal
import pytest

# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__
from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
from tests.functional.bach.test_data_and_utils import assert_equals_data


def test_funnel_conversion(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)
    df['feature_nice_name'] = df.location_stack.ls.nice_name.str.lower().str[:7]

    columns = ['location', 'n_users', 'n_users_completed_step',
               'step_conversion_rate', 'full_conversion_rate', 'dropoff_share']

    bts = modelhub.agg.funnel_conversion(df, location_stack='feature_nice_name')
    assert_equals_data(
        bts[columns],
        expected_columns=columns,
        expected_data=[
            ['link: c', 3, 2, Decimal('0.667'), Decimal('0.667'), Decimal('0.333')],
            ['link: a', 2, 1, Decimal('0.500'), Decimal('0.333'), Decimal('0.333')],
            ['link: g', 1, 0, Decimal('0.000'), Decimal('0.000'), Decimal('0.333')],
            ['link: l', 1, 1, Decimal('1.000'), Decimal('0.333'), 0.0],
            ['link: n', 1, 1, Decimal('1.000'), Decimal('0.333'), 0.0],
            ['link: d', 1, 0, Decimal('0.000'), Decimal('0.000'), Decimal('0.333')],
            ['expanda', 1, 1, Decimal('1.000'), Decimal('0.333'), 0.00],
        ],
    )

    # location_stack - default
    bts = modelhub.agg.funnel_conversion(df, location_stack=None)
    print(bts.to_pandas())

    assert_equals_data(
        bts[columns],
        expected_columns=columns,
        expected_data=[
            [
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                1, 1, 1.0, 1.0, 0.0
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                1, 0, 0.0, 0.0, 1.0
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                1, 1, 1.0, 1.0, 0.0
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                1, 0, 0.0, 0.0, 1.0
            ],
            [
                'Link: Cookies located at Web Document: #document => Section: footer',
                1, 1, 1.0, 1.0, 0.0
            ],
            [
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                1, 1, 1.0, 1.0, 0.0
            ],
            [
                'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                1, 1, 1.0, 1.0, 0.0
            ],
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                1, 0, 0.0, 0.0, 1.0
            ],
            [
                'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                1, 0, 0.0, 0.0, 1.0
            ],
            [
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                1, 1, 1.0, 1.0, 0.0
            ],
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                1, 1, 1.0, 1.0, 0.0
            ],
            [
                'Link: notebook-product-analytics located at Web Document: #document',
                1, 1, 1.0, 1.0, 0.0
            ],
        ],
    )
