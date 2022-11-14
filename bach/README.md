# Objectiv Bach: Pandas-like analytics modeling translated to SQL

Bach is a Python-based analytics modeling library with a Pandas-like interface. It translates all operations and models to SQL, running directly on your full dataset. All DataFrames & models can be converted to an SQL statement with just a single command, to use in other tools like dbt or BI.

Bach is part of [Objectiv](https://objectiv.io/), an open-source data collection & modeling platform that helps data teams run product analytics from their notebooks. Bach therefore works with any dataset that embraces Objectiv's [open analytics taxonomy](https://objectiv.io/docs/taxonomy/), so you can take pre-built models from the [open model hub](https://objectiv.io/docs/modeling/open-model-hub/) to quickly build deep analyses for a wide range of product & marketing use cases.


## Installation
To install Bach, use the following command:
```bash
pip install objectiv-bach           # just the Bach library, supports PostgreSQL out of the box
pip install objectiv-bach[bigquery] # for Google BigQuery support
pip install objectiv-bach[athena]   # for AWS Athena support
```

See how to [get started in your notebook](https://objectiv.io/docs/modeling/get-started-in-your-notebook/) for detailed installation instructions.

## Usage
* [Example notebooks with instructions](https://objectiv.io/docs/modeling/example-notebooks/)
* [Bach API reference](https://objectiv.io/docs/modeling/bach/api-reference/) 

## Support
* [Visit Objectiv Docs for instructions & FAQs](https://objectiv.io/docs/)
* [Join Objectiv on Slack to get help](https://objectiv.io/join-slack/)
* [Request a feature or report an issue on Github](https://github.com/objectiv/objectiv-analytics)

**Found a security issue?**
Please don’t use the issue tracker but contact us directly. See [SECURITY.md](../SECURITY.md) for details.

## Contributing

If you want to contribute to Objectiv Bach or use it as a base for custom development, take a look at [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development instructions. For more unformation about our contribution process and where you can fit in, check out our [Contribution Guide](https://objectiv.io/docs/home/the-project/contribute) in the Docs.

## License

This repository is part of the source code for Objectiv, which is released under the Apache 2.0 License. Please refer to [LICENSE.md](../LICENSE.md) for details.

---

Copyright (c) 2021-2022 Objectiv B.V. All rights reserved.
