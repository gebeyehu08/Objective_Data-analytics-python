/*
 * Copyright 2022 Objectiv B.V.
 */

import { NameUtility, TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '../writers/TypeScriptWriter';
import { getContexts, getEntities, getEvents } from './parser';

const descriptionsType = 'text';
const descriptionsTarget = 'primary';

Generator.generate({ outputFile: '../generated/schema/abstracts.ts' }, (writer: TextWriter) => {
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
            description: ['An internal unique identifier used to compare instances with the same _type & id.'],
          });
        }

        if (entity._parent && entity.isParent && entity.isContext) {
          tsWriter.writeProperty({
            name: `__${NameUtility.camelToKebabCase(entity.name).replace(/-/g, '_').replace('abstract_', '')}`,
            typeName: 'true',
            description: ['An internal discriminator relating entities of the same hierarchical branch.'],
          });
        }

        entity.ownProperties.forEach((property) =>
          tsWriter.writeProperty(schemaToTypeScriptProperty(tsWriter, entity, property))
        );
      }
    );
    tsWriter.writeEndOfLine();
  });
});

Generator.generate({ outputFile: '../generated/schema/events.ts' }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  tsWriter.writeImports('./abstracts', ['AbstractEvent', 'AbstractLocationContext']);

  getEvents({ isAbstract: false, sortBy: 'name' }).forEach((entity) => {
    tsWriter.writeInterfaceBlock(
      {
        export: true,
        description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
        name: entity.name,
        extends: entity._parent ? [entity._parent] : undefined,
      },
      (tsWriter: TypeScriptWriter) => {
        tsWriter.writeProperty(
          schemaToTypeScriptProperty(tsWriter, entity, {
            name: `_type`,
            type: 'discriminator',
            description: 'A string literal used during serialization. Hardcoded to the Event name.',
          })
        );

        if (entity._parent && entity.isParent) {
          tsWriter.writeProperty({
            name: `__${NameUtility.camelToKebabCase(entity.name).replace(/-/g, '_').replace('abstract_', '')}`,
            typeName: 'true',
            description: ['An internal discriminator relating entities of the same hierarchical branch.'],
          });
        }

        entity.ownProperties.forEach((property) =>
          tsWriter.writeProperty(schemaToTypeScriptProperty(tsWriter, entity, property))
        );
      }
    );
    tsWriter.writeEndOfLine();
  });
});

Generator.generate({ outputFile: '../generated/schema/contexts.ts' }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  tsWriter.writeImports('./abstracts', ['AbstractGlobalContext', 'AbstractLocationContext']);

  getContexts({ isAbstract: false, sortBy: 'name' }).forEach((entity) => {
    tsWriter.writeInterfaceBlock(
      {
        export: true,
        description: entity.getDescription({ type: descriptionsType, target: descriptionsTarget }).split('\n'),
        name: entity.name,
        extends: entity._parent ? [entity._parent] : undefined,
      },
      (tsWriter: TypeScriptWriter) => {
        tsWriter.writeProperty(
          schemaToTypeScriptProperty(tsWriter, entity, {
            name: `_type`,
            type: 'discriminator',
            description: 'A string literal used during serialization. Hardcoded to the Context name.',
          })
        );

        if (entity._parent && entity.isParent) {
          tsWriter.writeProperty({
            name: `__${NameUtility.camelToKebabCase(entity.name).replace(/-/g, '_').replace('abstract_', '')}`,
            typeName: 'true',
            description: ['An internal discriminator relating entities of the same hierarchical branch.'],
          });
        }

        entity.ownProperties.forEach((property) =>
          tsWriter.writeProperty(schemaToTypeScriptProperty(tsWriter, entity, property))
        );
      }
    );
    tsWriter.writeEndOfLine();
  });
});

const schemaToTypeScriptProperty = (tsWriter, entity, property) => {
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
      if (entity.isParent) {
        const entityNames = entity.children.map(({ name }) => `'${name}'`);
        const indent = tsWriter.indentString.repeat(2);
        if (!entity.isAbstract) {
          entityNames.unshift(`'${entity.name}'`);
        }
        mappedType = `\n${indent}| ${entityNames.join(`\n${indent}| `)}`;
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
