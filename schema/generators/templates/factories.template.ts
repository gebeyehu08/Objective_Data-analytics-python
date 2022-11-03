/*
 * Copyright 2022 Objectiv B.V.
 */

import { NameUtility, TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { TypeScriptWriter } from '../writers/TypeScriptWriter';
import { getContexts, getEvents } from './parser';

const destinationFolder = '../../../tracker/core/schema/src/generated/';

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
  isNullable?: boolean;
  value?: string;
};

Generator.generate({ outputFile: `${destinationFolder}factories.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  tsWriter.writeMultiLineImports('./contexts', nonAbstractContexts.map(({ name }) => name));
  tsWriter.writeMultiLineImports('./events', nonAbstractEvents.map(({ name }) => name));
  tsWriter.writeMultiLineImports('./types', ['LocationStack', 'GlobalContexts'].sort());
  tsWriter.writeImports('./names', [
    'AbstractContextName',
    'AbstractEventName',
    'EventName',
    'GlobalContextName',
    'LocationContextName'
  ]);
  tsWriter.writeImports('../uuidv4', ['uuidv4']);
  tsWriter.writeEndOfLine();

  nonAbstractContexts.forEach((context) => {
    const parameters = getParametersFromProperties(context);
    const optionalsCount = parameters.filter(parameter => parameter.isOptional).length;
    const areAllPropsOptional = optionalsCount === parameters.length;

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
          value: 'uuidv4()',
        }, areAllPropsOptional);

        if (context.isParent) {
          writeObjectProperty(tsWriter, context, {
            name: `__${NameUtility.camelToKebabCase(context.name).replace(/-/g, '_')}`,
            value: 'true',
          }, areAllPropsOptional);
        }

        context.parents.forEach((parent) => {
          if (!parent.isAbstract) {
            writeObjectProperty(tsWriter, context, {
              name: `__${NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
              value: 'true',
            }, areAllPropsOptional);
          }
        });

        if (context.isLocationContext) {
          writeObjectProperty(tsWriter, context, {
            name: '__location_context',
            value: 'true',
          }, areAllPropsOptional);
        }

        if (context.isGlobalContext) {
          writeObjectProperty(tsWriter, context, {
            name: '__global_context',
            value: 'true',
          }, areAllPropsOptional);
        }

        context.properties
          .map((property) => ({
            name: property.name,
            isOptional: property.optional,
            isNullable: property.nullable,
            value: property.value,
          }))
          .forEach((property) => writeObjectProperty(tsWriter, context, property, areAllPropsOptional));

        tsWriter.writeLine('});');
      }
    );

    tsWriter.writeLine();
  });

  tsWriter.writeJsDocLines([`A factory to generate any Context.`]);
  writeEntityFactory(tsWriter, 'makeContext', nonAbstractContexts);

  tsWriter.writeEndOfLine();

  nonAbstractEvents.forEach((event) => {
    const parameters = getParametersFromProperties(event);
    const optionalsCount = parameters.filter(parameter => parameter.isOptional).length;
    const areAllPropsOptional = optionalsCount === parameters.length;

    tsWriter.writeES6FunctionBlock(
      {
        export: true,
        description: event.getDescription({ type: descriptionsType, target: descriptionsTarget }),
        name: `make${event.name}`,
        returnTypeName: event.name,
        multiLineSignature: true,
        parameters,
      },
      (tsWriter: TypeScriptWriter) => {
        tsWriter.writeLine('({');

        writeObjectProperty(tsWriter, event, {
          name: '__instance_id',
          value: 'uuidv4()',
        }, areAllPropsOptional);

        if (event.isParent) {
          writeObjectProperty(tsWriter, event, {
            name: `__${NameUtility.camelToKebabCase(event.name).replace(/-/g, '_')}`,
            value: 'true',
          }, areAllPropsOptional);
        }

        event.parents.forEach((parent) => {
          if (!parent.isAbstract) {
            writeObjectProperty(tsWriter, event, {
              name: `__${NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
              value: 'true',
            }, areAllPropsOptional);
          }
        });

        const processDefaultValue = (defaultValue) => {
          switch(defaultValue) {
            case 'timestamp':
              return 'Date.now()';
            case 'uuid':
              return 'uuidv4()';
            default:
              return JSON.stringify(defaultValue);
          }
        }

        event.properties
          .map((property) => {
            const propertyValue = `props${areAllPropsOptional ? '?' : ''}.${property.name}`;
            const defaultValue = ` ?? ${processDefaultValue(property.default_value)}`;
            return {
              name: property.name,
              isOptional: property.optional,
              isNullable: property.nullable,
              value: `${propertyValue}${property.default_value ? defaultValue : ''}`,
            }
          })
          .forEach((property) => writeObjectProperty(tsWriter, event, property, areAllPropsOptional));

        tsWriter.writeLine('});');
      }
    );

    tsWriter.writeLine();
  });

  tsWriter.writeJsDocLines([`A factory to generate any Event.`]);
  writeEntityFactory(tsWriter, 'makeEvent', nonAbstractEvents);
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
      isOptional: property.optional || property.nullable || property.default_value !== undefined,
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
  tsWriter.writeLine(`${tsWriter.indentString}default:`);
  tsWriter.writeLine(`${tsWriter.indentString.repeat(2)}throw new Error(\`Unknown entity \${_type}\`);`);
  tsWriter.writeLine(`}`);
  tsWriter.decreaseIndent();
  tsWriter.writeLine(`}`);
};

const getTypeForProperty = (property) => {
  const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
  const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
  const nullable = property.nullable ? ' | null' : '';
  return `${mappedType ?? property.type}${mappedSubType ? `<${mappedSubType}>` : ''}${nullable}`;
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

const writeObjectProperty = (tsWriter: TypeScriptWriter, entity, property: PropertyDefinition, areAllPropsOptional) => {
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
      const parameters = getParametersFromProperties(entity);
      const optionalsCount = parameters.filter(parameter => parameter.isOptional).length;
      const areAllPropsOptional = optionalsCount === parameters.length;
      propertyValue = property.value ?? `props${areAllPropsOptional ? '?' : ''}.${property.name}`;
  }

  tsWriter.write(`: ${propertyValue}`);

  if (property.isNullable) {
    tsWriter.write(' ?? null');
  }

  tsWriter.writeEndOfLine(',');
  tsWriter.decreaseIndent();
};
