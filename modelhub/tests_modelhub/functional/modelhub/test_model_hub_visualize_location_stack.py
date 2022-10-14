import pytest
from bach.testing import assert_equals_data

from tests_modelhub.data_and_utils.utils import get_objectiv_dataframe_test
from sql_models.util import is_athena


def test_visualize_location_stack(db_params):
    df, modelhub = get_objectiv_dataframe_test(db_params)

    results = modelhub.visualize_location_stack(df, return_df=True)

    quotes = ''
    if not is_athena(df.engine):
        # selections from json objects are not quoted in Athena
        quotes = '"'

    assert_equals_data(
        results,
        expected_columns=['source', 'target', 'value'],
        expected_data=[
            [f'{quotes}OverlayContext{quotes}: {quotes}hamburger-menu{quotes}', f'{quotes}ExpandableSectionContext{quotes}: {quotes}The Project{quotes}', 1],
            [f'{quotes}OverlayContext{quotes}: {quotes}hamburger-menu{quotes}', f'{quotes}LinkContext{quotes}: {quotes}About Us{quotes}', 1],
            [f'{quotes}OverlayContext{quotes}: {quotes}hamburger-menu{quotes}', f'{quotes}LinkContext{quotes}: {quotes}Contact Us{quotes}', 1],
            [f'{quotes}OverlayContext{quotes}: {quotes}hamburger-menu{quotes}', f'{quotes}LinkContext{quotes}: {quotes}Docs{quotes}', 1],
            [f'{quotes}OverlayContext{quotes}: {quotes}hamburger-menu{quotes}', f'{quotes}LinkContext{quotes}: {quotes}GitHub{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}footer{quotes}', f'{quotes}LinkContext{quotes}: {quotes}Cookies{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}header{quotes}', f'{quotes}LinkContext{quotes}: {quotes}cta-repo-button{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}location-stack{quotes}', f'{quotes}LinkContext{quotes}: {quotes}cta-docs-location-stack{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}main{quotes}', f'{quotes}SectionContext{quotes}: {quotes}location-stack{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}main{quotes}', f'{quotes}SectionContext{quotes}: {quotes}taxonomy{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', f'{quotes}LinkContext{quotes}: {quotes}About Us{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', f'{quotes}LinkContext{quotes}: {quotes}logo{quotes}', 1],
            [f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', f'{quotes}OverlayContext{quotes}: {quotes}hamburger-menu{quotes}', 5],
            [f'{quotes}SectionContext{quotes}: {quotes}taxonomy{quotes}', f'{quotes}LinkContext{quotes}: {quotes}cta-docs-taxonomy{quotes}', 1],
            [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}LinkContext{quotes}: {quotes}notebook-product-analytics{quotes}', 1],
            [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}footer{quotes}', 1],
            [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}header{quotes}', 1],
            [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}main{quotes}', 2],
            [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', 7]
        ],
        order_by=['source', 'target'],
        use_to_pandas=True,
    )

    # test custom location stack
    df['ls2'] = df.location_stack.ls[:3]
    # test as string and series
    for ls in ['ls2', df.ls2]:
        results = modelhub.visualize_location_stack(df, location_stack=ls, return_df=True)

        assert_equals_data(
            results,
            expected_columns=['source', 'target', 'value'],
            expected_data=[
                [f'{quotes}SectionContext{quotes}: {quotes}footer{quotes}', f'{quotes}LinkContext{quotes}: {quotes}Cookies{quotes}', 1],
                [f'{quotes}SectionContext{quotes}: {quotes}header{quotes}', f'{quotes}LinkContext{quotes}: {quotes}cta-repo-button{quotes}', 1],
                [f'{quotes}SectionContext{quotes}: {quotes}main{quotes}', f'{quotes}SectionContext{quotes}: {quotes}location-stack{quotes}', 1],
                [f'{quotes}SectionContext{quotes}: {quotes}main{quotes}', f'{quotes}SectionContext{quotes}: {quotes}taxonomy{quotes}', 1],
                [f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', f'{quotes}LinkContext{quotes}: {quotes}About Us{quotes}', 1],
                [f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', f'{quotes}LinkContext{quotes}: {quotes}logo{quotes}', 1],
                [f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', f'{quotes}OverlayContext{quotes}: {quotes}hamburger-menu{quotes}', 5],
                [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}LinkContext{quotes}: {quotes}notebook-product-analytics{quotes}', 1],
                [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}footer{quotes}', 1],
                [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}header{quotes}', 1],
                [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}main{quotes}', 2],
                [f'{quotes}WebDocumentContext{quotes}: {quotes}#document{quotes}', f'{quotes}SectionContext{quotes}: {quotes}navbar-top{quotes}', 7]
            ],
            order_by=['source', 'target'],
            use_to_pandas=True,
        )
