import pytest
from bach.testing import assert_equals_data

from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
from sql_models.util import is_athena


def test_visualize_location_stack(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)

    results = modelhub.visualize_location_stack(df, return_df=True, show=False)

    assert_equals_data(
        results,
        expected_columns=['source', 'target', 'value'],
        expected_data=[
            [f'"OverlayContext": "hamburger-menu"', f'"ExpandableSectionContext": "The Project"', 1],
            [f'"OverlayContext": "hamburger-menu"', f'"LinkContext": "About Us"', 1],
            [f'"OverlayContext": "hamburger-menu"', f'"LinkContext": "Contact Us"', 1],
            [f'"OverlayContext": "hamburger-menu"', f'"LinkContext": "Docs"', 1],
            [f'"OverlayContext": "hamburger-menu"', f'"LinkContext": "GitHub"', 1],
            [f'"SectionContext": "footer"', f'"LinkContext": "Cookies"', 1],
            [f'"SectionContext": "header"', f'"LinkContext": "cta-repo-button"', 1],
            [f'"SectionContext": "location-stack"', f'"LinkContext": "cta-docs-location-stack"', 1],
            [f'"SectionContext": "main"', f'"SectionContext": "location-stack"', 1],
            [f'"SectionContext": "main"', f'"SectionContext": "taxonomy"', 1],
            [f'"SectionContext": "navbar-top"', f'"LinkContext": "About Us"', 1],
            [f'"SectionContext": "navbar-top"', f'"LinkContext": "logo"', 1],
            [f'"SectionContext": "navbar-top"', f'"OverlayContext": "hamburger-menu"', 5],
            [f'"SectionContext": "taxonomy"', f'"LinkContext": "cta-docs-taxonomy"', 1],
            [f'"WebDocumentContext": "#document"', f'"LinkContext": "notebook-product-analytics"', 1],
            [f'"WebDocumentContext": "#document"', f'"SectionContext": "footer"', 1],
            [f'"WebDocumentContext": "#document"', f'"SectionContext": "header"', 1],
            [f'"WebDocumentContext": "#document"', f'"SectionContext": "main"', 2],
            [f'"WebDocumentContext": "#document"', f'"SectionContext": "navbar-top"', 7]
        ],
        order_by=['source', 'target'],
        use_to_pandas=True,
    )

    # test custom location stack
    df['ls2'] = df.location_stack.ls[:3]
    # test as string and series
    for ls in ['ls2', df.ls2]:
        results = modelhub.visualize_location_stack(df, location_stack=ls, return_df=True, show=False)

        assert_equals_data(
            results,
            expected_columns=['source', 'target', 'value'],
            expected_data=[
                [f'"SectionContext": "footer"', f'"LinkContext": "Cookies"', 1],
                [f'"SectionContext": "header"', f'"LinkContext": "cta-repo-button"', 1],
                [f'"SectionContext": "main"', f'"SectionContext": "location-stack"', 1],
                [f'"SectionContext": "main"', f'"SectionContext": "taxonomy"', 1],
                [f'"SectionContext": "navbar-top"', f'"LinkContext": "About Us"', 1],
                [f'"SectionContext": "navbar-top"', f'"LinkContext": "logo"', 1],
                [f'"SectionContext": "navbar-top"', f'"OverlayContext": "hamburger-menu"', 5],
                [f'"WebDocumentContext": "#document"', f'"LinkContext": "notebook-product-analytics"', 1],
                [f'"WebDocumentContext": "#document"', f'"SectionContext": "footer"', 1],
                [f'"WebDocumentContext": "#document"', f'"SectionContext": "header"', 1],
                [f'"WebDocumentContext": "#document"', f'"SectionContext": "main"', 2],
                [f'"WebDocumentContext": "#document"', f'"SectionContext": "navbar-top"', 7]
            ],
            order_by=['source', 'target'],
            use_to_pandas=True,
        )
