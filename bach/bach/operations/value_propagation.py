"""
Copyright 2022 Objectiv B.V.
"""
from enum import Enum
from typing import Optional, Union, Sequence, List, Dict
from bach import DataFrame, Series
from bach.series.series import WrappedPartition


class ValuePropagationMethod(Enum):
    BACK_FILL = 'bfill'
    FORWARD_FILL = 'ffill'

    @classmethod
    def get_method(cls, method: str) -> 'ValuePropagationMethod':
        if method in ('ffill', 'pad'):
            return cls.FORWARD_FILL

        if method in ('bfill', 'backfill'):
            return cls.BACK_FILL

        raise ValueError(f'"{method}" is not a valid propagation method.')


class ValuePropagation:
    """
    In order to instantiate this class you should provide the following params:
    df: a DataFrame containing all series to be filled by value propagation
    method: a string identifying the ValuePropagationMethod to be used.
        - 'ffill' or 'pad': Fill missing values by propagating the last non-nullable value in each series.
        - 'bfill' or 'backfill: Fill missing values by using the next non-nullable value in each series.
    returns a new DataFrame with filled missing values.

    Steps of how values are propagated:
    1.  Number each row of the sorted DataFrame. The main reason of numbering each row, is because
        bfill is the opposite to ffill, so we can say that it uses a reversed sorting. The issue with this
        is that Bach will always sort NULLS LAST, therefore reversing the order by won't work. By numbering
        each row, we can at least rely on a non-nullable value.

    2. Sort dataframe based on the row number.
            Ascending if method == 'ffill' and descending if method == 'bfill'.
    3. Partition each series to be filled, a partition is the cumulative sum of the total amount
        of observed non-nullable values in the series.
    4. Group the series to be filled by its partition and assign the first value.
    """
    ROW_NUMBER_SERIES_NAME = '__row_number'

    def __init__(self, df: DataFrame, method: str):
        self._df = df
        self._method = ValuePropagationMethod.get_method(method)

    def propagate(
            self,
            sort_by: Optional[Union[str, Sequence[str]]] = None,
            ascending: Union[bool, List[bool]] = True,
            window: Optional[WrappedPartition] = None
    ):
        df = self._df.copy()

        if df.group_by:
            raise ValueError('ffill/bfill cannot be applied on grouped DataFrame. '
                             'please materialize first.')

        if sort_by:
            df = df.sort_values(by=sort_by, ascending=ascending)

        if not df.order_by:
            raise Exception('dataframe must be sorted in order to apply forward or backward fill.')

        # Number each sorted row this way we avoid issues when sorting NULL values
        # since bfill is ffill with reversed sort (this might generate different results)
        base_series = df[df.data_columns[0]]
        # order nulls last in window function, else numbering will be wrong
        window = window or df.groupby().window(na_position='last')
        window_group = list(window.index.keys())

        df[self.ROW_NUMBER_SERIES_NAME] = base_series.window_row_number(window)
        df = df.materialize(node_name='numbered_fillna')

        # sort values by row number
        by = window_group + [self.ROW_NUMBER_SERIES_NAME]
        ascending = self._method == ValuePropagationMethod.FORWARD_FILL

        df = df.sort_values(by=by, ascending=ascending)
        df = self._add_partition_per_data_columns(df, window_group=window_group)

        # sorting is lost due to materialization, still requires it
        df = df.sort_values(by=by, ascending=ascending)
        df = self._propagate_first_value_per_partition(df, window_group=window_group)

        # sort values, this way we respect the provided order by
        df = df.sort_values(by=self.ROW_NUMBER_SERIES_NAME)

        df = df[self._df.data_columns].materialize(node_name='nafilled')

        gb: List[Union[str, Series]] = []
        if window_group:
            if isinstance(window_group, str):
                gb = [window_group]
            elif isinstance(window_group, list):
                gb = window_group

        return df.drop(columns=gb)

    def _add_partition_per_data_columns(
        self,
        df: DataFrame,
        window_group: Optional[Union[str, Sequence[str]]] = None
    ) -> DataFrame:
        """
        Helper function that creates a partition column for each series to be filled
        this column contains the cumulative sum of the total amount of observed non-nullable values
        till the current row.
                Example:
                |   A  | __partition_A |
                |:----:|:-------------:|
                |   1  |       1       |
                | NULL |       1       |
                | NULL |       1       |
                |   3  |       2       |
                | NULL |       2       |
                |   4  |       3       |

        Returns a DataFrame containing a partition series per data column
        """
        from bach.partitioning import WindowFrameMode
        df_cp = df.copy()
        partition_window = df_cp.groupby(window_group).window(mode=WindowFrameMode.ROWS)
        for series_name, series in self._df.data.items():
            partition_name = f'__partition_{series.name}'
            df_cp[partition_name] = 1
            df_cp.loc[series.isnull(), partition_name] = 0
            df_cp[partition_name] = df_cp[partition_name].sum(partition=partition_window)

        return df_cp.materialize(node_name='fillna_partitioning')

    def _propagate_first_value_per_partition(self,
                                             df: DataFrame,
                                             window_group: Optional[Union[str, Sequence[str]]] = None):
        """
        Helper function that fills null values based on partitions
        NULL records are grouped by the partition and filled with the non-nullable value
        respective to the partition
              Example:
              |   A  | __partition_A | filled_A |
              |:----:|:-------------:|:--------:|
              |   1  |       1       |     1    |
              | NULL |       1       |     1    |
              | NULL |       1       |     1    |
              |   3  |       2       |     3    |
              | NULL |       2       |     3    |
              |   4  |       3       |     4    |

        Returns a DataFrame where all data columns are filled
        """
        # fill gaps with the first_value per partition
        df_cp = df.copy()

        gb: List[Union[str, Series]] = []
        if window_group:
            if isinstance(window_group, str):
                gb = [window_group]
            elif isinstance(window_group, list):
                gb = window_group

        initial_columns = self._df.data_columns
        fill_columns = [x for x in initial_columns if x not in gb]

        for series_name in fill_columns:
            partition_series = [df_cp[f'__partition_{series_name}']]
            gb_final = gb + partition_series
            window_first_value = df_cp.groupby(gb_final).window()
            df_cp[series_name] = df_cp[series_name].window_first_value(window_first_value)

        return df_cp.materialize(node_name='fillna_propagated_values')
