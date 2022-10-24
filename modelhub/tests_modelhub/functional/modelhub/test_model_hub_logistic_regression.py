"""
Copyright 2021 Objectiv B.V.
"""

# Any import from modelhub initializes all the types, do not remove


import pytest
from tests_modelhub.functional.modelhub.logistic_regression_test_utils import LRTestHelper


def test_fitted_model(objectiv_df):
    bt = objectiv_df.copy()
    bt['ts'] = bt['moment'].dt.strftime('%m%d%H%m').astype(dtype=int)
    bt['session'] = bt['session_hit_number'] * 100
    bt['target'] = bt.session_hit_number > 1

    test_lr = LRTestHelper(X=bt[['ts', 'session_hit_number']],
                           y=bt['target'])

    test_lr.test_fitted_model()


@pytest.mark.parametrize("method_name,X,y", [
    ('predict', True, False),
    ('predict_proba', True, False),
    ('score', True, True),
])
def test_model_methods(objectiv_df, method_name, X, y):
    bt = objectiv_df.copy()
    bt['ts'] = bt['moment'].dt.strftime('%m%d%H%m').astype(dtype=int)
    bt['session'] = bt['session_hit_number'] * 100
    bt['target'] = bt.session_hit_number > 1

    test_lr = LRTestHelper(X=bt[['ts', 'session_hit_number', 'session']],
                           y=bt['target'])

    test_lr.test_method(method_name=method_name, X=X, y=y)
