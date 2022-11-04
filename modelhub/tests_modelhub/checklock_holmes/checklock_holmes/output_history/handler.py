import json
import pickle
from collections import defaultdict
from typing import Dict, List, Union
from uuid import UUID

import boto3
import pandas as pd
from botocore.exceptions import ClientError

from checklock_holmes.errors.exceptions import OutputHistoryException
from checklock_holmes.models.nb_checker_models import NoteBookCheck
from checklock_holmes.output_history.utils import get_output_file_key
from checklock_holmes.settings import settings

HistoryType = Dict[str, Dict[str, Dict[str, str]]]
OUTPUT_FILE_HISTORY_PATH = 'output_history.json'


class OutputHistoryHandler:
    bucket_name: str

    def __init__(self):
        if not settings.aws_bucket:
            raise OutputHistoryException(Exception('Please setup AWS env variables.'))

        self.bucket_name = settings.aws_bucket.name
        self._client = boto3.client(
            's3',
            region_name=settings.aws_bucket.region_name,
            aws_access_key_id=settings.aws_bucket.access_key_id,
            aws_secret_access_key=settings.aws_bucket.secret_access_key,
        )

    def write_pandas_object(
        self,
        obj: Union[pd.DataFrame, pd.Series],
        notebook_name: str,
        db_engine: str,
        check_id: UUID,
        cell_source: str,
    ) -> None:
        pickled_df = pickle.dumps(obj, protocol=pickle.HIGHEST_PROTOCOL)

        out_key = get_output_file_key(
            notebook_name=notebook_name,
            db_engine=db_engine,
            check_id=check_id,
            cell_source=cell_source,
        )
        self._client.put_object(Bucket=self.bucket_name, Key=out_key, Body=pickled_df)

    def update_history(self, nb_checks: List[NoteBookCheck]) -> None:
        new_history: HistoryType = defaultdict(lambda: defaultdict(dict))
        for nb in nb_checks:
            if not nb.completed:
                continue
            date_key = self._get_date_key(nb)
            new_history[nb.metadata.name][nb.engine][date_key] = str(nb.metadata.check_id)

        # nothing to write
        if not new_history:
            return None

        old_history = self._get_current_history()

        # there is history, so just update check ids
        if old_history:
            new_history = self._merge_histories(old_history, dict(new_history))

        self._client.put_object(
            Bucket=self.bucket_name,
            Key=OUTPUT_FILE_HISTORY_PATH,
            Body=json.dumps(new_history),
        )

    @staticmethod
    def _get_date_key(nb: NoteBookCheck) -> str:
        date_key = ''
        if nb.metadata.start_date:
            date_key = nb.metadata.start_date.strftime('%Y%m%d')
        if nb.metadata.end_date:
            date_key += f"_{nb.metadata.end_date.strftime('%Y%m%d')}"

        date_key = date_key or 'no_date_filters'
        return date_key

    @staticmethod
    def _merge_histories(old_history: HistoryType, new_history: HistoryType) -> HistoryType:
        for nb_name, engine_x_checks in old_history.items():
            if nb_name not in new_history:
                new_history[nb_name] = engine_x_checks
                continue
            for engine, checks in engine_x_checks.items():
                if engine not in new_history[nb_name]:
                    new_history[nb_name][engine] = checks
                    continue
                for date_key, check_id in checks.items():
                    if date_key not in new_history[nb_name][engine]:
                        new_history[nb_name][engine][date_key] = check_id

        return new_history

    def _get_current_history(self) -> HistoryType:
        try:
            obj = self._client.get_object(Bucket=self.bucket_name, Key=OUTPUT_FILE_HISTORY_PATH)
            return json.loads(obj['Body'].read())
        except Exception as exc:
            if isinstance(exc, ClientError) and exc.response['Error']['Code'] == 'NoSuchKey':
                return {}
            raise OutputHistoryException(exc)
