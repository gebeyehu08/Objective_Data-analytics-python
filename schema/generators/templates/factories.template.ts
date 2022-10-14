/*
 * Copyright 2022 Objectiv B.V.
 */

import { NameUtility, TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from "@yellicode/typescript";
import Objectiv from '../../base_schema.json';
import { TypescriptWriter } from '../writers/TypescriptWriter';
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
  getPropertyValue, sortArrayByName
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
  const tsWriter = new TypescriptWriter(writer);

  tsWriter.writeMultiLineImports('@objectiv/schema', contextNames.filter(contextName => {
    return !contextName.startsWith('Abstract');
  }));
  tsWriter.writeImports('../helpers', ['generateGUID']);
  tsWriter.writeEndOfLine();

  contextNames.forEach((contextName) => {
    const context = Objectiv.contexts[contextName];
    const properties = getEntityProperties(context);
    const parents = getEntityParents(context);
    const isAbstract = contextName.startsWith('Abstract');
    const hasChildren = getChildren(contextName).length;
    const isLocationContext = parents.includes('AbstractLocationContext') || contextName === 'AbstractLocationContext';
    const isGlobalContext = parents.includes('AbstractGlobalContext') || contextName === 'AbstractGlobalContext';

    if(!isAbstract) {
      tsWriter.writeES6FunctionBlock(
        {
          export: true,
          description: getEntityDescription(context, descriptionsType, descriptionsTarget),
          name: `make${contextName}`,
          returnTypeName: contextName,
          multiLineSignature: true,
          parameters: getObjectKeys(properties).reduce((parameters, propertyName) => {
            const property = properties[propertyName];

            if(property?.internal) {
              return parameters;
            }

            parameters.push({
              name: String(propertyName),
              description: getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
              typeName: getTypeForProperty(property),
              isOptional: property.optional,
              value: getPropertyValue(contextName, property),
            })

            return parameters;
          }, []),
        },
        (tsWriter: TypescriptWriter) => {
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
    }
  });

});

Generator.generateFromModel({ outputFile: `${destinationFolder}/EventFactories.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypescriptWriter(writer);

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
  tsWriter.writeImports('../helpers', ['generateGUID']);
  tsWriter.writeEndOfLine();

  eventNames.forEach((eventName) => {
    const event = Objectiv.events[eventName];
    const properties = getEntityProperties(event);
    const parents = getEntityParents(event);
    const isAbstract = eventName.startsWith('Abstract');
    const hasChildren = getChildren(eventName).length;

    if(!isAbstract) {
      tsWriter.writeES6FunctionBlock(
        {
          export: true,
          description: getEntityDescription(event, descriptionsType, descriptionsTarget),
          name: `make${eventName}`,
          returnTypeName: eventName,
          multiLineSignature: true,
          parameters: getObjectKeys(properties).reduce((parameters, propertyName) => {
            const property = properties[propertyName];

            if(property?.internal) {
              return parameters;
            }

            parameters.push({
              name: String(propertyName),
              description: getPropertyDescription(event, propertyName, descriptionsType, descriptionsTarget),
              typeName: getTypeForProperty(property),
              isOptional: property.optional,
              value: getPropertyValue(eventName, property),
            })

            return parameters;
          }, []),
        },
        (tsWriter: TypescriptWriter) => {
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
    }
  });

});

Generator.generateFromModel({ outputFile: `${destinationFolder}/ContextNames.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypescriptWriter(writer);
  const globalContexts = contextNames.filter(contextName => {
    const context = getEntityByName(contextName);
    const parents = getEntityParents(context);
    const isAbstract = contextName.startsWith('Abstract');
    const isGlobalContext = parents.includes('AbstractGlobalContext');

    return !isAbstract && isGlobalContext;
  });

  const locationContexts = contextNames.filter(contextName => {
    const context = getEntityByName(contextName);
    const parents = getEntityParents(context);
    const isAbstract = contextName.startsWith('Abstract');
    const isLocationContext = parents.includes('AbstractLocationContext');

    return !isAbstract && isLocationContext;
  })

  // GlobalContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'GlobalContextName',
    members: sortArrayByName(globalContexts.map((_type) => ({ name: _type, value: _type }))),
  });

  tsWriter.writeEndOfLine();

  // AnyGlobalContextName type
  tsWriter.writeLine('export type AnyGlobalContextName =')
  globalContexts.forEach((contextName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === globalContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  // LocationContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'LocationContextName',
    members: sortArrayByName(locationContexts.map((_type) => ({ name: _type, value: _type }))),
  });

  tsWriter.writeEndOfLine();

  // AnyLocationContextName type
  tsWriter.writeLine('export type AnyLocationContextName =')
  locationContexts.forEach((contextName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === locationContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  tsWriter.writeLines([
    'export const ContextNames = new Set([...Object.keys(LocationContextName), ...Object.keys(GlobalContextName)]);'
  ]);
});

Generator.generateFromModel({ outputFile: `${destinationFolder}/EventNames.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypescriptWriter(writer);
  const events = eventNames.filter(eventName => {
    return !eventName.startsWith('Abstract');
  });

  // EventName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'EventName',
    members: sortArrayByName(events.map((_type) => ({ name: _type, value: _type }))),
  });

  tsWriter.writeEndOfLine();

  // AnyEventName type
  tsWriter.writeLine('export type AnyEventName =')
  events.forEach((eventName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${eventName}'${index === events.length - 1 ? ';' : ''}`);
  });
});

const getTypeForProperty = (property) => {
  const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
  const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
  return `${mappedType ?? property.type}${mappedSubType ? `<${mappedSubType}>` : ''}`
}

const writeObjectProperty = (tsWriter: TypeScriptWriter, entityName, property: PropertyDefinition) => {
  tsWriter.increaseIndent();

  tsWriter.writeIndent();

  tsWriter.write(`${property.name}`);

  let propertyValue;

  switch(property.name) {
    case '_type':
      propertyValue = `'${entityName}'`;
      break;
    case '_types':
      const entityParents = getEntityParents(getEntityByName(entityName));
      propertyValue = `['${[...entityParents, entityName].join("', '")}']`;
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
