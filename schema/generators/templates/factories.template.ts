/*
 * Copyright 2022 Objectiv B.V.
 */

import { NameUtility, TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { TypeScriptWriter } from '../writers/TypeScriptWriter';
import { getContexts, getEvents } from './parser';

// TODO temporarily generate this in the /generated folder, as we need TS to be finished before we can use it
//const destinationFolder = '../../../tracker/core/tracker/src/generated/';
const destinationFolder = '../generated/';

const descriptionsType = 'text';
const descriptionsTarget = 'primary';

const nonAbstractContexts = getContexts({ isAbstract: false });
const nonAbstractEvents = getEvents({ isAbstract: false });

const schemaVersion = Objectiv.version.base_schema;

const SchemaToTypeScriptPropertyTypeMap = {
  integer: 'number',
  literal: 'string',
  string: 'string',
  discriminator: 'string',
  uuid: 'string',
  array: 'Array',
};

export type PropertyDefinition = {
  name: string;
  isOptional?: boolean;
  value?: string;
};

Generator.generate({ outputFile: `${destinationFolder}/ContextFactories.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  tsWriter.writeMultiLineImports(
    '@objectiv/schema',
    nonAbstractContexts.map(({ name }) => name)
  );
  tsWriter.writeImports('./ContextNames', ['AbstractContextName', 'GlobalContextName', 'LocationContextName']);
  tsWriter.writeImports('../helpers', ['generateGUID']);
  tsWriter.writeEndOfLine();

  nonAbstractContexts.forEach((context) => {
    tsWriter.writeES6FunctionBlock(
      {
        export: true,
        description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
        name: `make${context.name}`,
        returnTypeName: context.name,
        multiLineSignature: true,
        parameters: getParametersFromProperties(context),
      },
      (tsWriter: TypeScriptWriter) => {
        tsWriter.writeLine('({');

        writeObjectProperty(tsWriter, context, {
          name: '__instance_id',
          value: 'generateGUID()',
        });

        if (context.isParent) {
          writeObjectProperty(tsWriter, context, {
            name: `__${NameUtility.camelToKebabCase(context.name).replace(/-/g, '_')}`,
            value: 'true',
          });
        }

        context.parents.forEach((parent) => {
          if (!parent.isAbstract) {
            writeObjectProperty(tsWriter, context, {
              name: `__${NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
              value: 'true',
            });
          }
        });

        if (context.isLocationContext) {
          writeObjectProperty(tsWriter, context, {
            name: '__location_context',
            value: 'true',
          });
        }

        if (context.isGlobalContext) {
          writeObjectProperty(tsWriter, context, {
            name: '__global_context',
            value: 'true',
          });
        }

        context.properties
          .map((property) => ({
            name: property.name,
            isOptional: property.optional,
            value: property.value,
          }))
          .forEach((property) => writeObjectProperty(tsWriter, context, property));

        tsWriter.writeLine('});');
      }
    );

    tsWriter.writeLine();
  });

  tsWriter.writeJsDocLines([`A factory to generate any Context.`]);
  writeEntityFactory(tsWriter, 'makeContext', nonAbstractContexts);
});

Generator.generate({ outputFile: `${destinationFolder}/EventFactories.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  tsWriter.writeMultiLineImports(
    '@objectiv/schema',
    [...nonAbstractEvents.map(({ name }) => name), 'LocationStack', 'GlobalContexts'].sort()
  );
  tsWriter.writeImports('./EventNames', ['AbstractEventName', 'EventName']);
  tsWriter.writeImports('../helpers', ['generateGUID']);
  tsWriter.writeEndOfLine();

  nonAbstractEvents.forEach((event) => {
    tsWriter.writeES6FunctionBlock(
      {
        export: true,
        description: event.getDescription({ type: descriptionsType, target: descriptionsTarget }),
        name: `make${event.name}`,
        returnTypeName: event.name,
        multiLineSignature: true,
        parameters: getParametersFromProperties(event),
      },
      (tsWriter: TypeScriptWriter) => {
        tsWriter.writeLine('({');

        writeObjectProperty(tsWriter, event, {
          name: '__instance_id',
          value: 'generateGUID()',
        });

        if (event.isParent) {
          writeObjectProperty(tsWriter, event, {
            name: `__${NameUtility.camelToKebabCase(event.name).replace(/-/g, '_')}`,
            value: 'true',
          });
        }

        event.parents.forEach((parent) => {
          if (!parent.isAbstract) {
            writeObjectProperty(tsWriter, event, {
              name: `__${NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
              value: 'true',
            });
          }
        });

        event.properties
          .map((property) => ({
            name: property.name,
            isOptional: property.optional,
            value: property.value,
          }))
          .forEach((property) => writeObjectProperty(tsWriter, event, property));

        tsWriter.writeLine('});');
      }
    );

    tsWriter.writeLine();
  });

  writeEntityFactory(tsWriter, 'Event', nonAbstractEvents);
});

