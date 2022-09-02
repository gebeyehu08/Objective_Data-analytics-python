"""
Copyright 2022 Objectiv B.V.
"""
from abc import abstractmethod
from typing import Dict, Any

import bach
from bach import get_series_type_from_dtype


class BaseDataPipeline:
    """
    Abstract class that specifies the engine and table from where the pipeline will extract the data.
    Child classes are in charge of implementing:
     - _get_pipeline_result method, which is in charge of generating the correct bach DataFrame
     - validate_pipeline_result method, which is in charge of verifying that the
       pipeline is generating the expected result.
     - result_series_dtypes property, which contains the mapping between the final series
        generated by the pipeline and expected dtype.
    """

    def __call__(self, **kwargs) -> bach.DataFrame:
        result = self._get_pipeline_result(**kwargs)
        self.validate_pipeline_result(result)
        return result

    @abstractmethod
    def validate_pipeline_result(self, result: bach.DataFrame) -> None:
        raise NotImplementedError()

    @abstractmethod
    def _get_pipeline_result(self, **kwargs) -> bach.DataFrame:
        raise NotImplementedError()

    @property
    def result_series_dtypes(self) -> Dict[str, str]:
        """
        Mapping between series generated by pipeline with its respective dtype.
        """
        raise NotImplementedError()

    def _convert_dtypes(self, df: bach.DataFrame) -> bach.DataFrame:
        """
        Helper function that converts each result series to its correct dtype,
        this way we ensure the pipeline is returning the dtypes Modelhub is expecting.

        Returns a bach DataFrame
        """
        df_cp = df.copy()
        for col, dtype in self.result_series_dtypes.items():
            if col not in df_cp.data:
                continue

            df_cp[col] = df_cp[col].astype(dtype)

        return df_cp

    def _validate_data_dtypes(
        self, expected_dtypes: Dict[str, Any], current_dtypes: Dict[str, Any],
    ) -> None:
        """
        Compares dtypes mapping, based on:
            - all keys in expected_dtypes must exist in current_dtypes
            - Series type for expected dtype must be a parent class or same class from
              its respective current dtype. For example:
                expected_dtype = 'json',             current_dtype = 'objectiv_global_context'
                expected_series_type = SeriesJson,   current_series_type = SeriesGlobalContexts

              Therefore, current_dtype is valid.
        """
        missing_columns = set(expected_dtypes.keys()) - set(current_dtypes.keys())
        if missing_columns:
            raise KeyError(
                f'{self.__class__.__name__} expects mandatory columns: {expected_dtypes.keys()}, '
                f'missing: {",".join(missing_columns)}.'
            )

        for expected_key, expected_dtype in expected_dtypes.items():
            current_dtype = current_dtypes[expected_key]

            expected_series_type = get_series_type_from_dtype(expected_dtype)
            current_series_type = get_series_type_from_dtype(current_dtype)
            if (
                expected_series_type != current_series_type
                and not issubclass(current_series_type, expected_series_type)
            ):
                raise ValueError(
                    f'"{expected_key}" must be {expected_dtype} dtype, got {current_dtype}'
                )
