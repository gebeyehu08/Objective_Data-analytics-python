/*
 * Copyright 2022 Objectiv B.V.
 */

import { z } from 'zod';
import Objectiv from '../../base_schema.json';
import { Generator } from '@yellicode/templating';
import { TextWriter } from '@yellicode/core';
import { ZodWriter } from '../writers/ZodWriter';
import { getContexts, getProperties, getObjectKeys, writeEnumerations } from './common';

Generator.generateFromModel(
  { outputFile: '../generated/validator.js' },
  (writer: TextWriter, model: typeof Objectiv) => {
    const zodWriter = new ZodWriter(writer);

    writeEnumerations(zodWriter);

    getContexts().forEach((contextName) => {
      const properties = getProperties(model.contexts, contextName);

      zodWriter.writeObject({
        name: contextName,
        properties: getObjectKeys(properties).map((property) => ({
          name: String(property),
          typeName: properties[property].type,
          isOptional: properties[property].optional,
          value: properties[property].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
        })),
      });
    });
  }
);
