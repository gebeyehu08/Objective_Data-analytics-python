#!/usr/bin/env node

/*
 * Copyright 2022 Objectiv B.V.
 */

const { getValidatorForSchemaVersion } = require('./common');
const yargs = require('yargs/yargs');

const [eventJson] = yargs(process.argv.slice(2)).usage('Usage: $0 <event JSON string>').demandCommand(1).argv._;
const event = JSON.parse(eventJson);

const { validatorPath, validatorVersion } = getValidatorForSchemaVersion(event['schema_version']);
const { validate } = require(`${__dirname}/${validatorPath}`);

const { success, error } = validate(event);

if (!success) {
  console.log(error);
  console.log(`\nNOPE: The given event is not valid (validator v${validatorVersion})\n`);
  process.exit(1);
}

console.log(`\nOK: The given event is valid (validator v${validatorVersion})\n`);
process.exit(0);
