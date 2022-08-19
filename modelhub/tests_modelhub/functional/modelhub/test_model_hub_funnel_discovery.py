import pytest
from tests.functional.bach.test_data_and_utils import assert_equals_data

from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test


def test_get_navigation_paths(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)
    funnel = modelhub.get_funnel_discovery()

    df = df.sort_values(by='moment')

    # this is the order of all nice names when aggregated
    agg_nice_names = (
        df['location_stack'].ls.nice_name
        .sort_by_series(by=[df['moment']]).to_json_array()
    )
    assert_equals_data(
        agg_nice_names,
        expected_columns=['location_stack'],
        expected_data=[[[
            'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
            'Link: logo located at Web Document: #document => Section: navbar-top',
            'Link: notebook-product-analytics located at Web Document: #document',
            'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
            'Link: cta-repo-button located at Web Document: #document => Section: header',
            'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            'Link: Cookies located at Web Document: #document => Section: footer',
            'Link: About Us located at Web Document: #document => Section: navbar-top',
            'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
        ]]],
        use_to_pandas=True,
    )

    bts = funnel.get_navigation_paths(data=df, steps=4)
    assert_equals_data(
        bts,
        expected_columns=[
            'location_stack_step_1', 'location_stack_step_2', 'location_stack_step_3', 'location_stack_step_4',
        ],
        expected_data=[
            [
                'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
            ],
            [
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
            ],
            [
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu'
            ],
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu'
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Cookies located at Web Document: #document => Section: footer'
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Cookies located at Web Document: #document => Section: footer',
                'Link: About Us located at Web Document: #document => Section: navbar-top'
            ],
            [
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Cookies located at Web Document: #document => Section: footer',
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu'
            ],
            [
                'Link: Cookies located at Web Document: #document => Section: footer',
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                None
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                None, None
            ],
        ],
        use_to_pandas=True,
    )


def test_get_navigation_paths_grouped(db_params) -> None:
    df, modelhub = get_objectiv_dataframe_test(db_params)
    funnel = modelhub.get_funnel_discovery()

    agg_nice_names_per_session = (
        df['location_stack'].ls.nice_name
        .sort_by_series(by=[df['moment']]).to_json_array(df.groupby('session_id').group_by)
    )
    assert_equals_data(
        agg_nice_names_per_session,
        expected_columns=['session_id', 'location_stack'],
        expected_data=[
            [
                1,
                [
                    'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                    'Link: logo located at Web Document: #document => Section: navbar-top',
                ],
            ],
            [
                2, ['Link: notebook-product-analytics located at Web Document: #document'],
            ],
            [
                3,
                [
                    'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                    'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                    'Link: cta-repo-button located at Web Document: #document => Section: header'
                ],
            ],
            [
                4,
                [
                    'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                    'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                ],
            ],
            [
                5,
                [
                    'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                    'Link: Cookies located at Web Document: #document => Section: footer',
                ],
            ],
            [
                6, ['Link: About Us located at Web Document: #document => Section: navbar-top'],
            ],
            [
                7, ['Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu'],
            ],
        ],
        use_to_pandas=True,
    )

    bts = funnel.get_navigation_paths(data=df, steps=3, by=['session_id'])

    assert_equals_data(
        bts,
        expected_columns=['session_id', 'location_stack_step_1', 'location_stack_step_2', 'location_stack_step_3'],
        expected_data=[
            [
                1,
                'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                'Link: logo located at Web Document: #document => Section: navbar-top',
                None,
            ],
            [
                2,
                'Link: notebook-product-analytics located at Web Document: #document',
                None,
                None,
            ],
            [
                3,
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
            ],
            [
                3,
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                None,
            ],
            [
                4,
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                None,
            ],
            [
                5,
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Cookies located at Web Document: #document => Section: footer',
                None,
            ],
            [
                6,
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                None,
                None,
            ],
            [
                7,
                'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                None,
                None,
            ],
        ]
    )


def test_get_navigation_paths_filtered(db_params) -> None:
    df, modelhub = get_objectiv_dataframe_test(db_params)
    funnel = modelhub.get_funnel_discovery()
    bts = funnel.get_navigation_paths(data=df, steps=3).materialize()
    step = 'Link: logo located at Web Document: #document => Section: navbar-top'
    bts = bts[bts['location_stack_step_1'] == step]

    assert_equals_data(
        bts,
        expected_columns=[
            'location_stack_step_1', 'location_stack_step_2', 'location_stack_step_3',
        ],
        expected_data=[
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
        ]
    )


def test_filter_navigation_paths_conversion(db_params) -> None:
    df, modelhub = get_objectiv_dataframe_test(db_params)
    funnel = modelhub.get_funnel_discovery()

    df = df[['moment', 'location_stack', 'global_contexts']]

    with pytest.raises(ValueError, match='The is_conversion_event column '
                                         'is missing in the dataframe.'):
        funnel.get_navigation_paths(data=df, steps=3, only_converted_paths=True)

    # add conversion events
    df['application'] = df.global_contexts.gc.application

    df['is_conversion_event'] = False
    # define which data to use as conversion events
    df.loc[df['application'] == 'objectiv-website', 'is_conversion_event'] = True

    # add_conversion_step_column
    bts = funnel.get_navigation_paths(df, steps=3, add_conversion_step_column=True, n_examples=3)

    assert_equals_data(
        bts,
        expected_columns=[
            'location_stack_step_1', 'location_stack_step_2', 'location_stack_step_3',
            '_first_conversion_step_number'
        ],
        expected_data=[
            [
                'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                1
            ],
            [
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                2
            ],
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                3
            ],
        ],
        order_by=['_first_conversion_step_number'],
        use_to_pandas=True,
    )

    # only_converted_paths
    bts = funnel.get_navigation_paths(df, steps=3, only_converted_paths=True, n_examples=3)
    assert_equals_data(
        bts,
        expected_columns=[
            'location_stack_step_1', 'location_stack_step_2', 'location_stack_step_3'
        ],
        expected_data=[
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                None
            ],
        ],
        order_by=['location_stack_step_1'],
        use_to_pandas=True,
    )


def test_get_navigation_paths_start_from_end(db_params):

    df, modelhub = get_objectiv_dataframe_test(db_params)
    funnel = modelhub.get_funnel_discovery()

    bts = funnel.get_navigation_paths(data=df, steps=4, start_from_end=True)
    assert_equals_data(
        bts,
        expected_columns=[
            'location_stack_step_1', 'location_stack_step_2', 'location_stack_step_3', 'location_stack_step_4',
        ],
        expected_data=[
            [
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Cookies located at Web Document: #document => Section: footer',
                'Link: About Us located at Web Document: #document => Section: navbar-top',
                'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Cookies located at Web Document: #document => Section: footer',
                'Link: About Us located at Web Document: #document => Section: navbar-top',
            ],
            [
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Cookies located at Web Document: #document => Section: footer',
            ],
            [
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
                'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
                'Link: cta-repo-button located at Web Document: #document => Section: header',
            ],
            [
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
                'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
            ],
            [
                'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
                'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
            ],
            [
                None,
                'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                'Link: logo located at Web Document: #document => Section: navbar-top',
                'Link: notebook-product-analytics located at Web Document: #document',
            ],
            [
                None, None,
                'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
                'Link: logo located at Web Document: #document => Section: navbar-top'
            ],
        ],
        use_to_pandas=True,
    )
