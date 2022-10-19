/*
 * Copyright 2022 Objectiv B.V.
 */

import { NameUtility, TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '../writers/TypescriptWriter';
import { getEntities } from './parser';

const descriptionsType = 'text';
const descriptionsTarget = 'primary';

Generator.generateFromModel({ outputFile: '../generated/schema/abstracts.ts' }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  getEntities({ isAbstract: true, sortBy: 'name' }).forEach((entity) => {
    tsWriter.writeInterfaceBlock(
      {
        export: true,
        description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
        name: entity.name,
        extends: entity._parent ? [entity._parent] : undefined,
      },
      (tsWriter: TypeScriptWriter) => {
        if (!entity._parent && entity.isContext) {
          tsWriter.writeProperty({
            name: '__instance_id',
            typeName: 'string',
            description: ['An internal unique identifier used to compare instances of the same type.']
          });
        }

        if (entity._parent && entity.isParent && entity.isContext) {
          tsWriter.writeProperty({
            name: `__${NameUtility.camelToKebabCase(entity.name).replace(/-/g, '_').replace('abstract_', '')}`,
            typeName: 'true',
            description: ['An internal discriminator relating entities of the same hierarchical branch.']
          });
        }

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
    LocationStack: 'Array<AbstractLocationContext>',
    GlobalContexts: 'Array<AbstractGlobalContext>',
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
