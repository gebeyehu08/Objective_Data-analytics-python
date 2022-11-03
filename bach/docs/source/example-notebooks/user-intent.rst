.. _example_user_intent:

.. frontmatterposition:: 7

.. currentmodule:: bach_open_taxonomy

==========================
Basic user intent analysis
==========================

This example notebook shows how you can easily run basic User Intent analysis with Objectiv. It's also 
available as a `full Jupyter notebook 
<https://github.com/objectiv/objectiv-analytics/blob/main/notebooks/basic-user-intent.ipynb>`_
to run on your own data (see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`).
The dataset used here is the same as in `Objectiv Up </docs/home/up/>`__.

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
	quantile
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
	>>> roots = bach.DataFrame.from_pandas(engine=df.engine, df=pd.DataFrame({'roots': ['modeling', 'taxonomy', 'tracking', 'home', 'docs']})).roots

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
dashboards with this <https://objectiv.io/docs/home/up#creating-bi-dashboards>`_.

.. exec_code::
	:language: jupyter-notebook
	:language_output: jupyter-notebook-out

	# --- hide: start ---
	import os
	import bach
	import pandas as pd
	from datetime import timedelta
	from modelhub import ModelHub
	modelhub = ModelHub(time_aggregation='%Y-%m-%d', global_contexts=['application', 'path'])
	DB_URL = os.environ.get('OBJ_DB_PG_TEST_URL', 'postgresql://objectiv:@localhost:5432/objectiv')
	df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date='2022-03-01', end_date='2022-05-01')
	df['application_id'] = df.application.context.id
	df['root_location'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')
	roots = bach.DataFrame.from_pandas(engine=df.engine, df=pd.DataFrame({'roots': ['modeling', 'taxonomy', 'tracking', 'home', 'docs']})).roots
	user_intent_buckets = modelhub.agg.session_duration(df, groupby=['user_id'], method='sum', exclude_bounces=False).to_frame()
	selector = (df.root_location.isin(roots)) & (df.application_id=='objectiv-docs')
	explore_inform_users_session_duration = modelhub.agg.session_duration(df[selector], groupby='user_id', method='sum')
	user_intent_buckets['explore_inform_duration'] = explore_inform_users_session_duration
	user_intent_buckets['bucket'] = '1 - inform'
	user_intent_buckets.loc[(user_intent_buckets.explore_inform_duration >= timedelta(0, 90)) & (user_intent_buckets.explore_inform_duration <= timedelta(0, 690)), 'bucket'] = '2 - explore'
	user_intent_buckets.loc[user_intent_buckets.explore_inform_duration > timedelta(0, 690), 'bucket'] = '3 - implement'
	def display_sql_as_markdown(arg): [print('sql\n' + arg.view_sql() + '\n')]
	# --- hide: stop ---
	# show the underlying SQL for this dataframe - works for any dataframe/model in Objectiv
	display_sql_as_markdown(user_intent_buckets)

That's it! `Join us on Slack <https://objectiv.io/join-slack>`_ if you have any questions or suggestions.

Next Steps
----------

Try the notebooks in Objectiv Up
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Spin up a full-fledged product analytics pipeline with `Objectiv Up </docs/home/up>`__ in under 5 minutes, 
and play with the included example notebooks yourself.

Use this notebook with your own data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can use the example notebooks on any dataset that was collected with Objectiv's tracker, so feel free to 
use them to bootstrap your own projects. They are available as Jupyter notebooks on our `GitHub repository 
<https://github.com/objectiv/objectiv-analytics/tree/main/notebooks>`_. See `instructions to set up the 
Objectiv tracker <https://objectiv.io/docs/tracking/>`_. 

Check out related example notebooks
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* :doc:`Product Analytics notebook <./product-analytics>` - easily run basic product analytics on your data.
* :doc:`Funnel Discovery notebook <./funnel-discovery>` - analyze the paths that users take that impact your 
	product goals.
