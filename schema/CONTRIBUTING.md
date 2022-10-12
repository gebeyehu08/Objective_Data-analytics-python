# Open analytics taxonomy - Schema

Here you'll find instructions for development on the open analytics taxonomy. 
If you want to contribute (Thank you!), please take a look at the [Contribution Guide](https://www.objectiv.io/docs/home/the-project/contribute) in our Docs. 
It contains information about our contribution process and where you can fit in.

## Main architecture
Objectiv Analytics Taxonomy schema resides in the [base_schema.json](base_schema.json) file.

A set of generators is present in the [/generators](generators). These ingest the base schema to automatically generate all necessary code to support the new schema.

The [/validator](validator) folder contains a mix of static and generated code, including a validation service and CLI. 

There is a validator for each schema version in a sub-folder named after the schema version itself. E.g. `validator/1.0.0`. 

When the base schema changes version, a new folder is created automatically.

The validator service and CLI will automatically validate Events against their correct schema.


## Quick start

### Run generators
To run the generators, from either the [/validator](validator) or [/generators](generators) folder, execute:
```
yarn generate
```  

If the schema was changed, a new validator version will be generated alongside all necessary updates to the SDKs and the Collector to support it.

> NOTE: Services need to be restarted, after the generation process has completed, to be aware and support a new version.

### Run validation service
The validation service can be started by going into the [/validator](validator) folder and executing:
```
yarn serve
```

This will spawn a service on port 8082. 
> NOTE: The service port can be configured via .env, by changing the `port` variable. 

### Validate using the CLI
A CLI to run the validator module can be used by going into the [/validator](validator) folder and executing:
```
yarn cli <event json as string>
```

## Generators
We use [Yellicode](https://www.yellicode.com/introduction) for code generation.  

Here is a list of the generators we plan to support, some are not yet finished at this point:
- Validator module
- TypeScript Schema for the SDKs
- Core Tracker SDK factories
- Python classes and factories for the Collector
- Iglu schema for Snowplow
- Taxonomy documentation 

In a nutshell, the base_schema is our source of truth and all generators parse it to produce new factories, validation code, types, definitions, etc.

## Validation

The [/validator](validator) folder contains:

- A folder for each validator version, the folder names matches the schema version it supports.
- common.js, a common module with generic logic to retrieve specific validator module versions.
- validator-cli.js  (command `yarn cli`) a basic CLI that, given an event in its json string format, validates it against the correct validator.
- validator-playground.js contains some manual testing code for checking validation rules, can be run by executing `node validator-playground.js` and should not output anything if there are no errors.
- validator-service.js contains a service that can be used to validate events. See below for more details on how to use it.

### Validator service

Has three endpoints:

- POST /, validates the given event (posted as JSON body), can return two different objects:
  - On success: `{ success: true, data: <original event>, validator_version }`.
  - On failure: `{ success: false, error: <zod error>, validator_version }`.
  
- GET /status, returns some info on the service:
  - the validation version (which matches with the supported schema version).
  - a `total` object containing a per-version total of events processed.
  - a `valid` object containing a per-version total of valid events processed.
  - a `invalid` object containing a per-version total of invalid events processed.

- GET /schema/<version>, returns the base schema for the given version
