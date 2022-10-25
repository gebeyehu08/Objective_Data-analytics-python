from typing import Any
from uuid import UUID

import nbformat
from mypy.applytype import Optional
from nbclient.exceptions import CellExecutionError
from papermill.clientwrap import PapermillNotebookClient

from checklock_holmes.checklock_kernel.manager import (
    AsyncChecklockKernelManager
)
from checklock_holmes.checklock_nb_client.execution_manager import (
    WatsonExecutionManager
)
from checklock_holmes.utils.supported_db_engines import SupportedDBEngine


class ChecklockNBClient(PapermillNotebookClient):
    """
    Bases: papermill.clientwrap.PapermillNotebookClient

    Client uses customized ChecklockKernel for executing cells and WatsonExecutionManager as a wrapper for
    execution states.

    For more information:
    https://papermill.readthedocs.io/en/latest/reference/papermill-workflow.html#papermill.clientwrap.PapermillNotebookClient
    """
    def __init__(
        self,
        nb_man: WatsonExecutionManager,
        notebook_name: str,
        db_engine: SupportedDBEngine,
        check_id: UUID,
        **kwargs
    ):
        km = AsyncChecklockKernelManager(notebook_name, db_engine, check_id, **kwargs)
        super(ChecklockNBClient, self).__init__(nb_man, km=km, **kwargs)

    async def async_execute(self, reset_kc: bool = False, **kwargs: Any) -> nbformat.NotebookNode:
        nb = await super().async_execute(reset_kc, **kwargs)

        # shutdown the Kernel after finishing executing the notebook,
        # this way we avoid having dangling processes
        await self._async_cleanup_kernel()
        return nb

    async def async_execute_cell(
        self,
        cell: nbformat.NotebookNode,
        cell_index: int,
        execution_count: Optional[int] = None,
        store_history: bool = True,
    ) -> nbformat.NotebookNode:
        try:
            self.nb_man.cell_start(cell, cell_index)
            await super().async_execute_cell(
                cell=cell,
                cell_index=cell_index,
                execution_count=execution_count,
                store_history=store_history,
            )
        except CellExecutionError as ex:
            self.nb_man.cell_exception(cell, cell_index=cell_index, exception=ex)
        finally:
            self.nb_man.cell_complete(cell, cell_index=cell_index)

        return cell
