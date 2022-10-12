/*
 * Copyright 2022 Objectiv B.V.
 */

const versions = [];

const getLatestValidatorVersion = () => {
  const [latestVersion] = versions.sort().reverse();

  return latestVersion;
};

const getValidatorForSchemaVersion = (schemaVersion) => {
  const requestedVersion = schemaVersion ?? '1.0.0';
  const validatorVersion = versions.find((version) => version === requestedVersion) ?? getLatestValidatorVersion();
  const validatorPath = `./${validatorVersion}/validator.js`;
  const schemaPath = `./${validatorVersion}/base_schema.json`;

  return {
    validatorPath,
    validatorVersion,
    schemaPath,
  };
};

exports.getLatestValidatorVersion = getLatestValidatorVersion;
exports.getValidatorForSchemaVersion = getValidatorForSchemaVersion;

versions.push('1.0.0');
