from uuid import UUID

from checklock_holmes.utils.supported_db_engines import SupportedDBEngine
from pydantic.main import BaseModel


class ChecklockKernelConfig(BaseModel):
    notebook_name: str
    db_engine: SupportedDBEngine
    check_id: UUID
    store_outputs: bool
