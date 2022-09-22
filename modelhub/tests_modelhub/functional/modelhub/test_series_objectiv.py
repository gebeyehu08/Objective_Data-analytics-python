"""
Copyright 2021 Objectiv B.V.
"""
import pytest
from modelhub import __version__  # Any import from modelhub initializes all the types, do not remove
from tests_modelhub.data_and_utils.utils import get_df_with_json_data_real, DBParams
from bach.testing import assert_equals_data


def test_get_real_data(db_params: DBParams):
    bt = get_df_with_json_data_real(db_params)
    assert_equals_data(
        bt,
        use_to_pandas=True,
        expected_columns=['_index_event_id', 'event_id', 'global_contexts', 'location_stack'],
        expected_data=[
            [1, 1, [{'id': 'rod-web-demo', '_type': 'ApplicationContext'}, {'id': 'http_context', '_type': 'HttpContext', 'referrer': 'https://rick.objectiv.io/', 'user_agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0', 'remote_address': '144.144.144.144'}, {'id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b', '_type': 'CookieIdContext', 'cookie_id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b'}], [{'id': '#document', 'url': 'https://rick.objectiv.io/', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'yep', '_type': 'SectionContext'}, {'id': 'cc91EfoBh8A', '_type': 'SectionContext'}]],
            [2, 2, [{'id': 'rod-web-demo', '_type': 'ApplicationContext'}, {'id': 'http_context', '_type': 'HttpContext', 'referrer': 'https://rick.objectiv.io/', 'user_agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0', 'remote_address': '144.144.144.144'}, {'id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b', '_type': 'CookieIdContext', 'cookie_id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b'}], [{'id': '#document', 'url': 'https://rick.objectiv.io/', '_type': 'WebDocumentContext', '_types': ['AbstractContext', 'AbstractLocationContext', 'SectionContext', 'WebDocumentContext']}, {'id': 'navigation', '_type': 'NavigationContext', '_types': ['AbstractContext', 'AbstractLocationContext', 'NavigationContext', 'SectionContext']}]],
            [3, 3, [{'id': 'rod-web-demo', '_type': 'ApplicationContext'}, {'id': 'http_context', '_type': 'HttpContext', 'referrer': 'https://rick.objectiv.io/', 'user_agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0', 'remote_address': '144.144.144.144'}, {'id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b', '_type': 'CookieIdContext', 'cookie_id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b'}], [{'id': '#document', 'url': 'https://rick.objectiv.io/', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'new', '_type': 'SectionContext'}, {'id': 'BeyEGebJ1l4', '_type': 'SectionContext'}]],
            [4, 4, [{'id': 'rod-web-demo', '_type': 'ApplicationContext'}, {'id': 'http_context', '_type': 'HttpContext', 'referrer': 'https://rick.objectiv.io/', 'user_agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0', 'remote_address': '144.144.144.144'}, {'id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b', '_type': 'CookieIdContext', 'cookie_id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b'}], [{'id': '#document', 'url': 'https://rick.objectiv.io/', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'new', '_type': 'SectionContext'}, {'id': 'yBwD4iYcWC4', '_type': 'SectionContext'}]],
            [5, 5, [{'id': 'rod-web-demo', '_type': 'ApplicationContext'}, {'id': 'http_context', '_type': 'HttpContext', 'referrer': 'https://rick.objectiv.io/', 'user_agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0', 'remote_address': '144.144.144.144'}, {'id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b', '_type': 'CookieIdContext', 'cookie_id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b'}], [{'id': '#document', 'url': 'https://rick.objectiv.io/', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'new', '_type': 'SectionContext'}, {'id': 'eYuUAGXN0KM', '_type': 'MediaPlayerContext'}]],
            [6, 6, [{'id': 'rod-web-demo', '_type': 'ApplicationContext'}, {'id': 'http_context', '_type': 'HttpContext', 'referrer': 'https://rick.objectiv.io/', 'user_agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0', 'remote_address': '144.144.144.144'}, {'id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b', '_type': 'CookieIdContext', 'cookie_id': 'f84446c6-eb76-4458-8ef4-93ade596fd5b'}], [{'id': '#document', 'url': 'https://rick.objectiv.io/', '_type': 'WebDocumentContext'}]]
        ]
    )


def test_location_stack_navigation_features(db_params):
    bt = get_df_with_json_data_real(db_params)

    bt['b'] = bt.location_stack.astype('objectiv_location_stack')
    bts = bt.b.location_stack.navigation_features
    assert_equals_data(
        bts,
        expected_columns=['_index_event_id', 'b'],
        expected_data=[
            [1, []],
            [2, [{'id': 'navigation', '_type': 'NavigationContext', '_types': ['AbstractContext', 'AbstractLocationContext', 'NavigationContext', 'SectionContext']}]],
            [3, []],
            [4, []],
            [5, []],
            [6, []]
        ],
        use_to_pandas=True,
    )


def test_location_stack_feature_stack(db_params):
    bt = get_df_with_json_data_real(db_params)

    bt['b'] = bt.location_stack.astype('objectiv_location_stack')
    bts = bt.b.location_stack.feature_stack
    assert_equals_data(
        bts,
        use_to_pandas=True,
        expected_columns=['_index_event_id', 'b'],
        expected_data=[
            [1, [{'id': '#document', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'yep', '_type': 'SectionContext'}, {'id': 'cc91EfoBh8A', '_type': 'SectionContext'}]],
            [2, [{'id': '#document', '_type': 'WebDocumentContext'}, {'id': 'navigation', '_type': 'NavigationContext'}]],
            [3, [{'id': '#document', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'new', '_type': 'SectionContext'}, {'id': 'BeyEGebJ1l4', '_type': 'SectionContext'}]],
            [4, [{'id': '#document', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'new', '_type': 'SectionContext'}, {'id': 'yBwD4iYcWC4', '_type': 'SectionContext'}]],
            [5, [{'id': '#document', '_type': 'WebDocumentContext'}, {'id': 'home', '_type': 'SectionContext'}, {'id': 'new', '_type': 'SectionContext'}, {'id': 'eYuUAGXN0KM', '_type': 'MediaPlayerContext'}]],
            [6, [{'id': '#document', '_type': 'WebDocumentContext'}]]
        ]

    )


@pytest.mark.skip_athena_todo('https://github.com/objectiv/objectiv-analytics/issues/1268')  # TODO: Athena
def test_location_stack_nice_name(db_params):
    bt = get_df_with_json_data_real(db_params)

    bt['b'] = bt.location_stack.astype('objectiv_location_stack')
    bts = bt.b.location_stack.nice_name
    assert_equals_data(
        bts,
        expected_columns=['_index_event_id', 'b'],
        expected_data=[
            [1, 'Section: cc91EfoBh8A located at Web Document: #document => Section: home => Section: yep'],
            [2, 'Navigation: navigation located at Web Document: #document'],
            [3, 'Section: BeyEGebJ1l4 located at Web Document: #document => Section: home => Section: new'],
            [4, 'Section: yBwD4iYcWC4 located at Web Document: #document => Section: home => Section: new'],
            [5, 'Media Player: eYuUAGXN0KM located at Web Document: #document => Section: home => Section: new'],
            [6, 'Web Document: #document']
        ]
    )
