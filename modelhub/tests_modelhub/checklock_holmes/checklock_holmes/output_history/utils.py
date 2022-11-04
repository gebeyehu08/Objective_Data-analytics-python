import base64
from uuid import UUID


def get_output_check_key(
    notebook_name: str,
    db_engine: str,
    check_id: UUID,
) -> str:
    return f'{notebook_name}/{db_engine}/{check_id}'


def get_output_file_key(
    notebook_name: str,
    db_engine: str,
    check_id: UUID,
    cell_source: str,
) -> str:
    encoded_cell_source = base64.b64encode(cell_source.encode())
    check_folder = get_output_check_key(notebook_name, db_engine, check_id)
    return f'{check_folder}/{encoded_cell_source.decode()}.pkl'


def extract_cell_source_from_output_key(output_key: str) -> str:
    encoded_cell_source = output_key.split('/')[-1].split('.pkl')[0]
    return base64.b64decode(encoded_cell_source.encode()).decode()
