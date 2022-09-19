.. _feature_importance:

.. frontmatterposition:: 6

.. currentmodule:: bach

===========================
Modeling feature importance
===========================

This example notebook shows how you can use the open model hub to model the importance of features on 
achieving a conversion goal. Such features can be any interactions with your product's content. The model to 
run this directly using the open model hub is currently still in development; `see the draft PR 
<https://github.com/objectiv/objectiv-analytics/pull/662/>`_. 

The dataset used in this example is the same as in the `Demo </docs/home/try-the-demo/>`_. To run this on your
own data, see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`.

Get started
-----------
We first have to instantiate the model hub and an Objectiv DataFrame object.

.. doctest::
	:skipif: engine is None

	>>> # set the timeframe of the analysis
	>>> start_date = '2022-06-01'
	>>> end_date = None

.. we override the timeframe for the doctests below
	
.. testsetup:: feature-importance
	:skipif: engine is None

	start_date = '2022-02-15'
	end_date = '2022-05-16'

.. doctest:: feature-importance
	:skipif: engine is None

	>>> # instantiate the model hub, set the default time aggregation to daily
	>>> # and get the application & path global contexts
	>>> from modelhub import ModelHub, display_sql_as_markdown
	>>> modelhub = ModelHub(time_aggregation='%Y-%m-%d', global_contexts=['root_location'])
	>>> # get an Objectiv DataFrame within a defined timeframe
	>>> df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date=start_date, end_date=end_date)

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.ModelHub.get_objectiv_dataframe <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.get_objectiv_dataframe>`

Define features & conversion
----------------------------

First we have to define the conversion goal that we are predicting, as well as the features that we want to
use as predictors.

For this example, we define the conversion goal as reaching the :doc:`modeling section <../index>` in our 
documentation. We want to model the impact of users clicking/pressing in any of the main sections 
(`root locations <http://localhost:3000/docs/taxonomy/reference/location-contexts/RootLocationContext>`_) in 
our website. This works for our example, as there are only a limited amount of root locations in the dataset, 
and we make an assumption that there is as causal relation between the number of clicks in these root 
locations and conversion. Make sure to think of this assumption when using this model on your own data.

