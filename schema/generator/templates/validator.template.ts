/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { ValidatorWriter } from '../writers/ValidatorWriter';
import { getContexts, getEntityAttributes, getObjectKeys, writeEnumerations } from './common';

const SchemaToZodPropertyTypeMap = {
  integer: 'bigint',
  literal: 'literal',
  string: 'string',
};

Generator.generateFromModel(
  { outputFile: '../generated/validator.js' },
  (writer: TextWriter, model: typeof Objectiv) => {
    const validator = new ValidatorWriter(writer);

    writeEnumerations(validator);

    // TODO see if we can generalize this function, passing type map and replacements map to it (both optional)
    getContexts().forEach((contextName) => {
      const { properties } = getEntityAttributes(model.contexts, contextName);

      validator.writeLine(`export const ${contextName} = z.object({`);

      getObjectKeys(properties).forEach((property) => {
        validator.writeProperty({
          name: String(property),
          typeName: SchemaToZodPropertyTypeMap[properties[property].type],
          isOptional: properties[property].isOptional,
          value: (properties[property].value ?? '').replace('${contextName}', `ContextTypes.enum.${contextName}`),
        });
      });

      validator.writeLine(`});\n`);
    });
  }
);
