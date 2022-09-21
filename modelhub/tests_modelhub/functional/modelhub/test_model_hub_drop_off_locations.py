"""
Copyright 2022 Objectiv B.V.
"""


# Any import from modelhub initializes all the types, do not remove
from modelhub import __version__
from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
from tests.functional.bach.test_data_and_utils import assert_equals_data


def test_drop_off_locations(db_params):

    df, modelhub = get_objectiv_dataframe_test(db_params)

    # default values
    bts = modelhub.agg.drop_off_locations(df)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__feature_nice_name'].astype(dtype=str).str[8:10]

    coulmns = ['__feature_nice_name', 'value_counts', 'sort_str']
    assert_equals_data(
        bts[coulmns],
        expected_columns=coulmns,
        expected_data=[
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                1, 'bo'
            ],
            [
                'Link: Docs located at Web Document: #document => Section: navbar-top => '
                'Overlay: hamburger-menu', 1, 'oc'
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar-top'
                ' => Overlay: hamburger-menu',
                1, 'on'
            ],
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                1, 'ta'
            ],
        ],
        use_to_pandas=True,
        order_by=['sort_str'],
    )

    # groupby
    bts = modelhub.agg.drop_off_locations(df,
                                          groupby=['user_id', 'day'],
                                          percentage=False)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__feature_nice_name'].astype(dtype=str).str[8:10]
    assert_equals_data(
        bts[coulmns],
        expected_columns=coulmns,
        expected_data=[
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                1, 'bo'
            ],
            [
                'Link: Docs located at Web Document: #document => Section: navbar-top => '
                'Overlay: hamburger-menu',
                1, 'oc'
            ],
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                1, 'og'
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar'
                '-top => Overlay: hamburger-menu',
                1, 'on'
            ],
            [
                'Link: notebook-product-analytics located at Web Document: #document',
                1, 'ot'
            ],
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                1, 'ta'
            ],
        ],
        use_to_pandas=True,
        order_by=['sort_str'],
    )

    # percentage
    bts = modelhub.agg.drop_off_locations(df, percentage=True)
    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__feature_nice_name'].astype(dtype=str).str[8:10]

    coulmns = ['__feature_nice_name', 'percentage', 'sort_str']
    assert_equals_data(
        bts[coulmns],
        expected_columns=coulmns,
        expected_data=[
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                25, 'bo'
            ],
            [
                'Link: Docs located at Web Document: #document => Section: navbar-top => '
                'Overlay: hamburger-menu', 25, 'oc'
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar-top'
                ' => Overlay: hamburger-menu', 25, 'on'
            ],
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                25, 'ta'
            ],
        ],
        use_to_pandas=True,
        order_by=['sort_str'],
    )

    # location_stack
    location_stack = df.location_stack.json[{'url': 'https://objectiv.io/'}:]
    bts = modelhub.agg.drop_off_locations(df, location_stack=location_stack)

    # adding sorting column
    bts = bts.reset_index()
    bts['sort_str'] = bts['__feature_nice_name'].astype(dtype=str).str[-2]

    coulmns = ['__feature_nice_name', 'value_counts', 'sort_str']
    assert_equals_data(
        bts[coulmns],
        expected_columns=coulmns,
        expected_data=[
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                1, 'p'
            ],
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                1, 'r'
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top'
                ' => Overlay: hamburger-menu', 1, 'u'
            ],
        ],
        use_to_pandas=True,
        order_by=['sort_str'],
    )
