.. _bach_core_concepts:

.. currentmodule:: bach

.. frontmatterposition:: 1

=============
Core Concepts
=============
Bach aims to make life for the DS as simple and powerful as possible by using a pandas-compatible API.

There are some differences between Bach's API and pandas's API:
We haven't yet implemented all pandas functions, we have some functions that pandas doesn't have, and some
of our functions have slightly different parameters.
Having said that, anyone that already knows pandas can get started with Bach in mere minutes.

The fundamental difference between pandas and Bach is how data is stored: in-memory versus in-database.
Storing all data in databases is what allows Bach to work on huge datasets. But as a result, one sometimes
has to use Bach slightly different than one would use pandas. This page explains the core design ideas and 
their consequences in using Bach.

Delayed database operations
---------------------------
Regular operations on DataFrames and Series do not trigger any operations on the database, nor do they
transfer any data from the database to Bach. All operations are combined and compiled to a single SQL query,
which is executed only when one of a few specific data-transfer functions is called on either a DataFrame or
a Series object:

* :py:meth:`DataFrame.to_pandas()` or :py:meth:`Series.to_pandas()`
* :py:meth:`DataFrame.head()` or :py:meth:`Series.head()`
* :py:meth:`DataFrame.to_numpy()` or :py:meth:`Series.to_numpy()`
* The property accessors :py:attr:`Series.array` and :py:attr:`Series.value`
* :py:meth:`DataFrame.unstack()` or :py:meth:`Series.unstack()`
* :py:meth:`DataFrame.get_dummies()`

Typical usage would be to do all heavy lifting inside the database, and only query the aggregated/summarized
output.

Additionally there are operations that write to the database:

* :py:meth:`DataFrame.database_create_table()`
* :py:meth:`DataFrame.from_pandas()`, when called with `materialization='table'`
* :py:meth:`DataFrame.get_sample()`

Differences with pandas
---------------------------

* The order of rows in a Bach DataFrame can be non-deterministic. If there is no deterministic
  :py:meth:`DataFrame.sort_values()` or :py:meth:`DataFrame.fillna()` call, then the order of the rows that
  the data-transfer functions return can be unpredictable. In case for :py:meth:`DataFrame.fillna()`,
  methods `ffill` and `bfill` might fill gaps with different values since rows containing `NULL`/`None` can
  yield a different order of rows.
* Bach DataFrames can distinguish between missing values (`NULL`/`None`) and Not-a-Number (`NaN`). Pandas
  generally doesn't, and uses `NaN` to represent missing values. When outputting data from a Bach DataFrame
  to a pandas DataFrame, most of this distinction is lost again.
* All Bach Series map directly to database columns in either a table, view, or table expression. As a result
  all series names within a DataFrame must be non-empty, unique, and the length is limited (generally 63
  characters). Pandas does not have these limitations.

Best Practices
--------------
See the :ref:`Best Practices <bach_best_practices>` section in the Usage page for some tips that might not be 
obvious, even for experienced pandas users.