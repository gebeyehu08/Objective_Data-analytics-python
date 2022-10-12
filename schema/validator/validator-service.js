/*
 * Copyright 2022 Objectiv B.V.
 */

const express = require('express');
const { getLatestValidatorVersion, getValidatorForSchemaVersion } = require('./common');

let port = '8082';
let valid = {};
let invalid = {};
let total = {};

var app = express();
app.use(express.json());

if (process.env.PORT) {
  port = process.env.PORT;
}
app.listen(port, () => {
  console.log(`Objectiv Validation Service v${getLatestValidatorVersion()} ready on port ${port}`);
});

app.post('/', (req, res) => {
  if (!req.body) {
    res.json({
      success: false,
      error: 'Please provide the Event to validate as JSON',
    });
  } else {
    res.json(validate(req.body));
  }
});

app.get('/status', (req, res) => {
  res.json({
    total,
    valid,
    invalid,
    version: getLatestValidatorVersion(),
  });
});

app.get('/schema', (req, res) => {
  res.send(`Please specify a Schema version, e.g. /schema/latest or /schema/1.0.0`);
});

app.get('/schema/:version', (req, res) => {
  const { schemaPath } = getValidatorForSchemaVersion(req.params.version);

  res.sendFile(`${__dirname}/${schemaPath}`);
});

const validate = (event) => {
  const { validatorPath, validatorVersion } = getValidatorForSchemaVersion(event['schema_version']);
  const { validate } = require(`${__dirname}/${validatorPath}`);

  const result = validate(event);

  total[validatorVersion] === undefined && (total[validatorVersion] = 0);
  valid[validatorVersion] === undefined && (valid[validatorVersion] = 0);
  invalid[validatorVersion] === undefined && (invalid[validatorVersion] = 0);

  total[validatorVersion]++;
  result.success ? valid[validatorVersion]++ : invalid[validatorVersion]++;

  return {
    ...result,
    validator_version: validatorVersion,
  };
};
