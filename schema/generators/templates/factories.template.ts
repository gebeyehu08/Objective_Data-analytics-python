/*
 * Copyright 2022 Objectiv B.V.
 */

import { NameUtility, TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { TypeScriptWriter } from '../writers/TypeScriptWriter';
import {
  getChildren,
  getContextNames,
  getEntityByName,
  getEntityDescription,
  getEntityParents,
  getEntityProperties,
  getEventNames,
  getObjectKeys,
  getPropertyDescription,
  getPropertyValue
} from "./common";

// TODO temporarily generate this in the /generated folder, as we need TS to be finished before we can use it
//const destinationFolder = '../../../tracker/core/tracker/src/generated/';
const destinationFolder = '../generated/';

const descriptionsType = 'text';
const descriptionsTarget = 'primary';

const contextNames = getContextNames();
const eventNames = getEventNames();

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

Generator.generateFromModel({ outputFile: `${destinationFolder}/ContextFactories.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  tsWriter.writeMultiLineImports('@objectiv/schema', contextNames.filter(contextName => {
    return !contextName.startsWith('Abstract');
  }));
  tsWriter.writeImports('./ContextNames', ['AbstractContextName', 'GlobalContextName', 'LocationContextName']);
  tsWriter.writeImports('../helpers', ['generateGUID']);
  tsWriter.writeEndOfLine();

  const nonAbstractContexts = contextNames.filter(
    contextName => !contextName.startsWith('Abstract')
  );

  nonAbstractContexts.forEach((contextName) => {
    const context = Objectiv.contexts[contextName];
    const properties = getEntityProperties(context);
    const parents = getEntityParents(context);
    const hasChildren = getChildren(contextName).length;
    const isLocationContext = parents.includes('AbstractLocationContext') || contextName === 'AbstractLocationContext';
    const isGlobalContext = parents.includes('AbstractGlobalContext') || contextName === 'AbstractGlobalContext';

    tsWriter.writeES6FunctionBlock(
      {
        export: true,
        description: getEntityDescription(context, descriptionsType, descriptionsTarget),
        name: `make${contextName}`,
        returnTypeName: contextName,
        multiLineSignature: true,
        parameters: getParametersFromProperties(contextName, context, properties),
      },
      (tsWriter: TypeScriptWriter) => {
        tsWriter.writeLine('({');

        writeObjectProperty(tsWriter, contextName, {
          name: '__instance_id',
          value: 'generateGUID()'
        })

        if(hasChildren) {
          writeObjectProperty(tsWriter, contextName, {
            name: `__${NameUtility.camelToKebabCase(contextName).replace(/-/g, '_')}`,
            value: 'true'
          })
        }

        parents.forEach(parentName => {
          const isAbstract = parentName.startsWith('Abstract');
          if(!isAbstract) {
            writeObjectProperty(tsWriter, contextName, {
              name: `__${NameUtility.camelToKebabCase(parentName).replace(/-/g, '_')}`,
              value: 'true'
            })
          }
        })

        if(isLocationContext) {
          writeObjectProperty(tsWriter, contextName, {
            name: '__location_context',
            value: 'true'
          })
        }

        if(isGlobalContext) {
          writeObjectProperty(tsWriter, contextName, {
            name: '__global_context',
            value: 'true'
          })
        }

        getObjectKeys(properties).map((propertyName) => ({
          name: String(propertyName),
          isOptional: properties[propertyName].optional,
          value: getPropertyValue(contextName, properties[propertyName]),
        })).forEach(
          property => writeObjectProperty(tsWriter, contextName, property)
        )

        tsWriter.writeLine('});');
      }
    )

    tsWriter.writeLine();
  });

  writeEntityFactory(tsWriter, 'Context', nonAbstractContexts);
});

Generator.generateFromModel({ outputFile: `${destinationFolder}/EventFactories.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);

  tsWriter.writeMultiLineImports('@objectiv/schema', [
    ...[
      ...eventNames.filter(eventName => {
        return !eventName.startsWith('Abstract');
      }),
      // TODO not so nice, we could automate this, but these two entities are a bit of a special case
      'LocationStack',
      'GlobalContexts'
    ].sort()
  ]);
  tsWriter.writeImports('./EventNames', ['AbstractEventName', 'EventName']);
  tsWriter.writeImports('../helpers', ['generateGUID']);
  tsWriter.writeEndOfLine();

  const nonAbstractEvents = eventNames.filter(
    eventName => !eventName.startsWith('Abstract')
  );

  nonAbstractEvents.forEach((eventName) => {
    const event = Objectiv.events[eventName];
    const properties = getEntityProperties(event);
    const parents = getEntityParents(event);
    const hasChildren = getChildren(eventName).length;

    tsWriter.writeES6FunctionBlock(
      {
        export: true,
        description: getEntityDescription(event, descriptionsType, descriptionsTarget),
        name: `make${eventName}`,
        returnTypeName: eventName,
        multiLineSignature: true,
        parameters: getParametersFromProperties(eventName, event, properties),
      },
      (tsWriter: TypeScriptWriter) => {
        tsWriter.writeLine('({');

        writeObjectProperty(tsWriter, eventName, {
          name: '__instance_id',
          value: 'generateGUID()'
        })

        if(hasChildren) {
          writeObjectProperty(tsWriter, eventName, {
            name: `__${NameUtility.camelToKebabCase(eventName).replace(/-/g, '_')}`,
            value: 'true'
          })
        }

        parents.forEach(parentName => {
          const isAbstract = parentName.startsWith('Abstract');
          if(!isAbstract) {
            writeObjectProperty(tsWriter, eventName, {
              name: `__${NameUtility.camelToKebabCase(parentName).replace(/-/g, '_')}`,
              value: 'true'
            })
          }
        })

        getObjectKeys(properties).map((propertyName) => ({
          name: String(propertyName),
          isOptional: properties[propertyName].optional,
          value: getPropertyValue(eventName, properties[propertyName]),
        })).forEach(
          property => writeObjectProperty(tsWriter, eventName, property)
        )

        tsWriter.writeLine('});');
      }
    )

    tsWriter.writeLine();
  });

  writeEntityFactory(tsWriter, 'Event', nonAbstractEvents);

});

