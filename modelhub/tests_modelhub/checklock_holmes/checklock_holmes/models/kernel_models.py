from uuid import UUID

from pydantic.main import BaseModel

from checklock_holmes.utils.supported_db_engines import SupportedDBEngine


class ChecklockKernelConfig(BaseModel):
    notebook_name: str
    db_engine: SupportedDBEngine
    check_id: UUID
    store_outputs: bool
