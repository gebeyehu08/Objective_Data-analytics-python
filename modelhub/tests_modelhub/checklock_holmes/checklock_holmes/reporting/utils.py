"""
Copyright 2022 Objectiv B.V.
"""
from collections import defaultdict
from datetime import datetime
from typing import Dict, List

from tabulate import tabulate

from checklock_holmes.models.nb_checker_models import NoteBookCheck
from checklock_holmes.models.output_history_models import (
    ComparisonStatus, OutputComparisonReport
)
from checklock_holmes.utils import constants


def store_github_issue(nb_check: NoteBookCheck, github_issues_file: str) -> None:
    """
    If notebook check resulted with an error, it will add an issue to the final check's issue file.
    """
    if not nb_check.error:
        raise Exception('Cannot create issue for a check with no errors.')

    issue_md = constants.GITHUB_ISSUE_TEMPLATE.format(
        notebook=f'{nb_check.metadata.name}.{constants.NOTEBOOK_EXTENSION}',
        engine=nb_check.engine,
        cell_number=nb_check.error.number,
        failing_code=nb_check.failing_block,
        exception=nb_check.error.exc,
    )
    with open(github_issues_file, 'a') as file:
        file.write(issue_md)


def get_github_issue_filename() -> str:
    """
    Generates issue file name based on checking time.
    """
    current_check_time = datetime.now()
    return constants.GITHUB_ISSUE_FILENAME_TEMPLATE.format(
        date_str=current_check_time.strftime(constants.GTIHUB_ISSUE_DATE_STR_FORMAT)
    )


def get_output_reports_filename() -> str:
    """
    Generates output report file name based on checking time.
    """
    current_check_time = datetime.now()
    return constants.OUTPUT_REPORT_FILENAME_TEMPLATE.format(
        date_str=current_check_time.strftime(constants.OUTPUT_REPORT_DATE_STR_FORMAT)
    )


def store_nb_script(nb_scripts_path: str, script: str) -> None:
    """
    Stores the executed script for the notebook
    """
    with open(nb_scripts_path, 'w') as file:
        file.write(script)


def display_check_results(
    nb_checks: List[NoteBookCheck],
    github_files_path: str,
    display_cell_timings: bool,
) -> None:
    """
    Displays final report in console
    """
    data_to_show = []
    failed_checks = 0
    success_checks = 0
    skipped_checks = 0

    headers = constants.REPORT_HEADERS.copy()
    if display_cell_timings:
        headers.append(constants.ELAPSED_TIME_CELL_HEADER)

    for check in nb_checks:
        if check.error:
            failed_checks += 1
            status = 'failed'
        elif check.skipped:
            skipped_checks += 1
            status = 'skipped'
        else:
            success_checks += 1
            status = 'success'

        row = [
            check.metadata.name,
            check.engine,
            status,
            check.error.number if check.error else '',
            check.elapsed_time or '',
        ]
        if display_cell_timings and check.elapsed_time_per_cell:
            row.append('\n'.join(f'#{ct.number} - {ct.time}' for ct in check.elapsed_time_per_cell))

        data_to_show.append(row)

    print(tabulate(data_to_show, headers=headers, tablefmt="simple", floatfmt=".4f"))

    if success_checks:
        perc_success = round(success_checks/len(nb_checks) * 100, 2)
        print(constants.SUCCESS_CHECK_MESSAGE.format(
            success_checks=success_checks, perc_success=perc_success,
        ))

    if skipped_checks:
        perc_skipped = round(skipped_checks/len(nb_checks) * 100, 2)
        print(constants.SKIPPED_CHECK_MESSAGE.format(
            skipped_checks=skipped_checks, perc_skipped=perc_skipped,
        ))

    if failed_checks:
        perc_failed = round(failed_checks/len(nb_checks) * 100, 2)
        print(constants.FAILED_CHECK_MESSAGE.format(failed_checks=failed_checks, perc_failed=perc_failed))
        print(constants.MORE_INFORMATION_FAILED_CHECKS_MESSAGE.format(github_issue_file=github_files_path))


def _generate_output_comparison_file(
    comparison_results: List[OutputComparisonReport], report_filename: str
) -> None:
    str_reports = []
    for report in comparison_results:
        report_title = constants.OUTPUT_REPORT_TITLE_TEMPLATE.format(
            engine=report.db_engine, notebook=report.notebook_name,
        )
        str_results = []
        for result in report.results:
            result_str = constants.OUTPUT_REPORT_COMPARISON_TEMPLATE.format(
                history_file=result.history_file,
                current_file=result.current_file,
                status=result.status.value,
                cell_source=result.cell_source,
            )
            assertion_results_str = ''
            if result.status == ComparisonStatus.DIFFERENT_OUTPUT:
                assertion_results_str = constants.OUTPUT_ASSERTION_ERROR_TEMPLATE.format(
                    difference=result.difference
                )

            str_results.append(result_str + '\n' + assertion_results_str)

        str_reports.append(report_title + '\n'.join(str_results))

    with open(report_filename, 'a') as file:
        file.write('\n'.join(str_reports))


def display_comparison_results(
    comparison_results: List[OutputComparisonReport], output_reports_file_path: str
) -> None:
    if not comparison_results:
        return

    _generate_output_comparison_file(comparison_results, output_reports_file_path)

    headers = constants.OUTPUT_REPORT_CONSOLE_HEADERS.copy()
    data_to_show = []
    for report in comparison_results:
        stats: Dict[ComparisonStatus, int] = defaultdict(int)

        for result in report.results:
            stats[result.status] += 1
        data_to_show += [
            [
                report.notebook_name,
                report.db_engine,
                status.name,
                amount,
            ]
            for status, amount in stats.items()
        ]

    print(tabulate(data_to_show, headers=headers, tablefmt="simple", floatfmt=".4f"))
    print(constants.MORE_INFORMATION_OUTPUT_COMPARISON_CHECKS.format(
        output_report_file=output_reports_file_path)
    )
