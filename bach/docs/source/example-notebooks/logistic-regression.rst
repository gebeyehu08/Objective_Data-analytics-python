.. _example_logistic_regression:

.. frontmatterposition:: 5

.. currentmodule:: bach

===================
Logistic Regression
===================

Data collected with Objectiv is `strictly structured & designed for modeling 
<https://objectiv.io/docs/taxonomy>`_, making it ideal for various machine learning models, which can be 
applied directly without cleaning, transformations, or complex tooling.

This example notebook shows how you can predict user behavior with the :doc:`Logistic Regression model in 
the open model hub <../open-model-hub/models/machine-learning/LogisticRegression/modelhub.LogisticRegression>` 
on a full dataset collected with Objectiv. Examples of predictions you can create:

- Will a user convert?
- Will a user start using a specific product feature or area?
- Will a user have a long active session duration?. 

It's also available as a `full Jupyter notebook 
<https://github.com/objectiv/objectiv-analytics/blob/main/notebooks/model-hub-logistic-regression.ipynb>`_
to run on your own data (see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`). 
The dataset used here is the same as in `Objectiv Up </docs/home/up/>`__.

Get started
-----------
We first have to instantiate the model hub and an Objectiv DataFrame object.

.. doctest::
	:skipif: engine is None

	>>> # set the timeframe of the analysis
	>>> start_date = '2022-03-01'
	>>> end_date = None

.. we override the timeframe for the doctests below
	
.. testsetup:: lr
	:skipif: engine is None

	start_date = '2022-03-01'
	end_date = '2022-06-30'

.. doctest:: lr
	:skipif: engine is None

	>>> # instantiate the model hub, set the default time aggregation to daily
	>>> # and get the application & path global contexts
	>>> from modelhub import ModelHub, display_sql_as_markdown
	>>> modelhub = ModelHub(time_aggregation='%Y-%m-%d')
	>>> # get an Objectiv DataFrame within a defined timeframe
	>>> df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date=start_date, end_date=end_date)

The `location_stack` column, and the columns taken from the global contexts, contain most of the 
event-specific data. These columns are JSON typed, and we can extract data from it using the keys of the JSON 
objects with :doc:`SeriesLocationStack 
<../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack>` methods, or the `context` 
accessor for global context columns. See the :doc:`open taxonomy example <./open-taxonomy>` for how to use 
the `location_stack` and global contexts.

.. doctest:: lr
	:skipif: engine is None

	>>> df['root_location'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.ModelHub <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub>`
	* :doc:`modelhub.ModelHub.get_objectiv_dataframe <../open-model-hub/api-reference/ModelHub/modelhub.ModelHub.get_objectiv_dataframe>`
	* :ref:`Using global context data <location-stack-and-global-contexts>`
	* :doc:`modelhub.SeriesLocationStack.ls <../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack.ls>`

Creating a feature set to predict user behavior
-----------------------------------------------

For simple demonstration purposes, we'll predict if users on our own `website <https://www.objectiv.io>`_ 
will reach the `modeling section of our docs <https://objectiv.io/docs/modeling/>`_, by looking at 
interactions they have with all the main sections on our site, as defined by the `root location
<https://objectiv.io/docs/taxonomy/reference/location-contexts/RootLocationContext/>`_.

We'll create a dataset that counts the number of clicks per user in each section. Note that this is a simple 
dataset used just for demonstration purposes of the logistic regression functionality, and not so much the 
results itself. For ins and outs on feature engineering see the :doc:`feature engineering notebook 
<./feature-engineering>`.

.. doctest:: lr
	:skipif: engine is None

	>>> # first replace dashes in the root_location Series, because is unstacked later on
	>>> # and dashes are not allowed in BigQuery column names
	>>> df['root_location'] = df['root_location'].str.replace('-', '_')

.. doctest:: lr
	:skipif: engine is None

	>>> # look at the number of clicks per user in each section; only PressEvents, counting the root_locations
	>>> features = df[(df.event_type=='PressEvent')].groupby('user_id').root_location.value_counts()

.. doctest:: lr
	:skipif: engine is None

	>>> # unstack the series, to create a DataFrame with the number of clicks per root location as columns
	>>> features_unstacked = features.unstack(fill_value=0)

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.groupby <../bach/api-reference/DataFrame/bach.DataFrame.groupby>`
	* :doc:`bach.Series.value_counts <../bach/api-reference/Series/bach.Series.value_counts>`
	* :doc:`bach.DataFrame.unstack <../bach/api-reference/DataFrame/bach.DataFrame.unstack>`

Sample the data
~~~~~~~~~~~~~~~
To limit data processing and speed up fitting, let's take a 10% sample of the full dataset to train the model 
on. After the model is fitted, it can easily be unsampled again to predict the labels for the _entire_ 
dataset.

.. doctest:: lr
	:skipif: engine is None

	>>> # take a 10% sample to train the model on
	>>> # for BigQuery the table name should be 'YOUR_PROJECT.YOUR_WRITABLE_DATASET.YOUR_TABLE_NAME'
	>>> features_set_sample = features_unstacked.get_sample('test_lr_sample', sample_percentage=10, overwrite=True)

To predict whether a user clicked in the modeling section of our docs, we will look at the number of clicks in 
any of the other sections:

- `X` is a :doc:`DataFrame <../bach/api-reference/DataFrame/bach.DataFrame>` that contains the explanatory 
	variables.
- `y` is a :doc:`SeriesBoolean <../bach/api-reference/Series/Boolean/index>` with the labels we want to 
	predict.

.. NOTE: Because of random sampling, the following will never be deterministic if executed as a doctest, so 
	instead running most of it as a regular code-block

.. doctest:: lr
	:skipif: engine is None

	>>> # set the explanatory variables and labels to predict
	>>> y_column = 'modeling'
	>>> y = features_set_sample[y_column] > 0
	>>> X = features_set_sample.drop(columns=[y_column])

.. code-block:: jupyter-notebook

	>>> # see what `X` looks like
	>>> X.head()
	
.. code-block:: jupyter-notebook-out

	                                      about  blog  home  jobs  join_slack  privacy  taxonomy  tracking
	user_id
	007f5fd7-7535-434e-aa3e-3d52f06d63ce      0     0     4     0           0        0         0         0
	014c911b-53a9-44e2-9805-369e0b4d598f      0     0     0     0           0        0         1         0
	02cf09ee-0ad8-418e-a8a8-82cf3ca4a9b7      0     0     2     0           0        0         0         0
	066f3814-6e32-4267-9e87-e918b6708995      0     0     1     0           0        0         0         0
	0717f786-572e-461f-b895-53fef9a6a757      0     0     3     0           0        0         0         0

.. code-block:: jupyter-notebook

	>>> # and see what `y` looks like
	>>> y.head()
	
.. code-block:: jupyter-notebook-out

	user_id
	007f5fd7-7535-434e-aa3e-3d52f06d63ce     True
	014c911b-53a9-44e2-9805-369e0b4d598f    False
	02cf09ee-0ad8-418e-a8a8-82cf3ca4a9b7    False
	066f3814-6e32-4267-9e87-e918b6708995    False
	0717f786-572e-461f-b895-53fef9a6a757    False
	Name: modeling, dtype: boo

.. admonition:: Reference
	:class: api-reference

	* :doc:`bach.DataFrame.get_sample <../bach/api-reference/DataFrame/bach.DataFrame.get_sample>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`

Instantiate & fit the logistic regression model
-----------------------------------------------
As the model is based on sklearn's version of LogisticRegression, it can be instantiated with any parameters 
that `sklearn's LogisticRegression 
<https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html>`_ supports. 
In our example we instantiate it with ``fit_intercept=False``.

.. doctest:: lr
	:skipif: engine is None

	>>> lr = modelhub.get_logistic_regression(fit_intercept=False)

The `fit` operation then fits it to the passed data. This operation extracts the data from the database under 
the hood.

.. doctest:: lr
	:skipif: engine is None

	>>> lr.fit(X, y)
	LogisticRegression(fit_intercept=False)

Set accuracy & prediction
-------------------------
All of the following operations are carried out directly on the database.

.. code-block:: jupyter-notebook

	>>> lr.score(X, y)

.. code-block:: jupyter-notebook-out

	0.7941176470588235

The model provides the same attributes as `sklearn's Logistic Regression model 
<https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html>`_, such as 
`coef_`. 

.. code-block:: jupyter-notebook

    >>> # show the coefficients of the fitted model
    >>> lr.coef_

.. code-block:: jupyter-notebook-out

	array([[-0.82043069,  0.61146569, -0.12662165, -0.23339689,  0.        ,
	        -0.30166917, -0.13706966,  0.37093552]])

Now let's create columns for the predicted values and the labels in the dataset. Labels are set to `True` if 
the probability is over 0.5.

.. doctest:: lr
	:skipif: engine is None

	>>> features_set_sample['predicted_values'] = lr.predict_proba(X)
	>>> features_set_sample['predicted_labels'] = lr.predict(X)

.. code-block:: jupyter-notebook

	>>> # show the sampled data set, including predictions
	>>> features_set_sample.head(20)

.. code-block:: jupyter-notebook-out

	                                      about  blog  home  jobs  join_slack  modeling  privacy  taxonomy  tracking  predicted_values  predicted_labels
	user_id
	007f5fd7-7535-434e-aa3e-3d52f06d63ce      0     0     4     0           0         4        0         0         0          0.283592             False
	012e2d45-32ed-4f33-84e5-babfd3b10372      0     0     2     0           0         0        0         0         0          0.386190             False
	023ec102-bc2f-4f30-bd42-12dcdbd96e31      0     0     2     0           0         0        0         0         0          0.386190             False
	02bc6ae7-153c-44e2-ba4a-301984960ac9      0     0     1     0           0         0        0         0         0          0.442338             False
	02c42c27-1c0d-4e3e-b6c0-403a60e8eb83      0     0     0     0           0         0        0         3         0          0.372160             False
	030f618e-00e8-4d83-b95e-0c2870978e08      0     0     3     0           0         0        0         0         0          0.332914             False
	062dded9-cf06-48fc-9923-ebb5e526f154      0     0     2     0           0         0        0         0         0          0.386190             False
	0a16f4d9-eb23-4b86-a886-9276ab1912a0      2     0     4     0           0         0        0         0         0          0.247541             False
	0abfcb9e-bc78-49c6-8bb0-4187aa4d8ab2      0     0     7     0           0         5        0         0         0          0.164964             False
	0bae858b-80c5-4c34-ae29-2aea00be8ac5      1     1     2     1           0         0        0         2         0          0.331506             False
	0bc184f0-f879-44a6-978e-f203bd9e03c1      0     2     0     0           0         0        0         0         0          0.780044              True
	0bd503b7-4a60-401f-a217-f9e29bd4686b      0     0     1     0           0         0        0         0         0          0.442338             False
	0c235f61-53c4-4708-9f35-fa554da293ca      0     0     1     0           0         0        0         0         0          0.442338             False
	0dc6bfb4-f054-4f48-b2c1-a07dd6e31cc7      0     0     1     0           0         0        0         0         0          0.442338             False
	1190e603-b127-41d5-9e8d-72d2ed3402da      0     0     5     0           0         0        0         0         0          0.238960             False
	13292379-1ad7-4dd5-9b90-bf65408fa24e      0     0     1     0           0         0        0         0         0          0.442338             False
	13a975e8-3533-47b0-ae04-08a97a5e211c      0     2     0     0           0         0        0         0         0          0.780044              True
	1b219545-08e0-43fa-b476-c6bf0d80c0c7      1     0     8     1           0         0        0         0         0          0.085039             False
	1e644cdb-5e79-4536-ab17-6948b4c000bf      0     0     1     0           0         0        0         3         1          0.484079             False
	1fc27f44-d229-4f21-9d14-bb0a21571f00      0     0     3     0           0         0        0         0         0          0.332914             False

.. admonition:: Reference
	:class: api-reference

	* :doc:`modelhub.LogisticRegression.score <../open-model-hub/models/machine-learning/LogisticRegression/modelhub.LogisticRegression.score>`
	* `sklearn's Logistic Regression model <https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html>`_
	* :doc:`modelhub.LogisticRegression.predict <../open-model-hub/models/machine-learning/LogisticRegression/modelhub.LogisticRegression.predict>`
	* :doc:`modelhub.LogisticRegression.predict_proba <../open-model-hub/models/machine-learning/LogisticRegression/modelhub.LogisticRegression.predict_proba>`
	* :doc:`bach.DataFrame.head <../bach/api-reference/DataFrame/bach.DataFrame.head>`

Unsample and get the SQL
------------------------
The sampled dataset we used above can easily be unsampled.

.. doctest:: lr
	:skipif: engine is None

	>>> features_set_full = features_set_sample.get_unsampled()

The SQL for any analysis can be exported with one command, so you can use models in production directly to 
simplify data debugging & delivery to BI tools like Metabase, dbt, etc. See how you can `quickly create BI 
dashboards with this <https://objectiv.io/docs/home/up#creating-bi-dashboards>`_.

.. exec_code::
	:language: jupyter-notebook
	:language_output: jupyter-notebook-out

	# --- hide: start ---
	import os
	from modelhub import ModelHub
	modelhub = ModelHub(time_aggregation='%Y-%m-%d')
	DB_URL = os.environ.get('OBJ_DB_PG_TEST_URL', 'postgresql://objectiv:@localhost:5432/objectiv')
	df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date='2022-03-01', end_date='2022-06-30')
	df['root_location'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id').str.replace('-', '_')
	features = df[(df.event_type=='PressEvent')].groupby('user_id').root_location.value_counts()
	features_unstacked = features.unstack(fill_value=0)
	features_set_sample = features_unstacked.get_sample('test_lr_sample', sample_percentage=10, overwrite=True)
	y_column = 'modeling'
	y = features_set_sample[y_column] > 0
	X = features_set_sample.drop(columns=[y_column])
	lr = modelhub.get_logistic_regression(fit_intercept=False)
	lr.fit(X, y)
	features_set_sample['predicted_values'] = lr.predict_proba(X)
	features_set_sample['predicted_labels'] = lr.predict(X)
	features_set_full = features_set_sample.get_unsampled()
	def display_sql_as_markdown(arg): [print('sql\n' + arg.view_sql() + '\n')]
	# --- hide: stop ---
	# show the underlying SQL for this dataframe - works for any dataframe/model in Objectiv
	display_sql_as_markdown(features_set_full)

That's it! Stay tuned for more metrics to assess model fit, as well as simplifying splitting the data into 
training and testing datasets.

`Join us on Slack <https://objectiv.io/join-slack>`_ if you have any questions or suggestions.

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

* :doc:`Feature importance notebook <./feature-importance>` - model the importance of features on achieving a 
	conversion goal.
* :doc:`User Intent notebook <./user-intent>` - run basic User Intent analysis with Objectiv.

