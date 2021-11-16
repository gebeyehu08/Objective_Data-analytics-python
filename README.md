Go to [Objectiv Docs](https://objectiv.io/docs/) for detailed installation & usage instructions

![Objectiv Logo](https://objectiv.io/docs/img/logo-objectiv-large.svg "Objectiv Logo")

Objectiv is a data collection & modeling library that puts the data scientist first. It is built around 
[the open taxonomy of analytics](https://objectiv.io/docs/taxonomy), which is our proposal for a common way to collect, 
structure and validate data. With Objectiv, you create a 
[contextual layer for your application](https://objectiv.io/docs/tracking/core-concepts/tagging) by mapping it to the taxonomy, 
with the goal of collecting better data and more effective modeling.

Check out [objectiv.io](https://www.objectiv.io) to learn more.

- - -

## Play with Objectiv
We’ve set up a [Live Demo Notebook](https://notebook.objectiv.io/lab?path=product_analytics.ipynb)  with real data from [objectiv.io](https://www.objectiv.io) for you to 
play with. Give it a try and see what Objectiv can do.

## Running Objectiv locally - Quickstart 
In order to run Objectiv for local development, we'll help you set up the following components:

* The **Objectiv Tracker** to track user behavior from your website or web application. 
* The **Objectiv Collector** and a **PostgreSQL data store** to collect, validate & store event data from the tracker.
* A **Notebook** with the **Objectiv Bach** modeling library to explore and model your data.  

![Objectiv Pipeline](https://objectiv.io/docs/img/objectiv-pipeline.svg "Objectiv Pipeline")


To get the latest stable build, run the following commands:
```bash
git clone git@github.com:objectiv/objectiv-analytics.git
cd objectiv-analytics
docker-compose pull  # pull pre-built images from gcr
```

Now, let's get started.

### 1. Spin up the Collector & PostgreSQL
Run the following command:
```bash
docker-compose up objectiv_collector
```
This will spin up the Collector backend and a PostgresQL data store, creating an endpoint for the tracker to send data to.


**Security Warning:** The above `docker-compose` command starts a postgres container that allows connections
without verifying passwords. Do not use this in production or on a shared system!

### 2. Instrument the Tracker
The Tracker is available for multiple platforms. Follow one of the [step-by-step Tracking How-to Guides](https://www.objectiv.io/docs/how-to-guides) for your preferred platform to continue. 

### 3. Spin up a Notebook with Objectiv Bach
Run the following command: 
```bash
docker-compose up objectiv_notebook
```
This will spin up a notebook with the Objectiv Bach modeling library that enables you to analyze the data that you've collected. Check out the [Objectiv Docs modeling section](https://www.objectiv.io/docs/tracking//modeling) for detailed instructions on using Objectiv Bach.

---

## Running Objectiv in production
A detailed How-to guide is coming soon. 
