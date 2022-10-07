/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { ZodWriter } from '../writers/ZodWriter';
import {
  filterAbstractNames,
  getChildren,
  getContextNames,
  getEntityDescription,
  getEntityProperties,
  getEventNames,
  getObjectKeys,
  getPropertyDescription,
  sortArrayByName,
} from './common';

const schemaVersion = Objectiv.version.base_schema;
const descriptionsType = 'text';
const descriptionsIntent = 'primary';

const validatorGenerator = (writer: TextWriter, model: typeof Objectiv) => {
  const zodWriter = new ZodWriter(writer);

  // ContextTypes enum
  zodWriter.writeEnumeration({
    name: 'ContextTypes',
    members: sortArrayByName(getObjectKeys(Objectiv.contexts).map((_type) => ({ name: _type }))),
    description: `Context's _type discriminator attribute values`,
  });

  // EventTypes enum
  zodWriter.writeEnumeration({
    name: 'EventTypes',
    members: sortArrayByName(getObjectKeys(Objectiv.events).map((_type) => ({ name: _type }))),
    description: `Event's _type discriminator attribute values`,
  });

  // Context definitions
  const allContexts = filterAbstractNames(getContextNames());
  const childContexts = allContexts.filter((context) => getChildren(context).length === 0);
  childContexts.forEach((contextName) => {
    const context = model.contexts[contextName];
    const properties = getEntityProperties(context);

    zodWriter.writeObject({
      name: contextName,
      description: getEntityDescription(context, descriptionsType, descriptionsIntent),
      properties: getObjectKeys(properties).map((propertyName) => ({
        name: String(propertyName),
        description: getPropertyDescription(context, propertyName, descriptionsType, descriptionsIntent),
        typeName: properties[propertyName].type,
        isOptional: properties[propertyName].optional,
        value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
      })),
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();
  });
  const parentContexts = allContexts.filter((context) => getChildren(context).length > 0);
  parentContexts.forEach((contextName) => {
    const context = model.contexts[contextName];
    const properties = getEntityProperties(context);
    const childrenNames = getChildren(contextName);

    zodWriter.writeObject({
      name: `${contextName}Entity`,
      description: getEntityDescription(context, descriptionsType, descriptionsIntent),
      properties: getObjectKeys(properties).map((propertyName) => ({
        name: String(propertyName),
        description: getPropertyDescription(context, propertyName, descriptionsType, descriptionsIntent),
        typeName: properties[propertyName].type,
        isOptional: properties[propertyName].optional,
        value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
      })),
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();

    zodWriter.writeDiscriminatedUnion({
      name: contextName,
      description: getEntityDescription(context, descriptionsType, descriptionsIntent),
      discriminator: '_type',
      items: [
        {
          properties: getObjectKeys(properties).map((propertyName) => ({
            name: String(propertyName),
            description: getPropertyDescription(context, propertyName, descriptionsType, descriptionsIntent),
            typeName: properties[propertyName].type,
            isOptional: properties[propertyName].optional,
            value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
          })),
        },
        ...childrenNames,
      ],
    });
  });

  // LocationStack array definition
  const allLocationContexts = getChildren(model.LocationStack.items.type).sort();
  const ChildLocationContexts = allLocationContexts.filter((context) => getChildren(context).length === 0);
  const ParentLocationContexts = allLocationContexts.filter((context) => getChildren(context).length > 0);
  zodWriter.writeArray({
    name: 'LocationStack',
    items: [...ChildLocationContexts, ...ParentLocationContexts.map((contextName) => `${contextName}Entity`)],
    discriminator: model.LocationStack.items.discriminator,
    description: getEntityDescription(model.LocationStack, descriptionsType, descriptionsIntent),
    rules: model.LocationStack.validation.rules,
  });

  // GlobalContexts array definition
  const allGlobalContexts = getChildren(model.GlobalContexts.items.type).sort();
  const ChildGlobalContexts = allGlobalContexts.filter((context) => getChildren(context).length === 0);
  const ParentGlobalContexts = allGlobalContexts.filter((context) => getChildren(context).length > 0);
  zodWriter.writeArray({
    name: 'GlobalContexts',
    items: [...ChildGlobalContexts, ...ParentGlobalContexts.map((contextName) => `${contextName}Entity`)],
    discriminator: model.GlobalContexts.items.discriminator,
    description: getEntityDescription(model.GlobalContexts, descriptionsType, descriptionsIntent),
    rules: model.GlobalContexts.validation.rules,
  });

  // Events
  filterAbstractNames(getEventNames()).forEach((eventName) => {
    const event = model.events[eventName];
    const properties = getEntityProperties(event);

    zodWriter.writeObject({
      name: eventName,
      description: getEntityDescription(event, descriptionsType, descriptionsIntent),
      properties: getObjectKeys(properties).map((propertyName) => ({
        name: String(propertyName),
        description: getPropertyDescription(event, propertyName, descriptionsType, descriptionsIntent),
        typeName: properties[propertyName].type,
        isOptional: properties[propertyName].optional,
        value: properties[propertyName].type === 'discriminator' ? `EventTypes.enum.${eventName}` : undefined,
      })),
      rules: event.validation?.rules,
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();
  });

  // Entity map for refinements and validation code
  zodWriter.writeJsDocLines([`Set validators in validatorMap for the refinements.`]);
  zodWriter.writeLine(`entityMap = {`);
  zodWriter.exportList.push('entityMap');
  zodWriter.increaseIndent();
  allContexts.forEach((context) => {
    zodWriter.writeLine(`'${context}': ${context},`);
  });
  zodWriter.decreaseIndent();
  zodWriter.writeLine(`};\n`);

  // Main `validate` endpoint
  zodWriter.writeJsDocLines([
    `The validate method can be used to safely parse an Event.`,
    `Possible return values:`,
    `  - Valid event: { success: true, data: <parsed event object> }.`,
    `  - Invalid event: { success: false, error: <error collection> }.`,
  ]);
  zodWriter.writeLine(`const validate = z.union([`);
  zodWriter.exportList.push('validate');
  zodWriter.increaseIndent();
  filterAbstractNames(getEventNames()).forEach((eventName) => zodWriter.writeLine(`${eventName},`));
  zodWriter.decreaseIndent();
  zodWriter.writeLine(`]).safeParse;`);
  zodWriter.writeLine();

  // Exports
  zodWriter.exportList.forEach((name) => {
    zodWriter.writeLine(`exports.${name} = ${name};`);
  });
};

Generator.generateFromModel({ outputFile: `../../validator/validator-v${schemaVersion}.js` }, validatorGenerator);
Generator.generateFromModel({ outputFile: `../../validator/validator.js` }, validatorGenerator);
