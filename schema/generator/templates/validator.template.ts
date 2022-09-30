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
  getEntityProperties,
  getEventNames,
  getObjectKeys,
  sortArrayByName
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
      const properties = getEntityProperties(contextName);

      zodWriter.writeObject({
        name: contextName,
        // TODO get description from parent as well
        description: context.description,
        properties: getObjectKeys(properties).map((property) => ({
          name: String(property),
          // TODO get description from parent as well
          description: properties[property].description,
          typeName: properties[property].type,
          isOptional: properties[property].optional,
          value: properties[property].type === 'discriminator' ? `ContextTypes.enum.${contextName}` : undefined,
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
      const properties = getEntityProperties(eventName);

      // TODO support Event validation rules
      zodWriter.writeObject({
        name: eventName,
        // TODO get description from parent as well
        description: event.description,
        properties: getObjectKeys(properties).map((property) => ({
          name: String(property),
          // TODO get description from parent as well
          description: properties[property].description,
          typeName: properties[property].type,
          isOptional: properties[property].optional,
          value: properties[property].type === 'discriminator' ? `EventTypes.enum.${eventName}` : undefined,
        })),
        rules: event.validation?.rules,
      });
    });
  }
);
