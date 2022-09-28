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
  discriminator: 'literal',
};

Generator.generateFromModel(
  { outputFile: '../generated/validator.js' },
  (writer: TextWriter, model: typeof Objectiv) => {
    const validatorWriter = new ValidatorWriter(writer);

    writeEnumerations(validatorWriter);

    // TODO see if we can generalize this function
    getContexts().forEach((contextName) => {
      const { properties } = getEntityAttributes(model.contexts, contextName);

      validatorWriter.writeLine(`export const ${contextName} = z.object({`);

      getObjectKeys(properties).forEach((property) => {
        validatorWriter.writeProperty({
          name: String(property),
          typeName: SchemaToZodPropertyTypeMap[properties[property].type],
          isOptional: properties[property].optional,
          value: properties[property].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
        });
      });

      validatorWriter.writeLine(`});\n`);
    });
  }
);
