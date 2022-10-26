"""
Copyright 2022 Objectiv B.V.
"""
import re
from dataclasses import dataclass

import nbformat
from checklock_holmes.models.kernel_models import ChecklockKernelConfig
from papermill.iorw import load_notebook_node

from checklock_holmes.checklock_nb_client.notebook_engine import (
    ChecklockNBEngine
)
from checklock_holmes.errors.exceptions import CuriousIncident
from checklock_holmes.models.nb_checker_models import (
    CellTiming, NoteBookCheck, NoteBookMetadata
)
from checklock_holmes.settings import settings
from checklock_holmes.utils.cell_tags import CellTags
from checklock_holmes.utils.constants import (
    DATE_FORMAT, NB_SCRIPT_TO_STORE_TEMPLATE, SET_ENV_VARIABLE_TEMPLATE
)
from checklock_holmes.utils.supported_db_engines import SupportedDBEngine


@dataclass
class NoteBookChecker:
    metadata: NoteBookMetadata

    _DEFAULT_ENV_VARIABLES = {
        'OBJECTIV_VERSION_CHECK_DISABLE': 'true'
    }
    _ENV_VAR_CELL_TAG = 'injected-engine-variables'

    async def async_check_notebook(
        self, engine: SupportedDBEngine, store_outputs: bool = False,
    ) -> NoteBookCheck:
        """
        Creates and executes the notebook's script for the provided engine.

        Returns a generated report based on the execution.
        """
        # skip checks for engines without env variables
        if engine not in settings.engine_env_var_mapping:
            return NoteBookCheck(
                metadata=self.metadata,
                engine=engine,
                skipped=True,
            )

        try:
            kernel_config = ChecklockKernelConfig(
                notebook_name=self.metadata.name,
                db_engine=engine,
                check_id=self.metadata.check_id,
                store_outputs=store_outputs,
            )
            executed_nb = await ChecklockNBEngine.async_execute_notebook(
                nb=self._load_notebook_node(engine),
                kernel_config=kernel_config,
            )
        except Exception as exc:
            raise CuriousIncident(notebook_name=self.metadata.name, exc=exc)

        failing_block = ''
        cell_timings = []
        for idx, cell in enumerate(executed_nb.cells):
            # ignore env setup and markdown cells
            if self._ENV_VAR_CELL_TAG in cell.metadata.tags or cell.cell_type != 'code':
                continue

            cell_exec_data = cell.metadata.papermill
            if cell_exec_data.exception is True:
                failing_block = cell.source
                break

            cell_timings.append(
                CellTiming(number=idx, time=cell_exec_data.duration)
            )

        notebook_exec_data = executed_nb.metadata.papermill
        return NoteBookCheck(
            metadata=self.metadata,
            engine=engine,
            completed=notebook_exec_data.exception is None,
            error=notebook_exec_data.error,
            failing_block=failing_block,
            elapsed_time=notebook_exec_data.duration,
            elapsed_time_per_cell=cell_timings,
        )

    def get_script(self, engine: SupportedDBEngine) -> str:
        """
        Extracts all code cells from the notebook and generates a script based on it.
        If is_execution is True, then code cells will be wrapped for error logging
        and (if required) timing loging. Otherwise, cells will be added as found in the notebook.

        When executing, we ignore cells containing only comments as this will generate errors when
        executing the script.
        """
        formatted_blocks = []
        nb_node = self._load_notebook_node(engine)
        for cell_index, cell in enumerate(nb_node.cells):
            if cell.cell_type != 'code':
                continue

            formatted_block = f'\n# CELL {cell_index}\n{cell.source}'
            formatted_blocks.append(formatted_block.replace('\n', '\n    '))

        nb_script = '\n'.join(formatted_blocks)
        if self.metadata.name:
            # creates script for debugging
            # the template defines a function for the entire notebook
            # and adds a call to it in if __name__ == '__main__'
            nb_script = NB_SCRIPT_TO_STORE_TEMPLATE.format(
                notebook=re.sub(r'(-|\s)+', '_', self.metadata.name),
                script=nb_script.strip(),
            )

        return nb_script

    def _get_env_setup_block(self, engine: SupportedDBEngine) -> str:
        """
        Returns the code block for setting env variables based on the engine to use.
        """
        env_variables = settings.get_env_variables(engine)
        env_variables.update(self._DEFAULT_ENV_VARIABLES)
        env_variables_stmt = '\n'.join(
            [
                SET_ENV_VARIABLE_TEMPLATE.format(
                    env_var_name=env_var, env_var_value=val,
                )
                for env_var, val in env_variables.items()
            ]
        )
        return f'# env variables setup\nimport os\n{env_variables_stmt}'

    def _load_notebook_node(
        self,
        engine: SupportedDBEngine,
    ) -> nbformat.NotebookNode:
        nb_node = load_notebook_node(notebook_path=self.metadata.path)
        nb_node.metadata['papermill']['error'] = None

        env_cell = nbformat.v4.new_code_cell(source=self._get_env_setup_block(engine))
        env_cell.metadata['checklock_tags'] = [CellTags.INJECTED_ENGINE_VARIABLES]
        env_cell.metadata['tags'] = [CellTags.INJECTED_ENGINE_VARIABLES.value]

        env_cell.metadata['papermill'] = {}
        nb_node.cells = [env_cell] + nb_node.cells
        return self._tag_notebook_cells(nb_node)

    def _tag_notebook_cells(self, nb_node: nbformat.NotebookNode) -> nbformat.NotebookNode:
        _GET_OBJECTIV_DF_REGEX = re.compile(r'get_objectiv_dataframe\((?P<params>.*)\)', re.MULTILINE)

        default_obj_params = []

        if self.metadata.start_date:
            default_obj_params.append(f'start_date="{self.metadata.start_date.strftime(DATE_FORMAT)}"')

        if self.metadata.end_date:
            default_obj_params.append(f'end_date="{self.metadata.end_date.strftime(DATE_FORMAT)}"')

        for cell in nb_node.cells:
            if cell.metadata.get('checklock_tags') or cell.cell_type != 'code':
                continue

            tags = CellTags.get_tags(cell.source)

            cell.metadata['checklock_tags'] = tags
            cell.metadata['tags'].extend([tag.value for tag in tags])

            if (
                CellTags.GET_OBJECTIV_DATAFRAME in tags
                and (self.metadata.start_date or self.metadata.end_date)
            ):
                match = _GET_OBJECTIV_DF_REGEX.search(cell.source)
                params = match.group('params').split(',') if match else []

                new_params = default_obj_params.copy()
                for param in params:

                    if 'start_date' in param and self.metadata.start_date:
                        continue

                    if 'end_date' in param and self.metadata.end_date:
                        continue

                    new_params.append(param.strip())

                cell.source = _GET_OBJECTIV_DF_REGEX.sub(
                    f'get_objectiv_dataframe({", ".join(new_params)})', cell.source
                )

        return nb_node
