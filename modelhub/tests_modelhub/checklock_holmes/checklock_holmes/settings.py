"""
Copyright 2022 Objectiv B.V.
"""
import warnings
from typing import Dict, Optional, Union, cast

from pydantic import BaseSettings, root_validator

from checklock_holmes.models.env_models import (
    DEFAULT_METABASE_ENV, AWSBucketEnvModel, BaseDBEnvModel, BigQueryEnvModel,
    MetaBaseEnvModel
)
from checklock_holmes.utils.supported_db_engines import SupportedDBEngine


class Settings(BaseSettings):
    athena_db: Optional[BaseDBEnvModel] = None
    pg_db: Optional[BaseDBEnvModel] = None
    bq_db: Optional[BigQueryEnvModel] = None

    metabase: MetaBaseEnvModel = DEFAULT_METABASE_ENV

    aws_bucket: Optional[AWSBucketEnvModel] = None

    class Config:
        env_file = './.env'
        env_file_enconding = 'utf-8'
        env_nested_delimiter = '__'

    @property
    def engine_env_var_mapping(self) -> Dict[SupportedDBEngine, BaseDBEnvModel]:
        mapping = {}
        if self.pg_db:
            mapping[SupportedDBEngine.POSTGRES] = self.pg_db

        if self.bq_db:
            mapping[SupportedDBEngine.BIGQUERY] = self.bq_db

        if self.athena_db:
            mapping[SupportedDBEngine.ATHENA] = self.athena_db

        return mapping

    def get_env_variables(self, engine: SupportedDBEngine) -> Dict[str, str]:
        return {
            **(self.engine_env_var_mapping[engine].dict() if engine in self.engine_env_var_mapping else {}),
            **self.metabase.dict(),
        }

    @root_validator()
    def _validate_env_variables(
        cls, values: Dict[str, Optional[Union[BaseDBEnvModel, BigQueryEnvModel]]],
    ) -> Dict[str, Optional[Union[BaseDBEnvModel, BigQueryEnvModel]]]:
        warnings.simplefilter('always')

        for base_db in ['athena_db', 'pg_db']:
            _env_base_db = values.get(base_db)
            if not _env_base_db or not _env_base_db.dsn:
                warnings.warn(
                    message=(
                        f'Cannot run checks for {base_db}. Please define {base_db.upper()}__DSN '
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

        aws_env = values.get('aws_bucket')
        if not aws_env:
            warnings.warn(
                message=(
                    'Cell outputs will be stored locally. '
                    'Please define AWS variables in .env file if you prefer to store files in an S3 bucket'
                ),
                category=UserWarning,
            )

        warnings.simplefilter('ignore')
        return values


settings = Settings()
