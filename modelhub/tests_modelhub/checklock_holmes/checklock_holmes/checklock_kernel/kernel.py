"""
Copyright 2022 Objectiv B.V.
"""

from ipykernel.ipkernel import IPythonKernel
from ipykernel.kernelapp import IPKernelApp, kernel_aliases
from traitlets.traitlets import Dict, Unicode


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

    notebook_name: Unicode = Unicode(help='The name of the notebook being executed.').tag(config=True)
    db_engine: Unicode = Unicode(help='The db engine used for query execution').tag(config=True)
    check_id: Unicode = Unicode(help='Unique UUID of current check.').tag(config=True)


if __name__ == '__main__':
    ChecklockKernelApp.launch_instance(kernel_class=ChecklockKernel)
