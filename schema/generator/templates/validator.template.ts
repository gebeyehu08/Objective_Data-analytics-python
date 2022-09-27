/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { ValidatorWriter } from '../writers/ValidatorWriter';
import { getObjectKeys, writeEnumerations } from './common';

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

    const getEntityProperties = (entity) => entity['properties'] ?? {};
    const getEntityParents = (entity) => entity['parents'] ?? [];
    const getEntityRequiresContext = (entity) => entity['requiresContext'] ?? [];

    // recursive helper to fetch parent attributes
    const getParentAttributes = (parents, attributes = { properties: {} }) =>
      parents.reduce((parentAttributes, parent) => {
        const parentProperties = getEntityProperties(model.contexts[parent]);
        const parentParents = getEntityParents(model.contexts[parent]);

        const parentPropertyKeys = getObjectKeys(parentProperties);
        parentPropertyKeys.forEach((parentPropertyKey) => {
          const parentProperty = parentProperties[parentPropertyKey];
          if (parentAttributes.properties[parentPropertyKey] === undefined) {
            parentAttributes.properties[parentPropertyKey] = parentProperty;
          }
        });

        if (!parentParents.length) {
          return parentAttributes;
        }

        return getParentAttributes(parentParents, parentAttributes);
      }, attributes);

    const getEntityAttributes = (entity) => {
      const parents = getEntityParents(entity);
      const properties = getEntityProperties(entity);

      return getParentAttributes(parents, { properties });
    };

    getObjectKeys(model.contexts)
      .filter((entityName) => !entityName.startsWith('Abstract'))
      .forEach((entityName) => {
        const { properties } = getEntityAttributes(model.contexts[entityName]);

        console.log(properties);

        validator.writeLine(`export const ${entityName} = z.object({`);

        getObjectKeys(properties).forEach((property) => {
          validator.writeProperty({
            name: String(property),
            typeName: SchemaToZodPropertyTypeMap[properties[property].type],
            isOptional: properties[property].isOptional,
            value: (properties[property].value ?? '').replace('${entityName}', entityName),
          });
        });

        validator.writeLine(`});\n`);
      });
  }
);
