"""
Copyright 2021 Objectiv B.V.
"""
import pytest

from tests.unit.buhtuh.util import get_fake_df_test_data


def test_set_existing_index():
    # Test that we get an appropriate error when we try to set an index column
    bt = get_fake_df_test_data()
    # should work: new column
    bt['x'] = 1
    # should work: override existing column
    bt['city'] = 1
    # should not work: override index. Cannot set index, and cannot have same column
    with pytest.raises(ValueError, match='already exists as index'):
        bt['_index_skating_order'] = 1
