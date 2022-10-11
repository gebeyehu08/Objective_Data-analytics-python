"""
Copyright 2022 Objectiv B.V.
"""

import pytest

# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__
from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
from tests.functional.bach.test_data_and_utils import assert_equals_data


def test_drop_off_locations_basic(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)

    # default values
    bts = modelhub.agg.drop_off_locations(df)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__location'].astype(dtype=str).str[8:10]
    bts = bts.sort_values(by='sort_str')
    columns = ['__location', 'value_counts', 'sort_str']
    assert_equals_data(
        bts[columns],
        expected_columns=columns,
        expected_data=[
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                1, 'a-'
            ],
            [
                'Link: Docs located at Web Document: #document => Section: navbar-top => '
                'Overlay: hamburger-menu', 1, 'cs'
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar-top'
                ' => Overlay: hamburger-menu',
                1, 'nt'
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                1, 'ou'
            ],

        ],
    )


def test_drop_off_locations_w_groupby(db_params):

    df, modelhub = get_objectiv_dataframe_test(db_params)

    # groupby
    bts = modelhub.agg.drop_off_locations(df,
                                          groupby=['user_id', 'day'],
                                          percentage=False)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__location'].astype(dtype=str).str[8:10]
    bts = bts.sort_values(by='sort_str')
    columns = ['__location', 'value_counts', 'sort_str']
    assert_equals_data(
        bts[columns],
        expected_columns=columns,
        expected_data=[
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                1, 'a-'
            ],
            [
                'Link: Docs located at Web Document: #document => Section: navbar-top => '
                'Overlay: hamburger-menu',
                1, 'cs'
            ],
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                1, 'go'
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar'
                '-top => Overlay: hamburger-menu',
                1, 'nt'
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                1, 'ou'
            ],
            [
                'Link: notebook-product-analytics located at Web Document: #document',
                1, 'te'
            ],
        ],
    )


def test_drop_off_locations_w_percentage(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)

    # percentage
    bts = modelhub.agg.drop_off_locations(df, percentage=True)
    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__location'].astype(dtype=str).str[8:10]
    bts = bts.sort_values(by='sort_str')
    columns = ['__location', 'percentage', 'sort_str']
    assert_equals_data(
        bts[columns],
        expected_columns=columns,
        expected_data=[
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                25, 'a-'
            ],
            [
                'Link: Docs located at Web Document: #document => Section: navbar-top => '
                'Overlay: hamburger-menu', 25, 'cs'
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar-top'
                ' => Overlay: hamburger-menu', 25, 'nt'
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                25, 'ou'
            ],
        ],
    )


def test_drop_off_locations_w_location_stack(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)

    # location_stack - SeriesLocationStack
    location_stack = df.location_stack.json[{'url': 'https://objectiv.io/'}:]
    bts = modelhub.agg.drop_off_locations(df, location_stack=location_stack)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__location'].astype(dtype=str).str[-2]

    columns = ['__location', 'value_counts', 'sort_str']
    assert_equals_data(
        bts[columns],
        expected_columns=columns,
        expected_data=[
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                1, 'e'
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top'
                ' => Overlay: hamburger-menu', 1, 'n'
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                1, 'o'
            ],
        ],
        use_to_pandas=True,
        order_by=['sort_str'],
    )

    # location_stack - some other column
    df['link_id'] = df.location_stack.ls.get_from_context_with_type_series(
        type='LinkContext', key='id').str.lower()

    bts = modelhub.agg.drop_off_locations(df, location_stack='link_id')

    assert_equals_data(
        bts,
        expected_columns=['__location', 'value_counts'],
        expected_data=[
            [
                'about us', 1
            ],
            [
                'contact us', 1
            ],
            [
                'cta-repo-button', 1
            ],
            [
                'docs', 1
            ],
        ],
        use_to_pandas=True,
        order_by=['__location'],
    )