const getParametersFromProperties = (entity) =>
  entity.properties.reduce((parameters, property) => {
    if (property?.internal) {
      return parameters;
    }

    parameters.push({
      name: property.name,
      description: property.description,
      typeName: getTypeForProperty(property),
      isOptional: property.optional,
      value: property.value,
    });

    return parameters;
  }, []);

const writeEntityFactory = (tsWriter: TypeScriptWriter, factoryName, entities) => {
  entities.forEach((entity) => {
    tsWriter.write(`export function ${factoryName} (`);
    tsWriter.writeProps({
      propsName: 'props',
      parameters: [
        {
          name: '_type',
          typeName: `'${entity.name}'`,
        },
        ...getParametersFromProperties(entity),
      ],
    });
    tsWriter.writeLine(`): ${entity.name};`);
    tsWriter.writeEndOfLine(``);
  });
  tsWriter.writeLine(`export function ${factoryName} ({ _type, ...props }: any) {`);
  tsWriter.increaseIndent();
  tsWriter.writeLine(`switch(_type) {`);
  entities.forEach((entity) => {
    tsWriter.writeLine(`${tsWriter.indentString}case '${entity.name}':`);
    tsWriter.writeLine(`${tsWriter.indentString.repeat(2)}return make${entity.name}(props);`);
  });
  tsWriter.writeLine(`}`);
  tsWriter.decreaseIndent();
  tsWriter.writeLine(`}`);
};

const getTypeForProperty = (property) => {
  const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
  const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
  return `${mappedType ?? property.type}${mappedSubType ? `<${mappedSubType}>` : ''}`;
};

const mapInternalTypeToEnum = (entity) => {
  if (entity.isAbstract) {
    if (entity.isContext) {
      return `AbstractContextName.${entity.name}`;
    }

    if (entity.isEvent) {
      return `AbstractEventName.${entity.name}`;
    }
  }

  if (entity.isLocationContext) {
    return `LocationContextName.${entity.name}`;
  }

  if (entity.isGlobalContext) {
    return `GlobalContextName.${entity.name}`;
  }

  if (entity.isEvent) {
    return `EventName.${entity.name}`;
  }
};

const writeObjectProperty = (tsWriter: TypeScriptWriter, entity, property: PropertyDefinition) => {
  tsWriter.increaseIndent();

  tsWriter.writeIndent();

  tsWriter.write(`${property.name}`);

  let propertyValue;

  switch (property.name) {
    case '_type':
      propertyValue = mapInternalTypeToEnum(entity);
      break;
    case '_types':
      const indent = tsWriter.indentString;
      const doubleIndent = indent.repeat(2);
      const _types = [...entity.parents, entity].map(mapInternalTypeToEnum);
      propertyValue = `[\n${doubleIndent}${_types.join(`,\n${doubleIndent}`)}\n${indent}]`;
      break;
    case '_schema_version':
      propertyValue = `'${schemaVersion}'`;
      break;
    default:
      propertyValue = property.value ?? `props.${property.name}`;
  }

  tsWriter.write(`: ${propertyValue}`);

  if (property.isOptional) {
    tsWriter.write(' ?? null');
  }

  tsWriter.writeEndOfLine(',');
  tsWriter.decreaseIndent();
};
