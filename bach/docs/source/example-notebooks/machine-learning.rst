.. _example_machine_learning:

.. frontmatterposition:: 12

.. currentmodule:: bach

================
Bach and sklearn
================

This example notebook shows how you can use Objectiv to create a basic feature set and use sklearn to do 
Machine Learning directly on the raw data in your SQL database. We also have an example that goes deeper into
:doc:` feature engineering <./feature-engineering>`.

This notebook is also available as a `full Jupyter notebook 
<https://github.com/objectiv/objectiv-analytics/blob/main/notebooks/machine-learning.ipynb>`_
to run on your own data (see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`).
The dataset used here is the same as in `Objectiv Go </docs/home/go/>`__.

Get started
-----------
We first have to instantiate the model hub and an Objectiv DataFrame object.

.. doctest:: machine-learning
	:skipif: engine is None

	>>> # set the timeframe of the analysis
	>>> start_date = '2022-03-01'
	>>> end_date = None

.. we override the timeframe for the doctests below
	
.. doctest:: machine-learning
	:hide:

	>>> start_date = '2022-03-01'
	>>> end_date = '2022-06-30'
	>>> pd.set_option('display.max_colwidth', 93)

.. doctest:: machine-learning
	:skipif: engine is None

	>>> from modelhub import ModelHub, display_sql_as_markdown
	>>> from sklearn import cluster
	>>> # instantiate the model hub and set the default time aggregation to daily
	>>> modelhub = ModelHub(time_aggregation='%Y-%m-%d')
	>>> # get a Bach DataFrame with Objectiv data within a defined timeframe
	>>> df = modelhub.get_objectiv_dataframe(start_date=start_date, end_date=end_date)

This object points to all data in the dataset, which is too large to run in pandas and therefore sklearn. For 
the dataset that we need, we will aggregate to user level, at which point it is small enough to fit in memory.

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.ModelHub <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub>`
	* :doc:`modelhub.ModelHub.get_objectiv_dataframe <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.get_objectiv_dataframe>`

Create the dataset
------------------

We'll create a dataset of all the root locations that a user clicked on, per user.

.. doctest:: machine-learning
	:skipif: engine is None

	>>> df['root'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')
	>>> # root series is later unstacked and its values might contain dashes
	>>> # which are not allowed in BigQuery column names, lets replace them
	>>> df['root'] = df['root'].str.replace('-', '_')

.. doctest:: machine-learning
	:skipif: engine is None

	>>> features = df[(df.event_type=='PressEvent')].groupby('user_id').root.value_counts()
	>>> features.head()
	user_id                               root
	8d3f2b11-bbc6-46ef-ae71-00b7d6cccf02  modeling    195
	                                      home        150
	995701a7-a950-4100-b0b8-4382b45544c9  modeling    128
	925b7b60-dba0-4b9a-a5ee-8837924e7fc5  tracking     93
	b4b5ce02-7215-4193-9417-2df2faae4b03  modeling     74
	Name: value_counts, dtype: int64

.. doctest:: machine-learning
	:skipif: engine is None

	>>> features_unstacked = features.unstack(fill_value=0)
	>>> # sample or not
	>>> kmeans_frame = features_unstacked
	>>> # for BigQuery the table name should be 'YOUR_PROJECT.YOUR_WRITABLE_DATASET.YOUR_TABLE_NAME'
	>>> kmeans_frame = features_unstacked.get_sample(table_name='kmeans_test', sample_percentage=50, overwrite=True)

Now we have a basic feature set that is small enough to fit in memory. This can be used with sklearn, as we
demonstrate in this example.

.. admonition:: Reference
	:class: api-reference

	* :ref:`Using global context data <location-stack-and-global-contexts>`
	* :doc:`modelhub.SeriesLocationStack.ls <../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack.ls>`
	* :doc:`bach.DataFrame.groupby <../bach/api-reference/DataFrame/bach.DataFrame.groupby>`
	* :doc:`bach.Series.value_counts <../bach/api-reference/Series/bach.Series.value_counts>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`
	* :doc:`bach.DataFrame.unstack <../bach/api-reference/DataFrame/bach.DataFrame.unstack>`
	* :doc:`bach.DataFrame.get_sample <../bach/api-reference/DataFrame/bach.DataFrame.get_sample>`

Export to pandas for sklearn
----------------------------

.. NOTE: Because it's ML/sampling, the following will never be deterministic if executed as a doctest, 
	so instead running most of it as a regular code-block

.. code-block:: jupyter-notebook

	>>> # export to pandas now
	>>> pdf = kmeans_frame.to_pandas()
	>>> pdf

.. code-block:: jupyter-notebook-out

	                                      about  blog  home  jobs  join_slack  modeling  privacy  taxonomy  tracking
	user_id
	005aa19c-7e80-4960-928c-a0853355ee5f      2     0     0     0           0         0        0         0         0
	007f5fd7-7535-434e-aa3e-3d52f06d63ce      0     0     4     0           0         4        0         0         0
	00a9146f-69a7-4d02-ad46-83b15f062d96      0     0     1     0           0         1        0         0         0
	00d6517e-be05-4aa1-ac88-9c0b3a7902c5      0     0     2     0           0         0        0         0         0
	00e0d3e2-5a9b-4249-a00d-3527eddf945b      0     0     2     0           0         0        0         0         0
	...                                     ...   ...   ...   ...         ...       ...      ...       ...       ...
	fdf31cae-4906-476a-b206-e0a9644ced52      0     0     0     0           0         0        0         1         0
	fe26b80f-cdc8-45f2-b0f7-f0f36b9c0ea2      0     0     0     0           0         1        0         0         0
	fe8f4e17-cb38-4d22-abc5-3c0f7bfa60f3      0     0     1     0           0         0        0         2         0
	fea402ee-b33f-4313-a7d1-c6ed285d8f9d      0     0     2     0           0         0        0         0         0
	ff48d79a-195a-476a-b49d-0e212de43c96      0     0     7     1           0         0        0         0         0
	<BLANKLINE>
	[712 rows x 9 columns]

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.to_pandas <../bach/api-reference/DataFrame/bach.DataFrame.to_pandas>`

Do basic kmeans clustering
--------------------------
Now that we have a pandas DataFrame with our dataset, we can run basic kmeans clustering on it.

.. code-block:: jupyter-notebook

	>>> # do basic kmeans
	>>> est = cluster.KMeans(n_clusters=3)
	>>> est.fit(pdf)
	>>> pdf['cluster'] = est.labels_

Now you can use the created clusters on your entire dataset again if you add it back to your DataFrame. This 
is simple, as Bach and pandas work together nicely. Your original Objectiv data now has a 'cluster' column.

.. code-block:: jupyter-notebook

	>>> kmeans_frame['cluster'] = pdf['cluster']
	>>> kmeans_frame.sort_values('cluster').head()

.. code-block:: jupyter-notebook-out

	                                      about  blog  home  jobs  join_slack  modeling  privacy  taxonomy  tracking  cluster
	user_id
	30ea7fc7-7dbe-4080-b980-55120503479d     12    10    25     2           0         3        0         7         4        0
	32815da3-f3dd-448d-9ec4-bfed8534c1cc      0     0     0     0           0         0        0        13         0        0
	07a41d20-a71b-4612-b46a-30c2508087bc      0     0     1     0           0         3        0        18         0        0
	30501147-b09f-4637-a5d8-c205492508e4      0     4     7     0           0         2        0         6         4        0
	32bde210-5808-457f-9fe7-cb93c3fc8300      2     2     8     0           0         1        1         6         4        0

.. code-block:: jupyter-notebook

	>>> df_with_cluster = df.merge(kmeans_frame[['cluster']], on='user_id')
	>>> df_with_cluster.head()

.. code-block:: jupyter-notebook-out

	                                             day                  moment                               user_id                                                                                location_stack      event_type                                                 stack_event_types  session_id  session_hit_number   root  cluster
	event_id
	a6629a25-54ec-4cc5-a84a-2440164a0779  2022-06-22 2022-06-22 20:23:24.607  0000bb2f-66e9-4e48-8e2f-7d0a82446ef4  [{'id': 'home', '_type': 'RootLocationContext', '_types': ['AbstractContext', 'AbstractLo...    VisibleEvent                [AbstractEvent, NonInteractiveEvent, VisibleEvent]        4056                   1   home        2
	94fa97a3-5623-4b7c-b953-79c9971f4e53  2022-06-22 2022-06-22 20:23:26.001  0000bb2f-66e9-4e48-8e2f-7d0a82446ef4  [{'id': 'home', '_type': 'RootLocationContext', '_types': ['AbstractContext', 'AbstractLo...     HiddenEvent                 [AbstractEvent, HiddenEvent, NonInteractiveEvent]        4056                   2   home        2
	0041d6c0-af21-4a30-9374-09056b535cfc  2022-06-22 2022-06-22 20:24:00.747  0000bb2f-66e9-4e48-8e2f-7d0a82446ef4  [{'id': 'home', '_type': 'RootLocationContext', '_types': ['AbstractContext', 'AbstractLo...      PressEvent                     [AbstractEvent, InteractiveEvent, PressEvent]        4056                   3   home        2
	4a957bb2-1b2c-4130-a14f-4f2c11532633  2022-06-22 2022-06-22 20:24:04.599  0000bb2f-66e9-4e48-8e2f-7d0a82446ef4  [{'id': 'about', '_type': 'RootLocationContext', '_types': ['AbstractContext', 'AbstractL...      PressEvent                     [AbstractEvent, InteractiveEvent, PressEvent]        4056                   4  about        2
	592c232e-5ce4-4ae7-a22a-91daf2d61264  2022-06-22 2022-06-22 20:24:05.339  0000bb2f-66e9-4e48-8e2f-7d0a82446ef4  [{'id': 'home', '_type': 'RootLocationContext', '_types': ['AbstractContext', 'AbstractLo...  MediaLoadEvent  [AbstractEvent, MediaEvent, MediaLoadEvent, NonInteractiveEvent]        4056                   5   home        2

You can use this column just like any other. For example, you can now use your created clusters to group 
models from the model hub:

.. code-block:: jupyter-notebook

	>>> modelhub.aggregate.session_duration(df_with_cluster, groupby='cluster').head()
	cluster

.. code-block:: jupyter-notebook-out

	0.0   0 days 00:09:25.571389
	1.0   0 days 00:11:24.219444
	2.0   0 days 00:02:23.977933
	NaN   0 days 00:04:39.558403
	Name: session_duration, dtype: timedelta64[ns]

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.sort_values <../bach/api-reference/DataFrame/bach.DataFrame.sort_values>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`
	* :doc:`bach.DataFrame.merge <../bach/api-reference/DataFrame/bach.DataFrame.merge>`
	* :doc:`modelhub.Aggregate.session_duration <../open-model-hub/models/aggregation/modelhub.Aggregate.session_duration>`


Get the SQL for any analysis
----------------------------

The SQL for any analysis can be exported with one command, so you can use models in production directly to 
simplify data debugging & delivery to BI tools like Metabase, dbt, etc. See how you can `quickly create BI 
dashboards with this <https://objectiv.io/docs/home/go#creating-bi-dashboards>`_.

.. doctest:: machine-learning
	:hide:

	>>> def display_sql_as_markdown(arg): [print('sql\n' + arg.view_sql() + '\n')]

.. doctest:: machine-learning
	:skipif: engine is None

	>>> # show the underlying SQL for this dataframe - works for any dataframe/model in Objectiv
	>>> display_sql_as_markdown(features)
	sql
	WITH "manual_materialize___69a0c34935f44c51532b4d6011fb9118" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "cookie_id" AS "user_id",
	               "value"->>'_type' AS "event_type",
	               cast("value"->>'_types' AS JSONB) AS "stack_event_types",
	               cast("value"->>'location_stack' AS JSONB) AS "location_stack",
	               cast("value"->>'time' AS bigint) AS "time"
	          FROM "data"
	       ),
	       "getitem_where_boolean___e23ff23e53aabea817514c7ec9b842f0" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "location_stack" AS "location_stack",
	               "time" AS "time"
	          FROM "manual_materialize___69a0c34935f44c51532b4d6011fb9118"
	         WHERE ((("day" >= cast('2022-03-01' AS date))) AND (("day" <= cast('2022-06-30' AS date))))
	       ),
	       "context_data___457055a190ae4b5d101b8b81ef9a682d" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types"
	          FROM "getitem_where_boolean___e23ff23e53aabea817514c7ec9b842f0"
	       ),
	       "session_starts___ed61a7a74f63eccf5f66de09c2f46b78" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               CASE WHEN (extract(epoch FROM (("moment") - (lag("moment", 1, cast(NULL AS timestamp WITHOUT TIME ZONE)) OVER (PARTITION BY "user_id" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)))) <= cast(1800 AS bigint)) THEN cast(NULL AS boolean)
	                    ELSE cast(TRUE AS boolean)
	                     END AS "is_start_of_session"
	          FROM "context_data___457055a190ae4b5d101b8b81ef9a682d"
	       ),
	       "session_id_and_count___a4a712e42ece50e5846f84e4aa99f981" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "is_start_of_session" AS "is_start_of_session",
	               CASE WHEN "is_start_of_session" THEN row_number() OVER (PARTITION BY "is_start_of_session" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
	                    ELSE cast(NULL AS bigint)
	                     END AS "session_start_id",
	               count("is_start_of_session") OVER (ORDER BY "user_id" ASC NULLS LAST, "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "is_one_session"
	          FROM "session_starts___ed61a7a74f63eccf5f66de09c2f46b78"
	       ),
	       "objectiv_sessionized_data___35e440d72c941de548e6a8af397e8c76" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "is_start_of_session" AS "is_start_of_session",
	               "session_start_id" AS "session_start_id",
	               "is_one_session" AS "is_one_session",
	               first_value("session_start_id") OVER (PARTITION BY "is_one_session" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "session_id",
	               row_number() OVER (PARTITION BY "is_one_session" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "session_hit_number"
	          FROM "session_id_and_count___a4a712e42ece50e5846f84e4aa99f981"
	       ),
	       "getitem_where_boolean___b21b5c45d052ff9d2c59e2660f8bcc9f" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "session_id" AS "session_id",
	               "session_hit_number" AS "session_hit_number",
	               REPLACE(jsonb_path_query_first("location_stack", '$[*] ? (@._type == $type)', '{"type":"RootLocationContext"}') ->> 'id', '-', '_') AS "root"
	          FROM "objectiv_sessionized_data___35e440d72c941de548e6a8af397e8c76"
	         WHERE ("event_type" = 'PressEvent')
	       ) SELECT "user_id" AS "user_id",
	       "root" AS "root",
	       cast(sum(cast(1 AS bigint)) AS bigint) AS "value_counts"
	  FROM "getitem_where_boolean___b21b5c45d052ff9d2c59e2660f8bcc9f"
	 GROUP BY "user_id",
	          "root"
	 ORDER BY cast(sum(cast(1 AS bigint)) AS bigint) DESC NULLS LAST
	<BLANKLINE>

That's it! `Join us on Slack <https://objectiv.io/join-slack>`_ if you have any questions or suggestions.

Next Steps
----------

Try the notebooks in Objectiv Go
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Spin up a full-fledged product analytics pipeline with `Objectiv Go </docs/home/go>`__ in under 5 minutes, 
and play with the included example notebooks yourself.

Use this notebook with your own data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can use the example notebooks on any dataset that was collected with Objectiv's tracker, so feel free to 
use them to bootstrap your own projects. They are available as Jupyter notebooks on our `GitHub repository 
<https://github.com/objectiv/objectiv-analytics/tree/main/notebooks>`_. See `instructions to set up the 
Objectiv tracker <https://objectiv.io/docs/tracking/>`_. 

Check out related example notebooks
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* :doc:`Feature engineering <./feature-engineering>` - see how :doc:`modeling library Bach <../bach/index>` 
	can be used for feature engineering.