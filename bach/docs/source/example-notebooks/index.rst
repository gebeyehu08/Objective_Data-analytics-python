.. _example_notebooks:

.. frontmatterposition:: 5

=================
Example notebooks
=================

This section contains several example notebooks to demonstrate how you can use Objectiv to build & run 
product analytics models, and make the output actionable for the wider team.

.. image:: ../img/docs/example-notebooks/open-model-hub.png
  :alt: Open model hub

The notebooks all use the :ref:`open model hub <open_model_hub>`: a toolkit that contains pre-built product 
analytics models and functions that can be applied on data collected with :ref:`Objectiv’s Tracker <../../tracking>`. 
The open model hub is powered by :ref:`Bach <../bach>`, our python-based modeling library with a pandas-like interface, 
that translates all operations to SQL under the hood.

1. Check out the example notebooks
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Get an impression of what you can do with Objectiv:
.. toctree::
    :maxdepth: 1

    product-analytics
    marketing-analytics
    funnel-discovery
    logistic-regression
    feature-importance
    user-intent
    explore-data
    open-taxonomy
    modelhub-basics
    feature-engineering
    machine-learning

2. Play with the notebooks in the demo
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Spin up a fully functional :ref:`Objectiv demo pipeline <../../home/try-the-demo>` in under 5 minutes, 
and play with the example notebooks yourself.

3. Use the notebooks with your own data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can use the notebooks on any dataset that was collected with Objectiv’s tracker, so feel free to use 
them to bootstrap your own projects. They are available as Jupyter notebooks on our 
:ref:`GitHub repository <https://github.com/objectiv/objectiv-analytics/tree/main/notebooks>`.

Instructions to set up the Objectiv tracker can be found :ref:`here <../../tracker>`.