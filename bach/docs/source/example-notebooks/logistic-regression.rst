.. _example_logistic_regression:

.. frontmatterposition:: 5

.. currentmodule:: bach

===================
Logistic Regression
===================

Data collected with Objectiv is `strictly structured & designed for modeling 
<https://objectiv.io/docs/taxonomy>`_, making it ideal for various machine learning models, which can be 
applied directly without cleaning, transformations, or complex tooling.

This example notebook shows how you can predict user behavior with the `Logistic Regression model in the open 
model hub <../open-model-hub/models/machine-learning/LogisticRegression/modelhub.LogisticRegression>` on a 
full dataset collected with Objectiv. Examples of predictions you can create:

- Will a user convert?
- Will a user start using a specific product feature or area?
- Will a user have a long active session duration?. 

It's also available as a `full Jupyter notebook 
<https://github.com/objectiv/objectiv-analytics/blob/main/notebooks/model-hub-logistic-regression.ipynb>`_
to run on your own data (see how to :doc:`get started in your notebook <../get-started-in-your-notebook>`), 
or you can instead `run the Demo </docs/home/try-the-demo/>`_ to quickly try it out. The dataset used 
here is the same as in the Demo.

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
	>>> modelhub = ModelHub(time_aggregation='%Y-%m-%d', global_contexts=['root_location'])
	>>> # get an Objectiv DataFrame within a defined timeframe
	>>> df = modelhub.get_objectiv_dataframe(db_url=DB_URL, start_date=start_date, end_date=end_date)

The `location_stack` column, and the columns taken from the global contexts, contain most of the 
event-specific data. These columns are JSON typed, and we can extract data from it using the keys of the JSON 
objects with :doc:`SeriesLocationStack 
<../open-model-hub/api-reference/SeriesLocationStack/modelhub.SeriesLocationStack>` methods, or the `context` 
accessor for global context columns. See the :doc:`open taxonomy example <./open-taxonomy>` for how to use 
the `location_stack` and global contexts.

.. doctest:: product-analytics
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
Data collected with Objectiv's tracker is `well-structured & consistent <https://objectiv.io/docs/taxonomy>`_, which makes it ideal for various machine learning applications. Machine learning models can be applied directly without cleaning, transformations or using complex tooling.

In this example, we show how you can predict user behavior with the supported logistic regression model. Examples of predictions that you can create:

- Will a user convert?
- Will a user start using a specific product feature or area?
- Will a user have a long active session duration?

For simple demonstration purposes, we will predict if users on our own `website <https://www.objectiv.io>`_ will reach the `modeling section of our docs <https://objectiv.io/docs/modeling/>`_, by looking at interactions that users have with all the other main sections of our website.


We create a data set that counts the number of clicks per user in each section of our website. We obtain
the main sections by extracting the `root location
<https://objectiv.io/docs/taxonomy/reference/location-contexts/RootLocationContext/>`_ from the location
stack. It is similar data set to the one used in the `'Bach and sklearn'
<https://objectiv.io/docs/modeling/example-notebooks/machine-learning/>`_ example. Note that this is a small
and simple data set used just for demonstration purposes of the logistic regression functionality, and not so much the model results itself.

For the ins and outs on feature engineering see our :ref:`feature engineering example
<example_feature_engineering>`.

.. code-block:: python

    # extract the root location from the location stack
    df['root'] = df.location_stack.ls.get_from_context_with_type_series(type='RootLocationContext', key='id')

    # root series is later unstacked and its values might contain dashes
    # which are not allowed in BigQuery column names, lets replace them
    df['root'] = df['root'].str.replace('-', '_')

    # only look at press events and count the root locations
    features = df[(df.event_type=='PressEvent')].groupby('user_id').root.value_counts()
    # unstack the series, to create a DataFrame with the number of clicks per root location as columns
    features_unstacked = features.unstack(fill_value=0)

Sample the data
~~~~~~~~~~~~~~~
We take a 10% sample of the full data that we will use to train the model on. This limits data processing and speeds up the fitting procedure.

After the model is fitted, it can be used to predict the labels for the _entire_ data set.

.. code-block:: python

    # for BigQuery the table name should be 'YOUR_PROJECT.YOUR_WRITABLE_DATASET.YOUR_TABLE_NAME'
    features_set_sample = features_unstacked.get_sample('test_lr_sample', sample_percentage=10, overwrite=True)

Using a logistic regression we will predict whether a user clicked in the modeling section or not. We will predict this by the number of clicks in any of the other sections. `X` is a Bach DataFrame that contains the explanatory variables. `y` is a Bach SeriesBoolean with the labels we want to predict.

.. code-block:: python

    y_column = 'modeling'
    y = features_set_sample[y_column] > 0
    X = features_set_sample.drop(columns=[y_column])

Instantiating the logistic regression model
-------------------------------------------
We can instantiate the logistic regression model from the model hub. Since the model is based on sklearn's
version of LogisticRegression, it can be instantiated with any parameters that sklearn's LogisticRegression
`supports
<https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html>`_. In our
example we instantiate it with `fit_intercept=False`

.. code-block:: python

    lr = modelhub.get_logistic_regression(fit_intercept=False)

Fitting the model
-----------------
The `fit` method fits a model to the passed data. This method extracts the data from the database under the hood.

.. code-block:: python

    lr.fit(X, y)

Accuracy and predicting
-----------------------
All following operations are carried out directly on the database. Therefore, they can be exported to SQL statements so it can be used in for example your BI tooling.

.. code-block:: python

    lr.score(X, y)

The model has the same attributes as the Logistic Regression model from sklearn.

.. code-block:: python

    # show the coefficients of the fitted model
    lr.coef_

Create columns for the predicted values and labels in the sampled data set. Labels `True` if the probability is over .5.

.. code-block:: python

    features_set_sample['predicted_values'] = lr.predict_proba(X)
    features_set_sample['predicted_labels'] = lr.predict(X)

    # show the sampled data set, including predictions
    features_set_sample.head(20)

Unsample and view the SQL
-------------------------
The data can be unsampled and viewed as an SQL statement. `features_set_full` and the SQL statement for this DataFrame are for the full unsampled data set including the predicted values.

.. code-block:: python

    features_set_full = features_set_sample.get_unsampled()

Get the sql statement for the _full_ data set including the predicted values.

.. code-block:: python

    print(features_set_full.view_sql())

The SQL for any analysis can be exported with this one command, so you can use models in production directly 
to simplify data debugging & delivery to BI tools like Metabase, dbt, etc. See how you can `quickly create BI 
dashboards with this <https://objectiv.io/docs/home/try-the-demo#creating-bi-dashboards>`_.

This demonstrates the core functionality of the Logistic Regression model in the open model hub. Stay tuned 
for more metrics for assessing the fit of the model, as well as simplifying splitting the data into training 
and testing data sets.