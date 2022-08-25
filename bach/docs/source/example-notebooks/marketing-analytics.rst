.. _marketing_analytics:

.. frontmatterposition:: 3

.. currentmodule:: bach_open_taxonomy

===================
Marketing Analytics
===================

This example notebook shows how you can easily analyze traffic coming from Marketing campaigns, as measured 
via UTM tags. It's also available as a `full Jupyter notebook 
<https://github.com/objectiv/objectiv-analytics/blob/main/notebooks/marketing-analytics.ipynb>`_
to run on your own data (see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`), 
or you can instead `run the Demo </docs/home/quickstart-guide/>`_ to quickly try it out. The dataset used 
here is the same as in the Demo.

Get started
-----------
We first have to instantiate the model hub and an Objectiv DataFrame object.

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # instantiate the model hub, and set the default time aggregation to daily
	>>> from modelhub import ModelHub
	>>> modelhub = ModelHub(time_aggregation='%Y-%m-%d')
	>>> # get an Objectiv DataFrame within a defined timeframe
	>>> df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date='2022-06-01', end_date='2022-08-20')

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # The columns 'global_contexts' and the 'location_stack' contain most of the event specific data. These columns are json type 
	>>> # columns and we can extract data from it based on the keys of the json objects using `SeriesGlobalContexts` or 
	>>> # `SeriesLocationStack` methods to extract the data.
	>>> # add 'application', 'feature_nice_name' and 'root_location' as columns, so that we can use it for grouping etc later
	>>> df['feature_nice_name'] = df.location_stack.ls.nice_name
	>>> df['root_location'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # derive a specific DataFrame with added marketing contexts
	>>> df_acquisition = df.copy()
	>>> # extract referrer and marketing contexts from the global contexts
	>>> df_acquisition['referrer'] = df_acquisition.global_contexts.gc.get_from_context_with_type_series(type='HttpContext', key='referrer')
	>>> df_acquisition['utm_source'] = df_acquisition.global_contexts.gc.get_from_context_with_type_series(type='MarketingContext', key='source')
	>>> df_acquisition['utm_medium'] = df_acquisition.global_contexts.gc.get_from_context_with_type_series(type='MarketingContext', key='medium')
	>>> df_acquisition['utm_campaign'] = df_acquisition.global_contexts.gc.get_from_context_with_type_series(type='MarketingContext', key='campaign')

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # also define a DataFrame with only the sessions that came in via a marketing campaign
	>>> campaign_sessions = df_acquisition[~df_acquisition['utm_source'].isnull()]['session_id'].unique()
	>>> df_marketing_only = df_acquisition[df_acquisition['session_id'].isin(campaign_sessions)]

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # define a further selection: which source to select in the below analyses.
	>>> source_selection = ['twitter', 'reddit']
	>>> sources = DataFrame.from_pandas(engine=df.engine, df=pd.DataFrame({'sources': source_selection}), convert_objects=True).sources
	>>> # filter on defined list of UTM Sources
	>>> df_marketing_selection = df_marketing_only[(df_marketing_only.utm_source.isin(sources))]

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # materialize the DataFrame as temporary tables to reduce the complexity of the underlying queries
	>>> df_acquisition = df_acquisition.materialize(materialization='temp_table')
	>>> df_marketing_only = df_marketing_only.materialize(materialization='temp_table')
	>>> df_marketing_selection = df_marketing_selection.materialize(materialization='temp_table')

**Available dataframes:**

- `df` = all + `feature_nice_name` + `root_location`.
- `df_acquisition` = `df` + referrer + UTMs
- `df_marketing_only` = `df_acquisition`, but only sessions with non_null `utm_source`.
- `df_marketing_selection` = `df_marketing_only`, but filtered for selection, e.g. only `utm_source` in `{'reddit', 'twitter'}`.

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.ModelHub.get_objectiv_dataframe <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.get_objectiv_dataframe>`
	* :doc:`modelhub.SeriesGlobalContexts.gc <../open-model-hub/api-reference/SeriesGlobalContexts/modelhub.SeriesGlobalContexts.gc>`
	* :doc:`bach.DataFrame.from_pandas <../bach/api-reference/DataFrame/bach.DataFrame.from_pandas>`
	* :doc:`bach.Series.isnull <../bach/api-reference/Series/bach.Series.isnull>`
	* :doc:`bach.DataFrame.materialize <../bach/api-reference/DataFrame/bach.DataFrame.materialize>`

Acquisition
-----------

Users from marketing
~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> users_from_marketing_daily = modelhub.aggregate.unique_users(df_marketing_selection).sort_index(ascending=False)
	>>> users_from_marketing_daily.head()
	time_aggregation
	2022-08-09     7
	2022-08-08    20
	2022-08-07     6
	2022-08-06     7
	2022-08-05     6
	Name: unique_users, dtype: int64

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> users_from_marketing_daily = modelhub.aggregate.unique_users(df_marketing_selection).sort_index(ascending=False)
	>>> users_from_marketing_daily.sort_index(ascending=True).to_pandas().plot(kind='bar', figsize=[15,5], title='Daily #users from marketing', xlabel='Day')
	<AxesSubplot:title={'center':'Daily #users from marketing'}, xlabel='Day'>

.. image:: ../img/docs/example-notebooks/marketing-analytics-users-from-marketing.png
  :alt: Daily #users from marketing

Users per source-medium-campaign over full timeframe
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # split users by marketing _campaign_ (based on UTM data)
	>>> users_per_campaign = modelhub.aggregate.unique_users(df_marketing_selection, ['utm_source', 'utm_medium', 'utm_campaign'])
	>>> users_per_campaign.reset_index().dropna(axis=0, how='any', subset='utm_source').sort_values(['unique_users'], ascending=False).head(10)
	  utm_source utm_medium         utm_campaign  unique_users
	0    twitter       paid             utm_test           213
	1     reddit       paid                 june            83
	2    twitter       paid      july_conversion            65
	3     reddit       paid      july_conversion            38
	4    twitter     social                 blog            11
	5    twitter       paid                 july             4
	6    twitter      paidl                 july             1
	7    twitter       post  Oktopost-Horizontal             1

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # split users by marketing _campaign_ (based on UTM data)
	>>> users_per_campaign = modelhub.aggregate.unique_users(df_marketing_selection, ['utm_source', 'utm_medium', 'utm_campaign'])
	>>> users_per_campaign.reset_index().dropna(axis=0, how='any', subset='utm_source').sort_values(['unique_users'], ascending=False).head(10)
	  utm_source utm_medium         utm_campaign  unique_users
	0    twitter       paid             utm_test           213
	1     reddit       paid                 june            83
	2    twitter       paid      july_conversion            65
	3     reddit       paid      july_conversion            38
	4    twitter     social                 blog            11
	5    twitter       paid                 july             4
	6    twitter      paidl                 july             1
	7    twitter       post  Oktopost-Horizontal             1

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # Stacked graph per campaign
	>>> upc = users_per_campaign.to_frame().reset_index()[['utm_source', 'utm_campaign', 'unique_users']]
	>>> upc = upc.to_pandas().groupby(['utm_source', 'utm_campaign'])
	>>> upc_pivot = upc.sum().reset_index().pivot(index='utm_source', columns='utm_campaign')['unique_users'].reset_index().sort_values(by=['utm_source'], ascending=False)
	>>> upc_pivot.plot.bar(x='utm_source', stacked=True)
	<AxesSubplot:xlabel='utm_source'>

.. image:: ../img/docs/example-notebooks/marketing-analytics-users-per-source-campaign.png
  :alt: Users per source-medium-campaign over full timeframe

Users from marketing _source_ per day
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # users by marketing _source_, per day
	>>> source_users_daily = modelhub.agg.unique_users(df_marketing_selection, groupby=['day', 'utm_source'])
	>>> source_users_daily = source_users_daily.reset_index()
	>>> source_users_daily.sort_values('day', ascending=False).head(20)
	           day utm_source  unique_users
	0   2022-08-09    twitter             3
	1   2022-08-09     reddit             4
	2   2022-08-08     reddit             5
	3   2022-08-08    twitter            15
	4   2022-08-07     reddit             1
	5   2022-08-07    twitter             5
	6   2022-08-06    twitter             4
	7   2022-08-06     reddit             3
	8   2022-08-05    twitter             5
	9   2022-08-05     reddit             1
	10  2022-08-04    twitter            10
	11  2022-08-04     reddit             2
	12  2022-08-03    twitter             4
	13  2022-08-03     reddit             6
	14  2022-08-02     reddit             8
	15  2022-08-02    twitter             8
	16  2022-08-01    twitter            11
	17  2022-08-01     reddit             5
	18  2022-07-31    twitter             1
	19  2022-07-31     reddit             3

Users from marketing _campaign_ per day
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # users by marketing _campaign_ (based on UTM data), per day
	>>> users_per_campaign_daily = modelhub.aggregate.unique_users(df_marketing_selection, ['day', 'utm_source', 'utm_medium', 'utm_campaign'])
	>>> users_per_campaign_daily = users_per_campaign_daily.reset_index()
	>>> users_per_campaign_daily.sort_values('day', ascending=False).head(20)
	           day utm_source utm_medium     utm_campaign  unique_users
	0   2022-08-09     reddit       paid  july_conversion             3
	1   2022-08-09     reddit       paid             june             1
	2   2022-08-09    twitter     social             blog             1
	3   2022-08-09    twitter       paid  july_conversion             2
	4   2022-08-08     reddit       paid  july_conversion             5
	5   2022-08-08    twitter       paid  july_conversion            15
	6   2022-08-07     reddit       paid  july_conversion             1
	7   2022-08-07    twitter       paid  july_conversion             5
	8   2022-08-06     reddit       paid  july_conversion             3
	9   2022-08-06    twitter       paid  july_conversion             4
	10  2022-08-05    twitter       paid  july_conversion             5
	11  2022-08-05     reddit       paid  july_conversion             1
	12  2022-08-04    twitter       paid  july_conversion            10
	13  2022-08-04     reddit       paid  july_conversion             2
	14  2022-08-03    twitter       paid  july_conversion             4
	15  2022-08-03     reddit       paid  july_conversion             6
	16  2022-08-02     reddit       paid  july_conversion             8
	17  2022-08-02    twitter       paid  july_conversion             8
	18  2022-08-01     reddit       paid  july_conversion             4
	19  2022-08-01     reddit       paid             june             1

Referrers overall
~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # users by referrer in full timeframe (overall, including coming from marketing campaigns)
	>>> referrer_users = modelhub.agg.unique_users(df_acquisition, groupby=['referrer']).sort_values(ascending=False)
	>>> referrer_users.head(20)
	referrer
	                                                           1067
	https://objectiv.io/                                        151
	https://www.google.com/                                     147
	https://www.reddit.com/                                     105
	https://t.co/                                                59
	https://www.linkedin.com/                                    46
	https://github.com/                                          36
	https://github.com/objectiv/objectiv-analytics               34
	https://stackshare.io/                                       17
	https://news.ycombinator.com/                                17
	https://www.kdnuggets.com/                                   16
	https://github.com/RunaCapital/awesome-oss-alternatives      11
	android-app://com.linkedin.android/                          10
	https://objectiv.io/docs/modeling/open-model-hub/             8
	android-app://com.slack/                                      8
	https://www.google.nl/                                        7
	https://objectiv.io/docs/home/quickstart-guide/               7
	https://www.curiosityvc.com/                                  7
	https://www.fly.vc/                                           6
	https://okt.to/                                               6
	Name: unique_users, dtype: int64

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.ModelHub.get_objectiv_dataframe <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.get_objectiv_dataframe>`
	* :doc:`bach.Series.sort_index <../bach/api-reference/Series/bach.Series.sort_index>`
	* :doc:`bach.Series.to_pandas <../bach/api-reference/Series/bach.Series.to_pandas>`
	* :doc:`modelhub.Aggregate.unique_users <../open-model-hub/models/aggregation/modelhub.Aggregate.unique_users>`
	* :doc:`bach.Series.reset_index <../bach/api-reference/Series/bach.Series.reset_index>`
	* :doc:`bach.Series.group_by <../bach/api-reference/Series/bach.Series.group_by>`
	* :doc:`bach.DataFrame.dropna <../bach/api-reference/DataFrame/bach.DataFrame.dropna>`
	* :doc:`bach.DataFrame.to_pandas <../bach/api-reference/DataFrame/bach.DataFrame.to_pandas>`
	* :doc:`bach.Series.to_frame <../bach/api-reference/Series/bach.Series.to_frame>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`

Conversion
----------
See conversion overall and from marketing. Conversion in this example is defined as clicking any link on the 
website or docs to our GitHub repo.

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # define the conversion event in `df_acquisition` and `df_marketing_selection`
	>>> # in this example: clicking any link leading to our GitHub repo
	>>> # create a column that extracts all location stacks that lead to our GitHub repo
	>>> location_stack_conversion = {'id': 'browse-on-github', '_type': 'LinkContext'}
	>>> modelhub.add_conversion_event(location_stack=df_acquisition.location_stack.json[location_stack_conversion:], event_type='PressEvent', name='github_press')
	>>> modelhub.add_conversion_event(location_stack=df_marketing_selection.location_stack.json[location_stack_conversion:], event_type='PressEvent', name='github_press')
	>>> df_acquisition['is_conversion_event'] = modelhub.map.is_conversion_event(df_acquisition, 'github_press')
	>>> df_marketing_selection['is_conversion_event'] = modelhub.map.is_conversion_event(df_marketing_selection, 'github_press')


.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.series.series_json.JsonAccessor <../bach/api-reference/Series/Json/bach.SeriesJson.json>`
	* :doc:`modelhub.ModelHub.add_conversion_event <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.add_conversion_event>`
	* :doc:`modelhub.Map.is_conversion_event <../open-model-hub/models/helper-functions/modelhub.Map.is_conversion_event>`	

Daily conversions from marketing
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # calculate daily conversions from marketing (based on UTM data)
	>>> conversions_from_marketing = df_marketing_selection[df_marketing_selection.is_conversion_event].dropna(axis=0, how='any', subset='utm_source')
	>>> conversions_from_marketing_daily = modelhub.aggregate.unique_users(conversions_from_marketing).sort_index(ascending=False)
	>>> conversions_from_marketing_daily.head()
	time_aggregation
	2022-08-04    1
	2022-07-26    4
	2022-07-25    1
	2022-07-23    5
	2022-07-22    1
	Name: unique_users, dtype: int64

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> conversions_from_marketing_daily.sort_index(ascending=True).to_pandas().plot(kind='bar', figsize=[15,5], title='Daily #conversions from marketing', xlabel='Day')
	<AxesSubplot:title={'center':'Daily #conversions from marketing'}, xlabel='Day'>

.. image:: ../img/docs/example-notebooks/marketing-analytics-number-conversions-from-marketing.png
  :alt: Daily #conversions from marketing

Daily conversion rate from marketing
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None

	>>> # calculate daily conversion rate from marketing campaigns overall
	>>> # divide conversions from campaigns by total daily number of people coming from campaigns 
	>>> conversion_rate_from_marketing = (conversions_from_marketing_daily / users_from_marketing_daily) * 100
	>>> conversion_rate_from_marketing.sort_index(ascending=False).fillna(0.0).head(10)
	time_aggregation
	2022-08-09    0.000000
	2022-08-08    0.000000
	2022-08-07    0.000000
	2022-08-06    0.000000
	2022-08-05    0.000000
	2022-08-04    8.333333
	2022-08-03    0.000000
	2022-08-02    0.000000
	2022-08-01    0.000000
	2022-07-31    0.000000
	Name: unique_users, dtype: float64

.. doctest:: marketing-analytics
	:skipif: engine is None
	
	>>> conversion_rate_from_marketing.fillna(0.0).sort_index(ascending=True).to_pandas().plot(kind='line', figsize=[15,5], title='Daily conversion rate from marketing', xlabel='Day')
	<AxesSubplot:title={'center':'Daily conversion rate from marketing'}, xlabel='Day'>

.. image:: ../img/docs/example-notebooks/marketing-analytics-conversion-rate-from-marketing.png
  :alt: Daily conversion rate from marketing

Daily conversions overall
~~~~~~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None
	
	>>> # calculate daily conversions overall (including from marketing campaigns)
	>>> conversions_overall = modelhub.aggregate.unique_users(df_acquisition[df_acquisition.is_conversion_event])
	>>> conversions_overall.sort_index(ascending=False).head()
	time_aggregation
	2022-08-04    1
	2022-07-26    4
	2022-07-25    1
	2022-07-23    5
	2022-07-22    1
	Name: unique_users, dtype: int64

	>>> # plot daily conversions overall (including from marketing campaigns)
	>>> conversions_overall.to_pandas().plot(kind='bar', figsize=[15,5], title='Daily #conversions overall', xlabel='Day')
	<AxesSubplot:title={'center':'Daily #conversions overall'}, xlabel='Day'>

.. image:: ../img/docs/example-notebooks/marketing-analytics-conversions-overall.png
  :alt: Daily #conversions overall

Daily conversion rate overall
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. doctest:: marketing-analytics
	:skipif: engine is None
	
	>>> # calculate daily conversion rate overall (including from marketing campaigns)
	>>> daily_users = modelhub.aggregate.unique_users(df_acquisition).sort_index(ascending=False)
	>>> conversion_rate_overall = (conversions_overall / daily_users) * 100
	>>> conversion_rate_overall.sort_index(ascending=False).head(10)
	time_aggregation
	2022-08-09       NaN
	2022-08-08       NaN
	2022-08-07       NaN
	2022-08-06       NaN
	2022-08-05       NaN
	2022-08-04    1.5625
	2022-08-03       NaN
	2022-08-02       NaN
	2022-08-01       NaN
	2022-07-31       NaN
	Name: unique_users, dtype: float64

	>>> conversion_rate_overall.sort_index(ascending=True).fillna(0.0).to_pandas().plot(kind='line', figsize=[15,5], title='Daily conversion rate overall', xlabel='Day')
	<AxesSubplot:title={'center':'Daily conversion rate overall'}, xlabel='Day'>

.. image:: ../img/docs/example-notebooks/marketing-analytics-conversion-rate-overall.png
  :alt: Daily conversion rate overall

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.series.series_json.JsonAccessor <../bach/api-reference/Series/Json/bach.SeriesJson.json>`
	* :doc:`modelhub.Map.is_conversion_event <../open-model-hub/models/helper-functions/modelhub.Map.is_conversion_event>`
	* :doc:`bach.DataFrame.dropna <../bach/api-reference/DataFrame/bach.DataFrame.dropna>`
	* :doc:`modelhub.Aggregate.unique_users <../open-model-hub/models/aggregation/modelhub.Aggregate.unique_users>`
	* :doc:`bach.Series.sort_index <../bach/api-reference/Series/bach.Series.sort_index>`
	* :doc:`bach.DataFrame.to_pandas <../bach/api-reference/DataFrame/bach.DataFrame.to_pandas>`
	* :doc:`bach.DataFrame.fillna <../bach/api-reference/DataFrame/bach.DataFrame.fillna>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`

Conversion split by source & campaign
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Conversions per marketing _source_ over full timeframe
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. doctest:: marketing-analytics
	:skipif: engine is None
	
	>>> # calculate conversions per marketing _source_ over the full timeframe (based on UTM data)
	>>> campaign_conversions_source_timeframe = modelhub.aggregate.unique_users(df_marketing_selection[df_marketing_selection.is_conversion_event], ['utm_source'])
	>>> campaign_conversions_source_timeframe.reset_index().dropna(axis=0, how='any', subset='utm_source').sort_values(['unique_users'], ascending=False).head()
	  utm_source  unique_users
	0    twitter             8
	1     reddit             3

Conversions per marketing _source_ daily
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. doctest:: marketing-analytics
	:skipif: engine is None
	
	>>> # split daily conversions by marketing _source_ (based on UTM data)
	>>> campaign_conversions_source_daily = modelhub.aggregate.unique_users(df_marketing_selection[df_marketing_selection.is_conversion_event], ['day', 'utm_source'])
	>>> campaign_conversions_source_daily.reset_index().dropna(axis=0, how='any', subset='utm_source').set_index('day').sort_index(ascending=False).head(10)
	           utm_source  unique_users
	day
	2022-08-04    twitter             1
	2022-07-26     reddit             1
	2022-07-26    twitter             3
	2022-07-25    twitter             1
	2022-07-23    twitter             3
	2022-07-23     reddit             2
	2022-07-22    twitter             1

Conversions per marketing _campaign over full timeframe
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. doctest:: marketing-analytics
	:skipif: engine is None
	
	>>> # split conversions by marketing _campaign_ (based on UTM data)
	>>> campaign_conversions_campaign = modelhub.aggregate.unique_users(df_marketing_selection[df_marketing_selection.is_conversion_event], ['utm_source', 'utm_medium', 'utm_campaign'])
	>>> campaign_conversions_campaign.reset_index().dropna(axis=0, how='any', subset='utm_source').sort_values(['utm_source', 'unique_users'], ascending=False).head()
	  utm_source utm_medium     utm_campaign  unique_users
	0    twitter       paid         utm_test             8
	1    twitter       paid  july_conversion             1
	2     reddit       paid             june             3

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.series.series_json.JsonAccessor <../bach/api-reference/Series/Json/bach.SeriesJson.json>`
	* :doc:`modelhub.Aggregate.unique_users <../open-model-hub/models/aggregation/modelhub.Aggregate.unique_users>`
	* :doc:`modelhub.Map.is_conversion_event <../open-model-hub/models/helper-functions/modelhub.Map.is_conversion_event>`
	* :doc:`bach.DataFrame.dropna <../bach/api-reference/DataFrame/bach.DataFrame.dropna>`
	* :doc:`bach.DataFrame.sort_values <../bach/api-reference/DataFrame/bach.DataFrame.sort_values>`
	* :doc:`bach.Series.sort_index <../bach/api-reference/Series/bach.Series.sort_index>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`

Avg. Duration
-------------

Avg. duration per ad source
~~~~~~~~~~~~~~~~~~~~~~~~~~~
TODO

