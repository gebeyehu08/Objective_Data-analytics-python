"""
Copyright 2022 Objectiv B.V.
"""
from uuid import UUID

from checklock_holmes.models.kernel_models import ChecklockKernelConfig
from jupyter_client.kernelspec import KernelSpec
from jupyter_client.manager import AsyncKernelManager

from checklock_holmes.utils.supported_db_engines import SupportedDBEngine


class AsyncChecklockKernelManager(AsyncKernelManager):
    """
    Implementation of Jupyter's AsyncKernelManager. Instead of searching for installed kernel specs,
    it dynamically creates the spec for ChecklockKernel, providing the notebook_name, db_engine
    and check_id.
    """
    def __init__(self, kernel_config: ChecklockKernelConfig, **kwargs,):
        super().__init__(**kwargs)
        self._kernel_spec = self._get_kernel_spec(kernel_config)

    @staticmethod
    def _get_kernel_spec(kernel_config: ChecklockKernelConfig) -> KernelSpec:
        argv = [
            "python", "-m", "checklock_holmes.checklock_kernel.kernel", "-f", "{connection_file}",
            "--notebook", kernel_config.notebook_name,
            "--db_engine", kernel_config.db_engine.value,
            "--check_id", str(kernel_config.check_id)
        ]
        if kernel_config.store_outputs:
            argv.append("--store-outputs")

        return KernelSpec(
            argv=argv,
            env={},
            display_name="Python 3 (extended ipykernel - Checklock)",
            language="python",
            interrupt_mode="signal",
            metadata={},
        )
