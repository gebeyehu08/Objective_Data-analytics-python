import nbformat
from papermill.engines import NotebookExecutionManager

from checklock_holmes.models.nb_checker_models import CellError


class WatsonExecutionManager(NotebookExecutionManager):
    """
    Extension of Papermill's NotebookExecutionManager which adds more information about cell executions
    and error handling.

    For more information:
    https://papermill.readthedocs.io/en/latest/reference/papermill-workflow.html#papermill.engines.NotebookExecutionManager
    """
    MAX_LOG_EXCEPTION_MESSAGE = 500

    def cell_exception(
        self, cell: nbformat.NotebookNode, cell_index: str = None, **kwargs,
    ) -> None:
        super().cell_exception(cell, cell_index, **kwargs)

        exc = kwargs['exception']

        if self.nb.metadata.papermill.error is None:
            self.nb.metadata.papermill.error = CellError(
                number=cell.metadata.papermill.index,
                exc=f'{exc.ename}: {exc.evalue[:self.MAX_LOG_EXCEPTION_MESSAGE]}',
            )

    def notebook_start(self, **kwargs) -> None:
        super().notebook_start(**kwargs)
        for cell_idx, cell in enumerate(self.nb.cells):
            cell.metadata.papermill.index = cell_idx
