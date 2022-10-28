"""
Copyright 2022 Objectiv B.V.
"""
from uuid import UUID

from jupyter_client.kernelspec import KernelSpec
from jupyter_client.manager import AsyncKernelManager

from checklock_holmes.utils.supported_db_engines import SupportedDBEngine


class AsyncChecklockKernelManager(AsyncKernelManager):
    """
    Implementation of Jupyter's AsyncKernelManager. Instead of searching for installed kernel specs,
    it dynamically creates the spec for ChecklockKernel, providing the notebook_name, db_engine
    and check_id.
    """
    def __init__(
        self,
        notebook_name: str,
        db_engine: SupportedDBEngine,
        check_id: UUID,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._kernel_spec = self._get_kernel_spec(
            notebook_name, db_engine, check_id,
        )

    @staticmethod
    def _get_kernel_spec(
        notebook_name: str, db_engine: SupportedDBEngine, check_id: UUID
    ) -> KernelSpec:
        argv = [
            "python3", "-m", "checklock_holmes.checklock_kernel.kernel", "-f", "{connection_file}",
            "--notebook", notebook_name, "--db_engine", db_engine.value, "--check_id", str(check_id)
        ]
        return KernelSpec(
            argv=argv,
            env={},
            display_name="Python 3 (extended ipykernel - Checklock)",
            language="python",
            interrupt_mode="signal",
            metadata={},
        )
