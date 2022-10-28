from uuid import UUID

import nbformat
from papermill.engines import NBClientEngine

from checklock_holmes.checklock_nb_client.execution_manager import (
    WatsonExecutionManager
)
from checklock_holmes.checklock_nb_client.notebook_client import (
    ChecklockNBClient
)
from checklock_holmes.utils.supported_db_engines import SupportedDBEngine


class ChecklockNBEngine(NBClientEngine):
    EXECUTION_TIMEOUT = 2 * 60  # 2 minutes

    @classmethod
    async def async_execute_notebook(
        cls,
        nb: nbformat.NotebookNode,
        notebook_name: str,
        db_engine: SupportedDBEngine,
        check_id: UUID,
    ) -> nbformat.NotebookNode:
        """
        A wrapper to handle notebook execution tasks.

        Wraps the notebook object in a `NotebookExecutionManager` in order to track
        execution state in a uniform manner. This is meant to help simplify
        engine implementations. This allows a developer to just focus on
        iterating and executing the cell contents.
        """
        nb_man = WatsonExecutionManager(
            nb,
            output_path=None,  # don't save notebook outputs
            progress_bar=False,  # ignore for now
            autosave_cell_every=0,  # don't perform any autosave
        )

        nb_man.notebook_start()
        try:
            await cls.async_execute_managed_notebook(
                nb_man=nb_man,
                notebook_name=notebook_name,
                db_engine=db_engine,
                check_id=check_id,
            )
        finally:
            nb_man.cleanup_pbar()
            nb_man.notebook_complete()

        return nb_man.nb

    @classmethod
    async def async_execute_managed_notebook(
        cls,
        nb_man: WatsonExecutionManager,
        notebook_name: str,
        db_engine: SupportedDBEngine,
        check_id: UUID,
    ) -> nbformat.NotebookNode:
        nb_client = ChecklockNBClient(
            nb_man=nb_man,
            notebook_name=notebook_name,
            db_engine=db_engine,
            check_id=check_id,
            timeout=cls.EXECUTION_TIMEOUT,
            interrupt_on_timeout=True,
            allow_errors=True,
            force_raise_errors=True,
        )
        return await nb_client.async_execute()
