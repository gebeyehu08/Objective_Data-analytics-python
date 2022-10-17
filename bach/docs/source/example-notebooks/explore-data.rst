.. _explore_data:

.. frontmatterposition:: 8

.. currentmodule:: bach_open_taxonomy

=================
Explore your data
=================

This example notebook shows how you can easily explore your data collected with Objectiv. It's also available 
as a `full Jupyter notebook 
<https://github.com/objectiv/objectiv-analytics/blob/main/notebooks/explore-your-data.ipynb>`_
to run on your own data (see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`). 
The dataset used here is the same as in `Objectiv Up </docs/home/up>`__.

Get started
-----------
We first have to instantiate the model hub and an Objectiv DataFrame object.

.. doctest::
	:skipif: engine is None

	.. >>> import pandas as pd
	.. >>> pd.set_option('display.max_columns', None) # show all columns where possible, so dataframes don't get unneccesarily cut off
	.. >>> pd.set_option('display.expand_frame_repr', False)  # do not output dataframes on multiple lines, but over full width
	.. >>> pd.set_option('display.max_colwidth', 93)
	.. >>> from bach.dataframe import DataFrame
	.. >>> import os
	.. >>> import sqlalchemy
	.. >>> DB_URL = os.environ.get('OBJ_DB_PG_TEST_URL', 'postgresql://objectiv:@localhost:5432/objectiv')
	.. >>> engine = sqlalchemy.create_engine(DB_URL)
	.. >>> start_date = '2022-06-01'
	.. >>> end_date = '2022-06-30'
	>>> # set the timeframe of the analysis
	>>> start_date = '2022-06-01'
	>>> end_date = None

.. we override the timeframe for the doctests below
	
.. testsetup:: explore-data
	:skipif: engine is None

	start_date = '2022-06-01'
	end_date = '2022-06-30'
	pd.set_option('display.max_colwidth', 93)

.. doctest:: explore-data
	:skipif: engine is None

	>>> # instantiate the model hub, set the default time aggregation to daily
	>>> # and get the application & path global contexts
	>>> from modelhub import ModelHub, display_sql_as_markdown
	>>> modelhub = ModelHub(time_aggregation='%Y-%m-%d', global_contexts=['application', 'path'])
	>>> # get an Objectiv DataFrame within a defined timeframe
	>>> df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date=start_date, end_date=end_date)

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.ModelHub.get_objectiv_dataframe <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.get_objectiv_dataframe>`


A first look at the data
------------------------

.. doctest:: explore-data
	:skipif: engine is None
	
	>>> # have a look at the event data, sorted by the user's session ID & hit
	>>> df.sort_values(['session_id', 'session_hit_number'], ascending=False).head()
	                                             day                  moment                               user_id                                     location_stack              event_type                                  stack_event_types  session_id  session_hit_number                                        application                                               path
	event_id
	96b5e709-bb8a-46de-ac82-245be25dac29  2022-06-30 2022-06-30 21:40:32.401  2d718142-9be7-4975-a669-ba022fd8fd48  [{'id': 'home', '_type': 'RootLocationContext'...            VisibleEvent  [AbstractEvent, NonInteractiveEvent, VisibleEv...         872                   3  [{'id': 'objectiv-website', '_type': 'Applicat...  [{'id': 'https://objectiv.io/', '_type': 'Path...
	252d7d87-5600-4d90-b24f-2a6fb8986c5e  2022-06-30 2022-06-30 21:40:30.117  2d718142-9be7-4975-a669-ba022fd8fd48  [{'id': 'home', '_type': 'RootLocationContext'...              PressEvent      [AbstractEvent, InteractiveEvent, PressEvent]         872                   2  [{'id': 'objectiv-website', '_type': 'Applicat...  [{'id': 'https://objectiv.io/', '_type': 'Path...
	157a3000-bbfc-42e0-b857-901bd578ea7c  2022-06-30 2022-06-30 21:40:16.908  2d718142-9be7-4975-a669-ba022fd8fd48  [{'id': 'home', '_type': 'RootLocationContext'...              PressEvent      [AbstractEvent, InteractiveEvent, PressEvent]         872                   1  [{'id': 'objectiv-website', '_type': 'Applicat...  [{'id': 'https://objectiv.io/', '_type': 'Path...
	8543f519-d3a4-4af6-89f5-cb04393944b8  2022-06-30 2022-06-30 20:43:50.962  bb127c9e-3067-4375-9c73-cb86be332660  [{'id': 'home', '_type': 'RootLocationContext'...          MediaLoadEvent  [AbstractEvent, MediaEvent, MediaLoadEvent, No...         871                   2  [{'id': 'objectiv-website', '_type': 'Applicat...  [{'id': 'https://objectiv.io/', '_type': 'Path...
	a0ad4364-57e0-4da9-a266-057744550cc2  2022-06-30 2022-06-30 20:43:49.820  bb127c9e-3067-4375-9c73-cb86be332660  [{'id': 'home', '_type': 'RootLocationContext'...  ApplicationLoadedEvent  [AbstractEvent, ApplicationLoadedEvent, NonInt...         871                   1  [{'id': 'objectiv-website', '_type': 'Applicat...  [{'id': 'https://objectiv.io/', '_type': 'Path...

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.sort_values <../bach/api-reference/DataFrame/bach.DataFrame.sort_values>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`


Understanding the columns
-------------------------

.. doctest:: explore-data
	:skipif: engine is None

	>>> # see the data type for each column
	>>> df.dtypes
	{'day': 'date',
	 'moment': 'timestamp',
	 'user_id': 'uuid',
	 'location_stack': 'objectiv_location_stack',
	 'event_type': 'string',
	 'stack_event_types': 'json',
	 'session_id': 'int64',
	 'session_hit_number': 'int64',
	 'application': 'objectiv_global_context',
	 'path': 'objectiv_global_context'}

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.dtypes <../bach/api-reference/DataFrame/bach.DataFrame.dtypes>`

What's in these columns:

* `day`: the day of the session as a date.
* `moment`: the exact moment of the event as a timestamp.
* `user_id`: the unique identifier of the user, based on the cookie.
* `global_contexts`: a JSON-like column that stores additional global information on the event that is logged, 
  such as device, application, cookie, etcetera. :doc:`See the open taxonomy notebook <./open-taxonomy>` for 
  more details.
* `location_stack`: a JSON-like column that stores information on the UI location that the event was 
  triggered. :doc:`See the open taxonomy notebook <./open-taxonomy>` for more details.
* `event_type`: the type of event that is logged, e.g. a `PressEvent`.
* `stack_event_types`: the parents of the `event_type` as a hierarchical JSON structure.
* `session_id`: a unique incremented integer ID for each session. Starts at 1 for the selected data in the 
  DataFrame.
* `session_hit_number`: an incremented integer ID for each hit in the session, ordered by moment.

Besides these 'standard' columns, additional columns that are extracted from the global contexts are in the 
DataFrame. In this case these columns are:

* `application`.
* `path`.

.. admonition:: Reference
	:class: api-reference

	For a more detailed understanding of Objectiv events in general, and especially the `global_contexts` and 
	`location_stack` data columns, see the open analytics taxonomy documentation:

	* `Events </docs/taxonomy/events>`_.
	* `Global contexts </docs/taxonomy/global-contexts>`_.
	* `Location contexts </docs/taxonomy/location-contexts>`_.

	The :doc:`open taxonomy notebook <./open-taxonomy>` has several examples on how to use it in modeling.

Your first Objectiv event data
------------------------------
Before we dig any deeper, let's take a more global look at the data Objectiv is now tracking in your product. 
An easy way to do this, is by looking at it from the `'root locations' 
</docs/taxonomy/reference/location-contexts/RootLocationContext>`_; the main sections in your product's UI.

First, we want to extract data from the `global_contexts` and `location_stack` columns that contain all 
relevant context about the event. :doc:`See the open taxonomy notebook <./open-taxonomy>` for more details.

.. doctest:: explore-data
	:skipif: engine is None

	>>> # add specific contexts to the data as columns
	>>> df['application_id'] = df.application.context.id
	>>> df['root_location'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')
	>>> df['path_id'] = df.path.context.id

.. doctest:: explore-data
	:skipif: engine is None

	>>> # now easily slice the data using the added context columns
	>>> event_data = modelhub.agg.unique_users(df, groupby=['application_id', 'root_location', 'path_id', 'event_type'])
	>>> event_data.sort_values(ascending=False).to_frame().head(20)
	                                                                                                       unique_users
	application_id   root_location path_id                                         event_type
	objectiv-website home          https://objectiv.io/                            MediaLoadEvent                   202
	                                                                               ApplicationLoadedEvent           194
	                                                                               PressEvent                       161
	                                                                               VisibleEvent                     158
	                                                                               HiddenEvent                       82
	objectiv-docs    home          NaN                                             VisibleEvent                      79
	                                                                               ApplicationLoadedEvent            67
	                 modeling      NaN                                             VisibleEvent                      56
	                 home          NaN                                             PressEvent                        47
	                               https://objectiv.io/docs/                       VisibleEvent                      45
	                 modeling      NaN                                             PressEvent                        41
	                 taxonomy      NaN                                             VisibleEvent                      39
	                               https://objectiv.io/docs/taxonomy/reference     VisibleEvent                      36
	                               NaN                                             PressEvent                        34
	objectiv-website about         https://objectiv.io/about                       PressEvent                        30
	objectiv-docs    taxonomy      NaN                                             ApplicationLoadedEvent            29
	                               https://objectiv.io/docs/taxonomy/              ApplicationLoadedEvent            27
	                 home          https://objectiv.io/docs/home/quickstart-guide/ VisibleEvent                      26
	                 tracking      NaN                                             VisibleEvent                      25
	                 modeling      NaN                                             ApplicationLoadedEvent            24

.. admonition:: Reference
	:class: api-reference

	* :doc:`using global context data <./open-taxonomy>`
	* :doc:`modelhub.SeriesLocationStack.ls <../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack.ls>`
	* :doc:`modelhub.Aggregate.unique_users <../open-model-hub/models/aggregation/modelhub.Aggregate.unique_users>`
	* :doc:`bach.DataFrame.sort_values <../bach/api-reference/DataFrame/bach.DataFrame.sort_values>`
	* :doc:`bach.Series.to_frame <../bach/api-reference/Series/bach.Series.to_frame>`


Understanding product features
------------------------------
For every event, Objectiv captures where it occurred in your product's UI, using a hierarchical stack of 
`LocationContexts </docs/taxonomy/location-contexts>`_. This means you can easily slice the data on any part 
of the UI that you're interested in. :doc:`See the open taxonomy notebook <./open-taxonomy>` for more details. 
It also means you can make product features very readable and easy to understand; see below how.

.. 
	The testsetup below sets the max_colwidth for this example, so it fits the code block.
	However, it has to re-instantiate `df` to be able to work, resetting the outputs before.
	Works in this case, but not a good solution in other cases. Didn't find something better yet.

.. testsetup:: explore-data-features
	:skipif: engine is None

	df = modelhub.get_objectiv_dataframe(
			db_url=DB_URL,
			start_date='2022-06-01',
			end_date='2022-06-30',
			table_name='data')
	pd.set_option('display.max_colwidth', 93)

.. doctest:: explore-data-features
	:skipif: engine is None

	>>> # add a readable product feature name to the dataframe as a column
	>>> df['feature_nice_name'] = df.location_stack.ls.nice_name

.. doctest:: explore-data-features
	:skipif: engine is None

	>>> # now easily look at the data by product feature
	>>> product_feature_data = modelhub.agg.unique_users(df, groupby=['feature_nice_name', 'event_type'])
	>>> product_feature_data.sort_values(ascending=False).to_frame().head(20)
	                                                                                                                       unique_users
	feature_nice_name                                                                              event_type 
	Root Location: home                                                                            ApplicationLoadedEvent           250
	Media Player: 2-minute-video located at Root Location: home => Content: modeling               MediaLoadEvent                   220
	Overlay: star-us-notification-overlay located at Root Location: home => Pressable: star-us...  VisibleEvent                     181
	                                                                                               HiddenEvent                       94
	Expandable: The Project located at Root Location: home => Navigation: docs-sidebar             VisibleEvent                      75
	Pressable: after located at Root Location: home => Content: capture-data => Content: data-...  PressEvent                        74
	Root Location: taxonomy                                                                        ApplicationLoadedEvent            58
	Expandable: the-project located at Root Location: home => Navigation: docs-sidebar             VisibleEvent                      55
	Pressable: after located at Root Location: home => Content: modeling => Content: modeling-...  PressEvent                        48
	Root Location: blog                                                                            ApplicationLoadedEvent            46
	Root Location: modeling                                                                        ApplicationLoadedEvent            45
	Link: about-us located at Root Location: home => Navigation: navbar-top                        PressEvent                        36
	Pressable: before located at Root Location: home => Content: capture-data => Content: data...  PressEvent                        35
	Expandable: reference located at Root Location: taxonomy => Navigation: docs-sidebar           VisibleEvent                      31
	Overlay: hamburger-menu located at Root Location: home => Navigation: navbar-top               VisibleEvent                      29
	Link: logo located at Root Location: home => Navigation: navbar-top                            PressEvent                        28
	Expandable: Reference located at Root Location: taxonomy => Navigation: docs-sidebar           VisibleEvent                      26
	Overlay: hamburger-menu located at Root Location: modeling => Navigation: navbar-top           VisibleEvent                      23
	Link: docs located at Root Location: home => Navigation: navbar-top                            PressEvent                        23
	Pressable: hamburger located at Root Location: home => Navigation: navbar-top                  PressEvent                        21

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.SeriesLocationStack.ls <../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack.ls>`
	* :doc:`modelhub.Aggregate.unique_users <../open-model-hub/models/aggregation/modelhub.Aggregate.unique_users>`
	* :doc:`bach.DataFrame.sort_values <../bach/api-reference/DataFrame/bach.DataFrame.sort_values>`
	* :doc:`bach.Series.to_frame <../bach/api-reference/Series/bach.Series.to_frame>`
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
	from modelhub import ModelHub
	modelhub = ModelHub(time_aggregation='%Y-%m-%d', global_contexts=['application', 'path'])
	DB_URL = os.environ.get('OBJ_DB_PG_TEST_URL', 'postgresql://objectiv:@localhost:5432/objectiv')
	df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date='2022-06-01', end_date='2022-06-30')
	df['feature_nice_name'] = df.location_stack.ls.nice_name
	product_feature_data = modelhub.agg.unique_users(df, groupby=['feature_nice_name', 'event_type'])
	def display_sql_as_markdown(arg): [print('sql\n' + arg.view_sql() + '\n')]
	# --- hide: stop ---
	# show the underlying SQL for this dataframe - works for any dataframe/model in Objectiv
	display_sql_as_markdown(product_feature_data)

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

Now that you've discovered the customer journeys that lead to conversion or drop-off, you can further analyze 
each of them to understand which ones could be optimized, or should get more/less focus. Another next step 
could be to have a more in-depth look at the marketing campaign data differences per source. 

* :doc:`Product Analytics notebook <./product-analytics>` - easily run basic product analytics on your data.
* :doc:`Marketing Analytics notebook <./marketing-analytics>` - analyze the above metrics and more for users 
	coming from marketing efforts.
