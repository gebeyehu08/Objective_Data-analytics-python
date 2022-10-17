"""
Copyright 2022 Objectiv B.V.
"""
import warnings
from typing import Dict, Optional, Union, cast

from pydantic import BaseSettings, root_validator

from checklock_holmes.models.env_models import (
    DEFAULT_METABASE_ENV, BaseDBEnvModel, BigQueryEnvModel, MetaBaseEnvModel
)
from checklock_holmes.utils.supported_engines import SupportedEngine


class Settings(BaseSettings):
    athena_db: Optional[BaseDBEnvModel] = None
    pg_db: Optional[BaseDBEnvModel] = None
    bq_db: Optional[BigQueryEnvModel] = None

    metabase: MetaBaseEnvModel = DEFAULT_METABASE_ENV

    class Config:
        env_file = './.env'
        env_file_enconding = 'utf-8'
        env_nested_delimiter = '__'

    @property
    def engine_env_var_mapping(self) -> Dict[SupportedEngine, BaseDBEnvModel]:
        mapping = {}
        if self.pg_db:
            mapping[SupportedEngine.POSTGRES] = self.pg_db

        if self.bq_db:
            mapping[SupportedEngine.BIGQUERY] = self.bq_db

        if self.athena_db:
            mapping[SupportedEngine.ATHENA] = self.athena_db

        return mapping

    def get_env_variables(self, engine: SupportedEngine) -> Dict[str, str]:
        return {
            **(self.engine_env_var_mapping[engine].dict() if engine in self.engine_env_var_mapping else {}),
            **self.metabase.dict(),
        }

    @root_validator()
    def _validate_db_env(
        cls, values: Dict[str, Optional[Union[BaseDBEnvModel, BigQueryEnvModel]]],
    ) -> Dict[str, Optional[Union[BaseDBEnvModel, BigQueryEnvModel]]]:
        warnings.simplefilter('always')

        for base_db in ['athena_db', 'pg_db']:
            _env_base_db = values.get(base_db)
            if not _env_base_db or not _env_base_db.dsn:
                warnings.warn(
                    message=(
                        f'Cannot run checks for Postgres. Please define {base_db.upper()}__DSN '
                        'variable in .env file'
                    ),
                    category=UserWarning,
                )
                values[base_db] = None

        bq_db = cast(Optional[BigQueryEnvModel], values.get('bq_db'))
        if not bq_db or not(bq_db.dsn and bq_db.google_application_credentials):
            warnings.warn(
                message=(
                    'Cannot run checks for BigQuery. '
                    'Please define BQ_DB__DSN and BQ_DB__CREDENTIALS_PATH variables in .env file'
                ),
                category=UserWarning,
            )
            values['bq_db'] = None

        warnings.simplefilter('ignore')
        return values


settings = Settings()