.. doctest:: feature-importance
	:skipif: engine is None
	
	>>> # define which events to use as conversion events
	>>> modelhub.add_conversion_event(location_stack=df.location_stack.json[{'id': 'modeling', '_type': 'RootLocationContext'}:], event_type='PressEvent', name='use_modeling')
	>>> # the features that we use for predicting
	>>> df['root'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')

We estimate conversion by using the number of presses in each root location with a logistic regression model. 
The coefficients of this regression can be interpreted as the contribution to conversion (direction and 
magnitude).

Next, we instantiate the dataset and untrained model.

.. code-block:: jupyter-notebook
	
	>>> # define which events to use as conversion events
	>>> X_temp, y_temp, model = modelhub.agg.feature_importance(data=df[df.event_type=='PressEvent'], name='use_modeling', feature_column='root')

This lets you adjust the dataset further, or use the model as-is:

- `y_temp` is a BooleanSeries that indicates conversion per user. 
- `X_temp` is a DataFrame with the number of presses per `user_id`. For users that converted in the selected 
	dataset, only usage from _before_ reaching conversion is counted. 
- The `model` is the toolkit that can be used to assess the feature importance on our conversion goal.

In this example we first review the dataset before using it for the actual model training (hence the `_temp` 
suffix). We create a single :doc:`DataFrame <../bach/api-reference/DataFrame/bach.DataFrame>` that has all 
the features, the target, and a sum of all features.

.. code-block:: jupyter-notebook

	>>> data_set_temp = X_temp.copy()
	>>> # we save the columns that are in our dataset, these will be used later.
	>>> columns = X_temp.data_columns
	>>> data_set_temp['is_converted'] = y_temp
	>>> data_set_temp['total_press'] = modelhub.map.sum_feature_rows(X_temp)

Review the dataset
------------------

For a logistic regression, several assumptions such as sample size, no influential outliers, and linear
relation between the features and the logit of the goal should be fulfilled. We'll first look at our data to
get the best possible dataset for our model.

.. code-block:: jupyter-notebook

	>>> data_set_temp.describe().head()

This shows that we have 543 samples in our data. It also shows that the mean is quite low for most features, 
and the same is true for the standard deviation. This indicates that the feature usage is not distributed
very well.

.. code-block:: jupyter-notebook

	>>> print(data_set_temp.is_converted.value_counts().head())
	>>> (data_set_temp.is_converted.value_counts()/data_set_temp.is_converted.count()).head()

The dataset is not balanced in terms of users that did or did not reach conversion: 74 converted users 
(13.6%). While this is not necessarily a problem, it influences the metric we choose to look at for model
performance. The model that we instantiated already accommodates for this.

We can also plot histograms of the features, so we can inspect the distributions more closely.

.. code-block:: jupyter-notebook

	>>> figure, axis = plt.subplots(len(columns), 2, figsize=(15,30))
	>>> 
	>>> for idx, name in enumerate(columns):
	>>> 	data_set_temp[data_set_temp.is_converted==True][[name]].plot.hist(bins=20, title='Converted', ax=axis[idx][0])
	>>> 	data_set_temp[data_set_temp.is_converted==False][[name]].plot.hist(bins=20, title='Not converted', ax=axis[idx][1])
	>>> plt.tight_layout()

We see that some features are not useful at all ('join-slack' and 'privacy'), so we will remove them. Moreover
we think that users that clicking only once in any of the root locations will not provide us with any
explanatory behavior for the goal. Those users might, for instance, be users that wanted to go to our 
modeling section, and this was the quickest way to get there with the results Google provided them. In that 
case, the intent of the user (something of which we can never be 100% sure), was going to the modeling 
section. The _features_ did not convince them.

By filtering like this, it is more likely that the used features on our website did, or did not convince a
user to check out the modeling section of our docs. This is exactly what we are after. An additional
advantage is that the distribution of feature usage will most likely get more favorable after removing
1-press-users.

.. code-block:: jupyter-notebook

	>>> # remove useless features.
	>>> data_set_temp = data_set_temp.drop(columns=['privacy', 'join-slack'])
	>>> # we update the columns that are still in our dataset.
	>>> columns = [x for x in data_set_temp.data_columns if x in X_temp.data_columns]
	>>> # only use users with at least more than 1 press.
	>>> data_set_temp = data_set_temp[data_set_temp.total_press>1]

If we now rerun the code above to review the dataset we find that the dataset is more balanced (16.5%
converted), although it is a bit small now (406 samples). The distributions as shown by describing the data
set and the histograms look indeed better for our model now. We will use this dataset to create our X and
y dataset that we will use in the model.

.. code-block:: jupyter-notebook

	>>> X = data_set_temp[columns]
	>>> y = data_set_temp.is_converted

Train and evaluate the model
----------------------------
As mentioned above, the model is based on logistic regression. Logistic regression seems sensible as it is
used for classification, but also has relatively easy to interpret coefficients for the features. The
feature importance model uses the AUC to assess the performance. This is because we are more interested in
the coefficients than the actual predicted labels, and also because this metric can handle imbalanced 
datasets. 

The feature importance model by default trains a logistic regression model three times on the entire
dataset split in threefolds. This way we can not only calculate the AUC on one test after training the model, 
but also see whether the coefficients for the model are relatively stable when trained on different
data. After fitting the model, the results (the average coefficients of the three models) as well as the
performance of the three models can be retrieved with `model` methods.

.. code-block:: jupyter-notebook

	>>> # train the model
	>>> model.fit(X, y, seed=.4)
	>>> model.results()

The mean of the coefficients are returned together with the standard deviation. The lower the standard
deviation, the more stable the coefficients in the various runs. Our results show that 'about' has most
negative impact on conversion, while 'tracking', 'blog' and 'taxonomy' has the most positive impact.

.. code-block:: jupyter-notebook

	>>> model.auc()

The average AUC of our models is 0.69. This is better than a baseline model (0.5 AUC). However, it also
means that it is not a perfect model and therefore the chosen features alone cannot predict conversion 
completely.

Amongst others, some things that might improve further models are a larger dataset, other explanatory
variables (i.e. more detailed locations instead of only root locations), and more information on the users
(i.e. user referrer as a proxy for user intent).

Get the SQL for any analysis
----------------------------

The SQL for any analysis can be exported with one command, so you can use models in production directly to 
simplify data debugging & delivery to BI tools like Metabase, dbt, etc. See how you can `quickly create BI 
dashboards with this <https://objectiv.io/docs/home/try-the-demo#creating-bi-dashboards>`_.

Where to go next
----------------

The model to run this directly using the open model hub is currently still in development; `see the draft PR 
<https://github.com/objectiv/objectiv-analytics/pull/662/>`_. 

Now that you've seen how to model feature importance, the best next step is to 
:doc:`see the basic user intent example notebook <./user-intent>`.
