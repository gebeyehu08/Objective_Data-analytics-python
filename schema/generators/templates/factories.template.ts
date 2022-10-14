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
      tsWriter.writeJsDocDescription(getEntityDescription(context, descriptionsType, descriptionsTarget));
      tsWriter.write('export ');
      tsWriter.writeES6FunctionBlock(
        {
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

const getTypeForProperty = (property) => {
  const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
  const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;

  return `${mappedType}${mappedSubType ? `<${mappedSubType}>` : ''}`
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
    default:
      propertyValue = property.value ?? `props.${property.name}`;
  }

  tsWriter.write(`: ${propertyValue}`);

  if (property.isOptional && property.name !== '_types') {
    tsWriter.write(' ?? null');
  }

  tsWriter.writeEndOfLine(',');
  tsWriter.decreaseIndent();
}
