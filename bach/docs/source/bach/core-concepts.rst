.. currentmodule:: bach

.. frontmatterposition:: 3

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
has to use Bach slightly different than one would use pandas. This page explains the Bach core design ideas
and their consequences in using Bach.

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


Bach usage tips
------------------

Use simple Series names for cleaner SQL
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
All Series in a Bach DataFrame map directly to database columns with the same name. However, some databases
limit the characters that can be used in column names. To accommodate this, Bach will transparently
map Series names with 'special' characters to different column names.

This does mean that the columns names in the generated SQL query can be different from the names in a
DataFrame. If that's undesired, then stick to Series names only containing the characters `a-z`, `0-9`,
and `\_`, that start with `a-z`, and a maximum length of 63 characters.


Use a data sample to limit the data queried
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Querying big datasets can be very costly in both time and money.
To get a smaller sample of the current DataFrame, use :py:meth:`DataFrame.get_sample()`:

.. code-block:: python

    table_name = 'example-project.writable_dataset.table_name'
    df = df.get_sample(table_name, sample_percentage=10)

This creates a permanent table with 10% of the current data of the DataFrame. The DataFrame `df` will use
this new table in all later operations. One can use :py:meth:`DataFrame.get_unsampled()` to switch the
source table for the DataFrame back to the original table, without undoing any of the operations that have
been done since the sample was created.

Use temporary tables to limit query complexity
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Very complex queries can lead to problems with databases. Sometimes the performance degrades and sometimes
databases might not even be able to execute a query at all.

One solution is to materialize the state of you DataFrame into a temporary table, in between complex
operations.

.. code-block:: python

    df = df.materialize(materialization='temp_table')

Calling :py:meth:`DataFrame.materialize()` does not cause a direct call to the database, but rather changes the SQL
that will be generated later on. That SQL will be split in parts: first the query to create a temporary table
with the current state of the DataFrame, and then the SQL for the following operations. In some cases this
can help the database a lot.

One way of checking SQL complexity is to print the resulting query:

.. code-block:: python

    display_sql_as_markdown(df)
