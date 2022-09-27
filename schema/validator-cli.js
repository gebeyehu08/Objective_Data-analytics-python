#!/usr/bin/env node

/*
 * Copyright 2022 Objectiv B.V.
 */

const { validate } = require('./dist/validator.js');

const [event] = require('yargs/yargs')(process.argv.slice(2)).usage('Usage: $0 <event JSON string>').demandCommand(1)
  .argv._;

const { success, error } = validate(JSON.parse(event));

if (!success) {
  console.log(error);
  console.log('\nNOPE: The given event is not valid\n');
  process.exit(1);
}

console.log('\nOK: The given event is valid\n');
process.exit(0);
