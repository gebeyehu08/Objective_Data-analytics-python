.. _example_user_intent:

.. frontmatterposition:: 7

.. currentmodule:: bach_open_taxonomy

==========================
Basic user intent analysis
==========================

This example notebook shows how you can easily run basic User Intent analysis with Objectiv. It's also 
available as a `full Jupyter notebook 
<https://github.com/objectiv/objectiv-analytics/blob/main/notebooks/basic-user-intent.ipynb>`_
to run on your own data (see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`), 
or you can instead `run the Demo </docs/home/try-the-demo/>`_ to quickly try it out. The dataset used 
here is the same as in the Demo.

Get started
-----------
We first have to instantiate the model hub and an Objectiv DataFrame object.

.. doctest:: user-intent
	:skipif: engine is None

	>>> # set the timeframe of the analysis
	>>> start_date = '2022-03-01'
	>>> end_date = '2022-05-01'

.. we override the timeframe for the doctests below
	
.. testsetup:: user-intent
	:skipif: engine is None

	start_date = '2022-03-01'
	end_date = '2022-05-01'
	pd.set_option('display.max_colwidth', 93)

.. doctest:: user-intent
	:skipif: engine is None

	>>> # instantiate the model hub, set the default time aggregation to daily
	>>> # and get the application & path global contexts
	>>> from modelhub import ModelHub, display_sql_as_markdown
	>>> import bach
	>>> import pandas as pd
	>>> from datetime import timedelta
	>>> modelhub = ModelHub(time_aggregation='%Y-%m-%d', global_contexts=['application', 'path'])
	>>> # get an Objectiv DataFrame within a defined timeframe
	>>> df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date=start_date, end_date=end_date)

The `location_stack` column, and the columns taken from the global contexts, contain most of the 
event-specific data. These columns are JSON typed, and we can extract data from it using the keys of the JSON 
objects with :doc:`SeriesLocationStack 
<../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack>` methods, or the `context` 
accessor for global context columns. See the :doc:`open taxonomy example <./open-taxonomy>` for how to use 
the `location_stack` and global contexts.

.. doctest:: user-intent
	:skipif: engine is None

	>>> df['application_id'] = df.application.context.id
	>>> df['root_location'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.ModelHub.get_objectiv_dataframe <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.get_objectiv_dataframe>`
	* :ref:`Using global context data <location-stack-and-global-contexts>`
	* :doc:`modelhub.SeriesLocationStack.ls <../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack.ls>`

Explore where users spend time
------------------------------
The `root_location` context in the location stack represents the top-level UI location of the user. As a first 
step of grasping user intent, this is a good starting point to see in what main areas of your product users 
are spending time.

.. doctest:: user-intent
	:skipif: engine is None

	>>> # see the number of unique users per application and root_location
	>>> users_root = modelhub.aggregate.unique_users(df, groupby=['application_id', 'root_location'])
	>>> users_root.sort_index().head(10)
	application_id    root_location
	objectiv-docs     home             156
	                  modeling          64
	                  taxonomy          69
	                  tracking          67
	objectiv-website  about            100
	                  blog             120
	                  home             437
	                  jobs              72
	                  join-slack        10
	                  privacy            3
	Name: unique_users, dtype: int64

Another good pointer to explore for user intent is how much time users spend in each `root_location`.

.. doctest:: user-intent
	:skipif: engine is None

	>>> # see duration per application and root location
	>>> duration_root = modelhub.aggregate.session_duration(df, groupby=['application_id', 'root_location']).sort_index()
	>>> duration_root.head(10)
	application_id    root_location
	objectiv-docs     home            0 days 00:02:49.554985
	                  modeling        0 days 00:05:56.082236
	                  taxonomy        0 days 00:04:46.021880
	                  tracking        0 days 00:04:28.598646
	objectiv-website  about           0 days 00:02:32.867455
	                  blog            0 days 00:02:09.354135
	                  home            0 days 00:02:18.139962
	                  jobs            0 days 00:01:27.801652
	                  join-slack      0 days 00:01:36.813100
	                  privacy         0 days 00:00:10.705000
	Name: session_duration, dtype: timedelta64[ns]

Finally, let's look at the distribution of time spent. We'll use this distribution to define the different stages of user intent.

.. doctest:: user-intent
	:skipif: engine is None

	>>> # see how the overall time spent is distributed
	>>> session_duration = modelhub.aggregate.session_duration(df, groupby='session_id')
	>>> # materialization is needed because the expression of the created Series contains aggregated data, 
	>>> # and it is not allowed to aggregate that.
	>>> session_duration = session_duration.materialize()
	>>> # show quantiles
	>>> session_duration.quantile(q=[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]).head(10)
	q
	0.1   0 days 00:00:00.009000
	0.2   0 days 00:00:01.019000
	0.3   0 days 00:00:01.815000
	0.4   0 days 00:00:04.507000
	0.5   0 days 00:00:15.570000
	0.6   0 days 00:00:39.518000
	0.7   0 days 00:01:29.395000
	0.8   0 days 00:03:52.534000
	0.9          0 days 00:11:33
	Name: session_duration, dtype: timedelta64[ns]

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.Aggregate.unique_users <../open-model-hub/models/aggregation/modelhub.Aggregate.unique_users>`
	* :doc:`bach.DataFrame.sort_index <../bach/api-reference/DataFrame/bach.DataFrame.sort_index>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`
	* :doc:`modelhub.Aggregate.session_duration <../open-model-hub/models/aggregation/modelhub.Aggregate.session_duration>`
	* :doc:`bach.DataFrame.materialize <../bach/api-reference/DataFrame/bach.DataFrame.materialize>`
	* :doc:`bach.DataFrame.quantile <../bach/api-reference/DataFrame/bach.DataFrame.quantile>`

Define the stages of user intent
--------------------------------

Now that we've explored the `root_location` and session duration (both per `root_location` and overall 
quantiles) where users spend their time, we can make a simple definition of the different stages of their 
intent.

Based on this dataset (objectiv.io website data) we think that:

- Users that spent most time on the site (the 90th percentile), and specifically in our documentation 
	sections, are in the Implement phase.
- As there's a jump beyond the one minute mark at the 70th percentile, we assume that users in the 70th to 
	90th percentile duration in our documentation sections are in the Explore phase.
- The remaining users are Informing themselves about the product. Those users are spending less than 1:30 in 
	the docs and/or spend any amount of time on our main website.

Summarizing:

.. list-table::
   :widths: 20 50 30
   :header-rows: 1

   * - User intent
     - Root locations
     - Duration
   * - 1 - Inform
     - *all sections other than the ones mentioned below*
     - *any time spent*
   * - 1 - Inform
     - Docs: modeling, taxonomy, tracking, home
     - less than 1:30
   * - 2 - Explore
     - Docs: modeling, taxonomy, tracking, home
     - between 1:30 and 11:30
   * - 3 - Implement
     - Docs: modeling, taxonomy, tracking, home
     - more than 11:30

This is just for illustration purposes, you can adjust these definitions based on your own collected data.

Assign user intent
------------------
Using our intent definitions above, we can now assign a stage of intent to each user.

.. doctest:: user-intent
	:skipif: engine is None

	>>> # select the root_locations to use for each of the intent stages
	>>> roots = bach.DataFrame.from_pandas(engine=df.engine, df=pd.DataFrame({'roots': ['modeling', 'taxonomy', 'tracking', 'home', 'docs']}), convert_objects=True).roots

.. doctest:: user-intent
	:skipif: engine is None

	>>> # calculate the total time spent per user
	>>> user_intent_buckets = modelhub.agg.session_duration(df, groupby=['user_id'], method='sum', exclude_bounces=False).to_frame()

.. doctest:: user-intent
	:skipif: engine is None

	>>> # same as above, but for selected root_locations only
	>>> selector = (df.root_location.isin(roots)) & (df.application_id=='objectiv-docs')
	>>> explore_inform_users_session_duration = modelhub.agg.session_duration(df[selector], groupby='user_id', method='sum')
	>>> # and set it as column
	>>> user_intent_buckets['explore_inform_duration'] = explore_inform_users_session_duration

.. doctest:: user-intent
	:skipif: engine is None

	>>> # set the Inform bucket as a catch-all, meaning users that do not fall into Explore and Implement will be defined as Inform
	>>> user_intent_buckets['bucket'] = '1 - inform'

.. doctest:: user-intent
	:skipif: engine is None

	>>> # calculate buckets duration
	>>> user_intent_buckets.loc[(user_intent_buckets.explore_inform_duration >= timedelta(0, 90)) & (user_intent_buckets.explore_inform_duration <= timedelta(0, 690)), 'bucket'] = '2 - explore'
	>>> user_intent_buckets.loc[user_intent_buckets.explore_inform_duration > timedelta(0, 690), 'bucket'] = '3 - implement'

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.from_pandas <../bach/api-reference/DataFrame/bach.DataFrame.from_pandas>`
	* :doc:`modelhub.Aggregate.session_duration <../open-model-hub/models/aggregation/modelhub.Aggregate.session_duration>`
	* :doc:`bach.Series.isin <../bach/api-reference/Series/bach.Series.isin>`
	* :doc:`bach.DataFrame.loc <../bach/api-reference/DataFrame/bach.DataFrame.loc>`

Work with the user intent results
---------------------------------

Now that we have assigned intent to each user, we can run any analysis on it. For example, we can look at the 
total number of users per intent bucket.

.. doctest:: user-intent
	:skipif: engine is None

	>>> # see the total number of users per intent bucket
	>>> user_intent_buckets.reset_index().groupby('bucket').agg({'user_id': 'nunique'}).sort_index().head()
	               user_id_nunique
	bucket
	1 - inform                 495
	2 - explore                 47
	3 - implement               30

Other examples of analyses you could run:

- Which product features do each of the intent groups use? 
- With what kind of intent do users come from different marketing campaigns? 
- How can we drive more users to the 'Implement' phase? For instance, look at different product features that users with the 'Implement' intent use, compared to 'Explore'.

A good starting point for these analyses on top of the user intent buckets is the basic product analytics example in the :doc:`example notebooks <index>`.

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.groupby <../bach/api-reference/DataFrame/bach.DataFrame.groupby>`
	* :doc:`bach.DataFrame.agg <../bach/api-reference/DataFrame/bach.DataFrame.agg>`
	* :doc:`bach.DataFrame.sort_index <../bach/api-reference/DataFrame/bach.DataFrame.sort_index>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`

Get the SQL for any analysis
----------------------------
The SQL for any analysis can be exported with one command, so you can use models in production directly to 
simplify data debugging & delivery to BI tools like Metabase, dbt, etc. See how you can `quickly create BI 
dashboards with this <https://objectiv.io/docs/home/try-the-demo#creating-bi-dashboards>`_.

.. the doctest below is a workaround to show the actual SQL output

.. doctest:: user-intent
	:hide:
	
	>>> def display_sql_as_markdown(arg): [print('sql\n' + arg.view_sql() + '\n')]

.. doctest:: user-intent
	:skipif: engine is None

	>>> # show SQL for analysis; this is just one example, and works for any Objectiv model/analysis
	>>> display_sql_as_markdown(user_intent_buckets)
	sql
	WITH "manual_materialize___e988f43af98a0b01ea892ce9576666c2" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "cookie_id" AS "user_id",
	               "value"->>'_type' AS "event_type",
	               cast("value"->>'_types' AS JSONB) AS "stack_event_types",
	               cast("value"->>'location_stack' AS JSONB) AS "location_stack",
	               cast("value"->>'time' AS bigint) AS "time",
	               jsonb_path_query_array(cast("value"->>'global_contexts' AS JSONB), '$[*] ? (@._type == $type)', '{"type":"ApplicationContext"}') AS "application",
	               jsonb_path_query_array(cast("value"->>'global_contexts' AS JSONB), '$[*] ? (@._type == $type)', '{"type":"PathContext"}') AS "path"
	          FROM "data"
	       ),
	       "getitem_where_boolean___e5148a0ad13da018d21c7bfba2548914" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "location_stack" AS "location_stack",
	               "time" AS "time",
	               "application" AS "application",
	               "path" AS "path"
	          FROM "manual_materialize___e988f43af98a0b01ea892ce9576666c2"
	         WHERE ((("day" >= cast('2022-03-01' AS date))) AND (("day" <= cast('2022-05-01' AS date))))
	       ),
	       "context_data___13ef50fca5b744da64018a0f57865536" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "application" AS "application",
	               "path" AS "path"
	          FROM "getitem_where_boolean___e5148a0ad13da018d21c7bfba2548914"
	       ),
	       "session_starts___eff6c346587eb15feb915403766f5fa0" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "application" AS "application",
	               "path" AS "path",
	               CASE WHEN (extract(epoch FROM (("moment") - (lag("moment", 1, cast(NULL AS timestamp WITHOUT TIME ZONE)) OVER (PARTITION BY "user_id" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)))) <= cast(1800 AS bigint)) THEN cast(NULL AS boolean)
	                    ELSE cast(TRUE AS boolean)
	                     END AS "is_start_of_session"
	          FROM "context_data___13ef50fca5b744da64018a0f57865536"
	       ),
	       "session_id_and_count___8e10a78e0c1c2a42e8bf501f2eb3e6d4" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "application" AS "application",
	               "path" AS "path",
	               "is_start_of_session" AS "is_start_of_session",
	               CASE WHEN "is_start_of_session" THEN row_number() OVER (PARTITION BY "is_start_of_session" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
	                    ELSE cast(NULL AS bigint)
	                     END AS "session_start_id",
	               count("is_start_of_session") OVER (ORDER BY "user_id" ASC NULLS LAST, "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "is_one_session"
	          FROM "session_starts___eff6c346587eb15feb915403766f5fa0"
	       ),
	       "objectiv_sessionized_data___d0994dc2186ae53706a802b150cc8072" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "application" AS "application",
	               "path" AS "path",
	               "is_start_of_session" AS "is_start_of_session",
	               "session_start_id" AS "session_start_id",
	               "is_one_session" AS "is_one_session",
	               first_value("session_start_id") OVER (PARTITION BY "is_one_session" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "session_id",
	               row_number() OVER (PARTITION BY "is_one_session" ORDER BY "moment" ASC NULLS LAST, "event_id" ASC NULLS LAST RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS "session_hit_number"
	          FROM "session_id_and_count___8e10a78e0c1c2a42e8bf501f2eb3e6d4"
	       ),
	       "nested_groupby___44587b2f5c5e60835b825a64c8e041e7" AS (
	        SELECT "user_id" AS "user_id",
	               "session_id" AS "__session_id",
	               min("moment") AS "moment_min",
	               max("moment") AS "moment_max",
	               ((max("moment")) - (min("moment"))) AS "session_duration"
	          FROM "objectiv_sessionized_data___d0994dc2186ae53706a802b150cc8072"
	         GROUP BY "user_id",
	                  "session_id"
	       ),
	       "merge_left___bd4e54d179d02e6a47ad999ac1eeda06" AS (
	        SELECT "user_id" AS "user_id",
	               sum("session_duration") AS "session_duration"
	          FROM "nested_groupby___44587b2f5c5e60835b825a64c8e041e7"
	         GROUP BY "user_id"
	       ),
	       "loaded_data___6c36bcef7d60e965af3a13a3db67f6eb" AS (
	        SELECT *
	          FROM (VALUES (cast(0 AS bigint), 'modeling'), (cast(1 AS bigint), 'taxonomy'), (cast(2 AS bigint), 'tracking'), (cast(3 AS bigint), 'home'), (cast(4 AS bigint), 'docs')) AS t("_index_0", "roots")
	       ),
	       "getitem_where_boolean___9470019c9e6f91a2d37f6bac0e01cc64" AS (
	        SELECT "event_id" AS "event_id",
	               "day" AS "day",
	               "moment" AS "moment",
	               "user_id" AS "user_id",
	               "location_stack" AS "location_stack",
	               "event_type" AS "event_type",
	               "stack_event_types" AS "stack_event_types",
	               "session_id" AS "session_id",
	               "session_hit_number" AS "session_hit_number",
	               "application" AS "application",
	               "path" AS "path",
	               "application"->0->>'id' AS "application_id",
	               jsonb_path_query_first("location_stack", '$[*] ? (@._type == $type)', '{"type":"RootLocationContext"}') ->> 'id' AS "root_location"
	          FROM "objectiv_sessionized_data___d0994dc2186ae53706a802b150cc8072"
	         WHERE ((jsonb_path_query_first("location_stack", '$[*] ? (@._type == $type)', '{"type":"RootLocationContext"}') ->> 'id' in (SELECT "roots" AS "roots" FROM "loaded_data___6c36bcef7d60e965af3a13a3db67f6eb")) AND (("application"->0->>'id' = 'objectiv-docs')))
	       ),
	       "getitem_having_boolean___ad8b9eb86439d22b96d56328aeba111f" AS (
	        SELECT "user_id" AS "user_id",
	               "session_id" AS "__session_id",
	               min("moment") AS "moment_min",
	               max("moment") AS "moment_max",
	               ((max("moment")) - (min("moment"))) AS "session_duration"
	          FROM "getitem_where_boolean___9470019c9e6f91a2d37f6bac0e01cc64"
	         GROUP BY "user_id",
	                  "session_id"
	        HAVING (extract(epoch FROM ((max("moment")) - (min("moment")))) > cast(0 AS bigint))
	       ),
	       "merge_right___52b59f870f97d354b8ab744be3c80c5a" AS (
	        SELECT "user_id" AS "user_id",
	               sum("session_duration") AS "explore_inform_duration"
	          FROM "getitem_having_boolean___ad8b9eb86439d22b96d56328aeba111f"
	         GROUP BY "user_id"
	       ),
	       "merge_sql___32a357c8d28e7fb38db96b6fbeb0c2eb" AS (
	        SELECT COALESCE("l"."user_id", "r"."user_id") AS "user_id",
	               "l"."session_duration" AS "session_duration",
	               "r"."explore_inform_duration" AS "explore_inform_duration"
	          FROM "merge_left___bd4e54d179d02e6a47ad999ac1eeda06" AS l
	          LEFT
	            JOIN "merge_right___52b59f870f97d354b8ab744be3c80c5a" AS r
	            ON ("l"."user_id" = "r"."user_id")
	       ) SELECT "user_id" AS "user_id",
	       "session_duration" AS "session_duration",
	       "explore_inform_duration" AS "explore_inform_duration",
	       CASE WHEN ("explore_inform_duration" > cast('P0DT0H11M30S' AS interval)) THEN '3 - implement'
	            ELSE CASE WHEN ((("explore_inform_duration" >= cast('P0DT0H1M30S' AS interval))) AND (("explore_inform_duration" <= cast('P0DT0H11M30S' AS interval)))) THEN '2 - explore' ELSE '1 - inform' END
	             END AS "bucket"
	  FROM "merge_sql___32a357c8d28e7fb38db96b6fbeb0c2eb"
	<BLANKLINE>
