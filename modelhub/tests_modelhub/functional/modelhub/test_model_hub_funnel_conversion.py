# """
# Copyright 2022 Objectiv B.V.
# """
#
# from decimal import Decimal
# import pytest
#
# # Any import from modelhub initializes all the types, do not remove
# from modelhub import __version__
# from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
# from tests.functional.bach.test_data_and_utils import assert_equals_data
#
#
# def test_funnel_conversion(db_params):
#     df, modelhub = get_objectiv_dataframe_test(db_params)
#
#     # completion_column
#     with pytest.raises(ValueError, match='some_column column is missing.'):
#         modelhub.agg.funnel_conversion(df, completion_column='some_column')
#
#     df['feature_nice_name'] = df.location_stack.ls.nice_name.str.lower().str[:7]
#     df['completion'] = df['session_hit_number'] == 1
#
#     columns = ['step', 'n_users', 'step_conversion_rate',
#                'full_conversion_rate', 'dropoff_percentage']
#
#     # location_stack
#     bts = modelhub.agg.funnel_conversion(df, completion_column='completion',
#                                          location_stack='feature_nice_name')
#     assert_equals_data(
#         bts[columns],
#         expected_columns=columns,
#         expected_data=[
#             ['link: c', 3, Decimal('0.67'), Decimal('0.67'), 50.0],
#             ['link: a', 2, Decimal('1.00'), Decimal('0.67'), 25.0],
#             ['link: g', 1, Decimal('1.00'), Decimal('0.33'), None],
#             ['link: l', 1, Decimal('0.00'), Decimal('0.00'), None],
#             ['link: n', 1, Decimal('1.00'), Decimal('0.33'), None],
#             ['link: d', 1, Decimal('1.00'), Decimal('0.33'), 25.0],
#             ['expanda', 1, Decimal('0.00'), Decimal('0.00'), None],
#         ],
#     )
#
#     # location_stack - default
#     bts = modelhub.agg.funnel_conversion(df, completion_column='completion',
#                                          location_stack=None)
#     assert_equals_data(
#         bts[columns],
#         expected_columns=columns,
#         expected_data=[
#             [
#                 'Expandable Section: The Project located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
#                 1, 0.0, 0.0, None
#             ],
#             [
#                 'Link: About Us located at Web Document: #document => Section: navbar-top',
#                 1, 1.0, 1.0, 25.0
#             ],
#             [
#                 'Link: About Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
#                 1, 1.0, 1.0, None
#             ],
#             [
#                 'Link: Contact Us located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
#                 1, 0.0, 0.0, 25.0],
#             [
#                 'Link: Cookies located at Web Document: #document => Section: footer', 1, 1.0, 1.0, None],
#             [
#                 'Link: cta-docs-location-stack located at Web Document: #document => Section: main => Section: location-stack',
#                 1, 0.0, 0.0, None
#             ],
#             [
#                 'Link: cta-docs-taxonomy located at Web Document: #document => Section: main => Section: taxonomy',
#                 1, 1.0, 1.0, None
#             ],
#             [
#                 'Link: cta-repo-button located at Web Document: #document => Section: header',
#                 1, 0.0, 0.0, 25.0
#             ],
#             [
#                 'Link: Docs located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
#                 1, 1.0, 1.0, 25.0
#             ],
#             [
#                 'Link: GitHub located at Web Document: #document => Section: navbar-top => Overlay: hamburger-menu',
#                 1, 1.0, 1.0, None
#             ],
#             [
#                 'Link: logo located at Web Document: #document => Section: navbar-top',
#                 1, 0.0, 0.0, None
#             ],
#             [
#                 'Link: notebook-product-analytics located at Web Document: #document',
#                 1, 1.0, 1.0, None
#             ],
#         ],
#     )
#
#     # steps_list
#     bts = modelhub.agg.funnel_conversion(df, completion_column='completion',
#                                          location_stack='feature_nice_name',
#                                          steps_list=['link: c', 'link: a', 'link: d'])
#     assert_equals_data(
#         bts[columns],
#         expected_columns=columns,
#         expected_data=[
#             ['link: c', 3, Decimal('0.67'), Decimal('0.67'), 50.0],
#             ['link: a', 2, Decimal('1.00'), Decimal('0.67'), 25.0],
#             ['link: d', 1, Decimal('1.00'), Decimal('0.33'), 25.0],
#         ],
#     )
