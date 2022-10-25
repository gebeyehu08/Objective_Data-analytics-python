# Contributing to the open model hub


Thank you for considering contributing to the open model hub. Please first take a look at the [Contribution Guide](https://objectiv.io/docs/home/the-project/contribute) in our Docs if you haven’t already. It contains information about our contribution process and where you can fit in.


## Set up development environment


```
virtualenv venv
source venv/bin/activate
export PYTHONPATH=.

# Install both Bach and ModelHub in local 'edit' mode
pip install -e ../bach
pip install -e .[dev]
# The above will fail if the postgres lib development headers are not present. On Ubuntu that can be fixed
# with: sudo apt-get install libpq-dev
```

### PyCharm

* Mark the following directories as "Sources root":
    1. `/bach/`
    2. `/modelhub/`
* Set `modelhub/venv/bin/python` as the default interpreter for the project

## Support
* [Visit Objectiv Docs for instructions & FAQs](https://objectiv.io/docs/)
* [Join Objectiv on Slack to get help](https://objectiv.io/join-slack/)
* [Request a feature or report an issue on Github](https://github.com/objectiv/objectiv-analytics)

**Found a security issue?**
Please don’t use the issue tracker but contact us directly. See [SECURITY.md](../SECURITY.md) for details.

## License

This repository is part of the source code for Objectiv, which is released under the Apache 2.0 License. Please refer to [LICENSE.md](../LICENSE.md) for details.

---

Copyright (c) 2021-2022 Objectiv B.V. All rights reserved.