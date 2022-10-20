"""
Copyright 2022 Objectiv B.V.
"""

# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__, ModelHub
from bach.testing import assert_equals_data
from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test


def test_drop_off_locations_basic(objectiv_df):
    modelhub = ModelHub()

    # default values
    bts = modelhub.agg.drop_off_locations(objectiv_df)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['location'].astype(dtype=str).str[8:10]
    bts = bts.sort_values(by='sort_str')
    columns = ['location', 'value_counts', 'sort_str']
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


def test_drop_off_locations_w_groupby(objectiv_df):

    modelhub = ModelHub()

    # groupby
    bts = modelhub.agg.drop_off_locations(objectiv_df,
                                          groupby=['user_id', 'day'],
                                          percentage=False)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['location'].astype(dtype=str).str[8:10]
    bts = bts.sort_values(by='sort_str')
    columns = ['location', 'value_counts', 'sort_str']
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


def test_drop_off_locations_w_percentage(objectiv_df):
    modelhub = ModelHub()

    # percentage
    bts = modelhub.agg.drop_off_locations(objectiv_df, percentage=True)
    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['location'].astype(dtype=str).str[8:10]
    bts = bts.sort_values(by='sort_str')
    columns = ['location', 'percentage', 'sort_str']
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


def test_drop_off_locations_w_location_stack(objectiv_df):
    modelhub = ModelHub()

    # location_stack - SeriesLocationStack
    location_stack = objectiv_df.location_stack.json[{'url': 'https://objectiv.io/'}:]
    bts = modelhub.agg.drop_off_locations(objectiv_df, location_stack=location_stack)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['location'].astype(dtype=str).str[-2]

    columns = ['location', 'value_counts', 'sort_str']
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
    objectiv_df['link_id'] = objectiv_df.location_stack.ls.get_from_context_with_type_series(
        type='LinkContext', key='id').str.lower()

    bts = modelhub.agg.drop_off_locations(objectiv_df, location_stack='link_id')

    assert_equals_data(
        bts,
        expected_columns=['location', 'value_counts'],
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
        order_by=['location'],
    )
