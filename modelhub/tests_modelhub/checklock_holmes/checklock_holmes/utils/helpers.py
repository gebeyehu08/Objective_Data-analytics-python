import os
from typing import Optional


def create_dir_if_not_exists(dir_name: Optional[str]) -> None:
    """
    Helper for creating provided issues/scripts directory if it does not exist
    """
    if dir_name and not os.path.exists(dir_name):
        os.makedirs(dir_name)