const getParametersFromProperties = (entityName, entity, properties) => getObjectKeys(properties).reduce((parameters, propertyName) => {
  const property = properties[propertyName];

  if(property?.internal) {
    return parameters;
  }

  parameters.push({
    name: String(propertyName),
    description: getPropertyDescription(entity, propertyName, descriptionsType, descriptionsTarget),
    typeName: getTypeForProperty(property),
    isOptional: property.optional,
    value: getPropertyValue(entityName, property),
  })

  return parameters;
}, []);

const writeEntityFactory = (tsWriter: TypeScriptWriter, entityType: 'Event' | 'Context', entityNames) => {
  tsWriter.writeJsDocLines([
    `A factory to generate any ${entityType}.`
  ]);
  const entityPropsName = `${entityType.toLowerCase()}Props`;
  entityNames.forEach(entityName => {
    const entity = getEntityByName(entityName);
    const properties = getEntityProperties(entity);
    tsWriter.write(`export function make${entityType} (`);
    tsWriter.writeProps({
      propsName: `${entityType.toLowerCase()}Props`,
      parameters: [
        {
          name: '_type',
          typeName: `'${entityName}'`,
        },
        ...getParametersFromProperties(entityName, entity, properties)
      ],
    });
    tsWriter.writeLine(`): ${entityName};`);
    tsWriter.writeEndOfLine(``);
  })
  tsWriter.writeLine(`export function make${entityType} ({ _type, ...${entityPropsName} }: any) {`)
  tsWriter.increaseIndent();
  tsWriter.writeLine(`switch(_type) {`)
  entityNames.forEach(entityName => {
    tsWriter.writeLine(`${tsWriter.indentString}case '${entityName}':`)
    tsWriter.writeLine(`${tsWriter.indentString.repeat(2)}return make${entityName}(${entityPropsName});`);
  });
  tsWriter.writeLine(`}`);
  tsWriter.decreaseIndent();
  tsWriter.writeLine(`}`);
}

const getTypeForProperty = (property) => {
  const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
  const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
  return `${mappedType ?? property.type}${mappedSubType ? `<${mappedSubType}>` : ''}`
}

const mapInternalTypeToEnum = (entityName) => {
  const entity = getEntityByName(entityName);
  const entityParents = getEntityParents(entity);
  const isLocationContext = entityParents.includes('AbstractLocationContext');
  const isGlobalContext = entityParents.includes('AbstractGlobalContext');
  const isAbstract = entityName.startsWith('Abstract');
  const isContext = entityParents.includes('AbstractContext') || entityName === 'AbstractContext';
  const isEvent = entityParents.includes('AbstractEvent') || entityName === 'AbstractEvent';

  if(isAbstract) {
    if(isContext) {
      return `AbstractContextName.${entityName}`;
    }

    if(isEvent) {
      return `AbstractEventName.${entityName}`;
    }
  }

  if(isLocationContext) {
      return `LocationContextName.${entityName}`;
  }

  if(isGlobalContext) {
      return `GlobalContextName.${entityName}`;
  }

  if(isEvent) {
      return `EventName.${entityName}`;
  }
}

const writeObjectProperty = (tsWriter: TypeScriptWriter, entityName, property: PropertyDefinition) => {
  const entity = getEntityByName(entityName);
  const entityParents = getEntityParents(entity);

  tsWriter.increaseIndent();

  tsWriter.writeIndent();

  tsWriter.write(`${property.name}`);

  let propertyValue;

  switch(property.name) {
    case '_type':
      propertyValue = mapInternalTypeToEnum(entityName);
      break;
    case '_types':
      const indent = tsWriter.indentString;
      const doubleIndent = indent.repeat(2);
      const _types = [...entityParents, entityName].map(mapInternalTypeToEnum);
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
}
