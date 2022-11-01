"""
Copyright 2022 Objectiv B.V.
"""

import datetime

import pandas as pd
import pytest
from bach import DataFrame

from modelhub import ModelHub


def test_wrong_date() -> None:
    modelhub = ModelHub()
    engine = modelhub._get_db_engine(db_url='')

    df = DataFrame.from_pandas(
        engine=engine, df=pd.DataFrame(
            {'user_id': ['1'], 'moment': [datetime.datetime(2022, 1, 1)], 'event_type': ['random']}
        ),
        convert_objects=True
    )
    # wrong start_date
    with pytest.raises(ValueError, match="time data '2021-11' does not match format '%Y-%m-%d"):
        modelhub.aggregate.retention_matrix(df,
                                            time_period='daily',
                                            event_type='random',
                                            start_date='2021-11',
                                            percentage=False,
                                            display=False)

     # wrong end_date
    with pytest.raises(ValueError, match="time data '2021-11' does not match format '%Y-%m-%d"):
        modelhub.aggregate.retention_matrix(df,
                                            time_period='daily',
                                            event_type='random',
                                            end_date='2021-11',
                                            percentage=False,
                                            display=False)
