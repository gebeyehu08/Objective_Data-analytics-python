"""
Copyright 2022 Objectiv B.V.
"""
from uuid import UUID

import pandas
from ipykernel.ipkernel import IPythonKernel
from ipykernel.kernelapp import IPKernelApp, kernel_aliases, kernel_flags
from traitlets.traitlets import Bool, Dict, Unicode

from checklock_holmes.output_history.handler import OutputHistoryHandler
from checklock_holmes.settings import settings


class ChecklockKernel(IPythonKernel):
    """
    Customized IPythonKernel that includes more information about the notebook check performed by Checklock.
    In this class we can have more control of the messaging between all channels.

    For more information:
     https://ipython.readthedocs.io/en/latest/development/how_ipython_works.html?highlight=kernel#the-ipython-kernel
    """
    implementation = '1.0.0'
    banner = (
        'Kernel used for executing notebooks for Checklock Holmes.'
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.shell.events.register('post_run_cell', self.post_run_cell)

    def post_run_cell(self, result):
        if not self.parent.store_outputs:
            return None

        # skip if it is not a pandas output
        if not isinstance(result.result, (pandas.DataFrame, pandas.Series)):
            return None

        OutputHistoryHandler().write_pandas_object(
            obj=result.result,
            notebook_name=self.parent.notebook_name,
            db_engine=self.parent.db_engine,
            check_id=UUID(self.parent.check_id),
            cell_source=result.info.raw_cell,
        )


class ChecklockKernelApp(IPKernelApp):
    """
    Customized KernelApp in charge of launching the ChecklockKernel.
    """
    aliases = Dict(
        {
            **kernel_aliases,
            'notebook': 'IPKernelApp.notebook_name',
            'db_engine': 'IPKernelApp.db_engine',
            'check_id': 'IPKernelApp.check_id',
        }
    )
    flags = Dict(
        {
            **kernel_flags,
            'store-outputs': (
                {"IPKernelApp": {"store_outputs": True}}, 'store Pandas outputs in AWS Bucket',
            )
        }
    )

    notebook_name: Unicode = Unicode(help='The name of the notebook been executed.').tag(config=True)
    db_engine: Unicode = Unicode(help='The db engine used for query execution').tag(config=True)
    check_id: Unicode = Unicode(help='Unique UUID of current check.').tag(config=True)
    store_outputs: Bool = Bool(help='Flag the enables storing outputs in AWS Bucket.').tag(config=True)


if __name__ == '__main__':
    ChecklockKernelApp.launch_instance(kernel_class=ChecklockKernel)
