/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { ZodWriter } from '../writers/ZodWriter';
import {
  getChildren,
  getContextNames,
  getEntityDescription,
  getEntityProperties,
  getEventNames,
  getObjectKeys,
  getPropertyDescription,
  sortArrayByName,
} from './common';

Generator.generateFromModel(
  { outputFile: '../generated/validator.js' },
  (writer: TextWriter, model: typeof Objectiv) => {
    const zodWriter = new ZodWriter(writer);

    // ContextTypes enum
    zodWriter.writeEnumeration({
      export: true,
      name: 'ContextTypes',
      members: sortArrayByName(getObjectKeys(Objectiv.contexts).map((_type) => ({ name: _type }))),
      description: `Context's _type discriminator attribute values`,
    });

    // EventTypes enum
    zodWriter.writeEnumeration({
      export: true,
      name: 'EventTypes',
      members: sortArrayByName(getObjectKeys(Objectiv.events).map((_type) => ({ name: _type }))),
      description: `Event's _type discriminator attribute values`,
    });

    // Context definitions
    getContextNames().forEach((contextName) => {
      const context = model.contexts[contextName];
      const properties = getEntityProperties(context);

      zodWriter.writeObject({
        name: contextName,
        description: getEntityDescription(context),
        properties: getObjectKeys(properties).map((propertyName) => ({
          name: String(propertyName),
          description: getPropertyDescription(context, propertyName),
          typeName: properties[propertyName].type,
          isOptional: properties[propertyName].optional,
          value: properties[propertyName].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
        })),
      });
    });

    // LocationStack array definition
    zodWriter.writeArray({
      name: 'LocationStack',
      items: getChildren(model.LocationStack.items.type).sort(),
      discriminator: model.LocationStack.items.discriminator,
      description: model.LocationStack.description,
      rules: model.LocationStack.validation.rules,
    });

    // GlobalContexts array definition
    zodWriter.writeArray({
      name: 'GlobalContexts',
      items: getChildren(model.GlobalContexts.items.type).sort(),
      discriminator: model.GlobalContexts.items.discriminator,
      description: model.GlobalContexts.description,
      rules: model.GlobalContexts.validation.rules,
    });

    // Events
    getEventNames().forEach((eventName) => {
      const event = model.events[eventName];
      const properties = getEntityProperties(event);

      zodWriter.writeObject({
        name: eventName,
        description: getEntityDescription(event),
        properties: getObjectKeys(properties).map((propertyName) => ({
          name: String(propertyName),
          description: getPropertyDescription(event, propertyName),
          typeName: properties[propertyName].type,
          isOptional: properties[propertyName].optional,
          value: properties[propertyName].type === 'discriminator' ? `EventTypes.enum.${eventName}` : undefined,
        })),
        rules: event.validation?.rules,
      });
    });

    // Main `validate` endpoint
    zodWriter.writeLine(`export const validate = z.union([`);
    zodWriter.increaseIndent();
    getEventNames().forEach((eventName) => zodWriter.writeLine(`${eventName},`));
    zodWriter.decreaseIndent();
    zodWriter.writeLine(`]).safeParse;`);
    zodWriter.writeLine();
  }
);
