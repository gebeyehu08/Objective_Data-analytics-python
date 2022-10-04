import bach
import pytest
from bach import SortColumn
from bach.testing import assert_equals_data

from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test

pytestmark = pytest.mark.skip_athena_todo('https://github.com/objectiv/objectiv-analytics/issues/1264')  # TODO: Athena

def test_visualize_location_stack(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)

    results = modelhub.visualize_location_stack(df, return_df=True)

    assert_equals_data(
        results,
        expected_columns=['source', 'target', 'value'],
        expected_data=[
            ['"OverlayContext": "hamburger-menu"', '"ExpandableSectionContext": "The Project"', 1],
            ['"OverlayContext": "hamburger-menu"', '"LinkContext": "About Us"', 1],
            ['"OverlayContext": "hamburger-menu"', '"LinkContext": "Contact Us"', 1],
            ['"OverlayContext": "hamburger-menu"', '"LinkContext": "Docs"', 1],
            ['"OverlayContext": "hamburger-menu"', '"LinkContext": "GitHub"', 1],
            ['"SectionContext": "footer"', '"LinkContext": "Cookies"', 1],
            ['"SectionContext": "header"', '"LinkContext": "cta-repo-button"', 1],
            ['"SectionContext": "location-stack"', '"LinkContext": "cta-docs-location-stack"', 1],
            ['"SectionContext": "main"', '"SectionContext": "location-stack"', 1],
            ['"SectionContext": "main"', '"SectionContext": "taxonomy"', 1],
            ['"SectionContext": "navbar-top"', '"LinkContext": "About Us"', 1],
            ['"SectionContext": "navbar-top"', '"LinkContext": "logo"', 1],
            ['"SectionContext": "navbar-top"', '"OverlayContext": "hamburger-menu"', 5],
            ['"SectionContext": "taxonomy"', '"LinkContext": "cta-docs-taxonomy"', 1],
            ['"WebDocumentContext": "#document"', '"LinkContext": "notebook-product-analytics"', 1],
            ['"WebDocumentContext": "#document"', '"SectionContext": "footer"', 1],
            ['"WebDocumentContext": "#document"', '"SectionContext": "header"', 1],
            ['"WebDocumentContext": "#document"', '"SectionContext": "main"', 2],
            ['"WebDocumentContext": "#document"', '"SectionContext": "navbar-top"', 7]
        ],
        order_by=['source', 'target'],
        use_to_pandas=True,
    )
