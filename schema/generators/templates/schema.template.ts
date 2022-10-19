/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '../writers/TypescriptWriter';
import { getEntities } from './parser';

const descriptionsType = 'text';
const descriptionsTarget = 'primary';

Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  getEntities({ isAbstract: true, sortBy: 'name', include: ['LocationStack', 'GlobalContexts'] }).forEach((entity) => {
    tsWriter.writeInterfaceBlock(
      {
        export: true,
        description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
        name: entity.name,
        extends: entity._parent ? [entity._parent] : undefined,
      },
      (tsWriter: TypeScriptWriter) => {
        entity.ownProperties.forEach((property) =>
          tsWriter.writeProperty(schemaToTypeScriptProperty(entity, property))
        );
      }
    );
    tsWriter.writeEndOfLine();
  });
});

const schemaToTypeScriptProperty = (entity, property) => {
  const typesMap = {
    integer: 'number',
    string: 'string',
    uuid: 'string',
    array: 'Array',
    LocationStack: 'LocationStack',
    GlobalContexts: 'GlobalContexts',
  };

  let mappedType;
  switch (property.type) {
    case 'discriminator':
      if (entity.isAbstract) {
        mappedType = `${entity.children.map(({ name }) => `'${name}'`).join(' | ')}`;
      } else {
        mappedType = `'${entity.name}'`;
      }
      break;
    case 'array':
      mappedType = `Array<${property.value}>`;
      break;
    default:
      mappedType = typesMap[property.type];
  }

  return {
    name: property.name,
    description: property.description.split('\n'),
    typeName: mappedType,
    isOptional: property.optional,
    hasNullUnionType: property.nullable,
  };
};
