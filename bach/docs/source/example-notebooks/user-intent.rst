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
	>>> start_date = '2022-06-01'
	>>> end_date = None

.. we override the timeframe for the doctests below
	
.. testsetup:: user-intent
	:skipif: engine is None

	start_date = '2022-06-01'
	end_date = '2022-06-30'
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

Exploring root location
-----------------------
The root_location context in the location_stack uniquely represents the top-level UI location of the user. As 
a first step of grasping user intent, this is a good starting point to see in what main areas of your product 
users are spending time.

.. code-block:: python

    # model hub: unique users per application and root location
    users_root = modelhub.aggregate.unique_users(df, groupby=['application_id', 'root_location'])
    users_root.sort_index().head(10)

Exploring session duration
--------------------------
The average `session_duration` model from the `open model hub </docs/modeling/open-model-hub/>`_ is another good pointer to explore first for user intent.

.. code-block:: python

    # model hub: duration, per application and root location
    duration_root = modelhub.aggregate.session_duration(df, groupby=['application_id', 'root_location']).sort_index()
    duration_root.head(10)

Now, we can look at the distribution of time spent. We used the Bach quantile operation for this. We'll use this distribution to define the different stages of user intent.

.. code-block:: python

    # how is this time spent distributed?
    session_duration = modelhub.aggregate.session_duration(df, groupby='session_id')
    # materialization is needed because the expression of the created series contains aggregated data
    # and it is not allowed to aggregate that.
    session_duration = session_duration.materialize()

    # show quantiles
    session_duration.quantile(q=[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]).head(10)

Defining different stages of user intent
----------------------------------------
After exploring the `root_location` and `session_duration` (both per root location and quantiles), we can make a simple definition of different stages of user intent.

Based on the objectiv.io website data in the quickstart:

We think that users that spent most time (90th percentile) and specifically in our documentation sections are in the Implement phase of Objectiv. As there is a jump beyond the one minute mark at the 70th percentile, it feels sensible to deem that users beyond the 70th up to 90th perctile in our documentation sections are Exploring. The remaining users are Informing themselves about the product. Those users are spending less than 1:40 in the docs and/or spend any amount of time on our main website.

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
     - less than 1:40
   * - 2 - Explore
     - Docs: modeling, taxonomy, tracking, home
     - between 1:40 and 11:30
   * - 3 - Implement
     - Docs: modeling, taxonomy, tracking, home
     - more than 11:30

This is just for illustration purposes, you can adjust these definitions based on your own collected data.

Assigning user intent
---------------------
Based on the definitions above, we can start assigning a stage of intent to each user.

.. code-block:: python

    # set the root locations that we will use based on the definitions above
    roots = bach.DataFrame.from_pandas(engine=df.engine,
                                       df=pd.DataFrame({'roots': ['modeling', 'taxonomy', 'tracking', 'home', 'docs']}),
                                       convert_objects=True).roots

    # now we calculate the total time spent per _user_ and create a data frame from it
    user_intent_buckets = modelhub.agg.session_duration(df,
                                                        groupby=['user_id'],
                                                        method='sum',
                                                        exclude_bounces=False).to_frame()

    # same as above, but for selected roots only
    selector = (df.root_location.isin(roots)) & (df.application_id=='objectiv-docs')
    explore_inform_users_session_duration = modelhub.agg.session_duration(df[selector], groupby='user_id', method='sum')
    
    # and set it as column
    user_intent_buckets['explore_inform_duration'] = explore_inform_users_session_duration

    # first, we set the Inform bucket as a catch-all, meaning users that do not fall into Explore and Implement will be defined as Inform
    user_intent_buckets['bucket'] = '1 - inform'

    # calculate buckets duration
    user_intent_buckets.loc[(user_intent_buckets.explore_inform_duration >= timedelta(0, 100)) &
                            (user_intent_buckets.explore_inform_duration <= timedelta(0, 690)), 'bucket'] = '2 - explore'
    user_intent_buckets.loc[user_intent_buckets.explore_inform_duration > timedelta(0, 690), 'bucket'] = '3 - implement'

Now, we have assigned intent to each user and can for example look at the total number of users per intent bucket.

.. code-block:: python

    # total number of users per intent bucket
    user_intent_buckets.reset_index().groupby('bucket').agg({'user_id': 'nunique'}).head()

What's next?
------------
The are many next possible analysis steps, for example:

- What product features do each of the intent groups use?
- What kind of intent users come from different marketing campaigns?
- How can we drive more users to the 'Implement' stage? Look at different product features that users with the 'Implement' intent use, compared to 'Explore'.

A good starting point for these analyses on top of the user intent buckets is the basic product analytics example in the :doc:`example notebooks <index>`.

Get the SQL for any analysis
----------------------------

The SQL for any analysis can be exported with one command, so you can use models in production directly to 
simplify data debugging & delivery to BI tools like Metabase, dbt, etc. See how you can `quickly create BI 
dashboards with this <https://objectiv.io/docs/home/try-the-demo#creating-bi-dashboards>`_.

.. code-block:: python

    # get the SQL to use this analysis in for example your BI tooling
    display_sql_as_markdown(user_intent_buckets)