.PHONY: tests

tests:
	mypy bach sql_models
	pycodestyle bach sql_models
	pytest tests/unit tests/functional tests/


tests-athena:
# Similar to `tests`, but tests that can run against multiple databases will be run against Athena instead
# of Postgres. Note that a lot of tests are not yet supported for athena. The postgres-only tests will still
# run against Postgres
	mypy bach sql_models
	pycodestyle bach sql_models
	pytest -n 8 --dist loadgroup --athena tests/unit tests/functional tests/


tests-bigquery:
# Similar to `tests`, but tests that can run against multiple databases will be run against BigQuery instead
# of Postgres. Note that some of our test-suite is postgres-only. The postgres-only tests will still run
# against Postgres
	mypy bach sql_models
	pycodestyle bach sql_models
	pytest -n 8 --dist loadgroup --bigquery tests/unit tests/functional tests/


tests-all:
# Similar to `tests`, but tests that can run against multiple databases will be run against both BigQuery
# and Postgres. Note that most of our test-suite is postgres-only. The postgres-only tests will still only
# run against Postgres
	mypy bach sql_models
	pycodestyle bach sql_models
	pytest -n 8 --dist loadgroup --all tests/unit tests/functional tests/
