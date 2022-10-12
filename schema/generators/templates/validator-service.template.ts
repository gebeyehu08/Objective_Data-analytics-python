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

const validate = (event) => {
  const { validator, validatorVersion } = getValidatorForSchemaVersion(event['schema_version']);

  const result = validator.validate(event);

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
