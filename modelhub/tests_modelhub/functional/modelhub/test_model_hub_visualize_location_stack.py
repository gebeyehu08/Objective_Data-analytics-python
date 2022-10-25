import pytest
from bach.testing import assert_equals_data

from modelhub import ModelHub


def test_visualize_location_stack(objectiv_df):
    modelhub = ModelHub()

    results = modelhub.visualize_location_stack(objectiv_df, return_df=True, show=False)

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

    # test custom location stack
    objectiv_df['ls2'] = objectiv_df.location_stack.ls[:3]
    # test as string and series
    for ls in ['ls2', objectiv_df.ls2]:
        results = modelhub.visualize_location_stack(objectiv_df, location_stack=ls, return_df=True, show=False)

        assert_equals_data(
            results,
            expected_columns=['source', 'target', 'value'],
            expected_data=[
                ['"SectionContext": "footer"', '"LinkContext": "Cookies"', 1],
                ['"SectionContext": "header"', '"LinkContext": "cta-repo-button"', 1],
                ['"SectionContext": "main"', '"SectionContext": "location-stack"', 1],
                ['"SectionContext": "main"', '"SectionContext": "taxonomy"', 1],
                ['"SectionContext": "navbar-top"', '"LinkContext": "About Us"', 1],
                ['"SectionContext": "navbar-top"', '"LinkContext": "logo"', 1],
                ['"SectionContext": "navbar-top"', '"OverlayContext": "hamburger-menu"', 5],
                ['"WebDocumentContext": "#document"', '"LinkContext": "notebook-product-analytics"', 1],
                ['"WebDocumentContext": "#document"', '"SectionContext": "footer"', 1],
                ['"WebDocumentContext": "#document"', '"SectionContext": "header"', 1],
                ['"WebDocumentContext": "#document"', '"SectionContext": "main"', 2],
                ['"WebDocumentContext": "#document"', '"SectionContext": "navbar-top"', 7]
            ],
            order_by=['source', 'target'],
            use_to_pandas=True,
        )
