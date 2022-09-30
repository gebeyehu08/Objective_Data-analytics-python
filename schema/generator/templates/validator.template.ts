/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { ZodWriter } from '../writers/ZodWriter';
import { getContextChildren, getContexts, getEvents, getObjectKeys, getProperties, sortEnumMembers } from './common';

Generator.generateFromModel(
  { outputFile: '../generated/validator.js' },
  (writer: TextWriter, model: typeof Objectiv) => {
    const zodWriter = new ZodWriter(writer);

    // ContextTypes enum
    zodWriter.writeEnumeration({
      export: true,
      name: 'ContextTypes',
      members: sortEnumMembers(getObjectKeys(Objectiv.contexts).map((_type) => ({ name: _type }))),
      description: `Context's _type discriminator attribute values`,
    });

    // EventTypes enum
    zodWriter.writeEnumeration({
      export: true,
      name: 'EventTypes',
      members: sortEnumMembers(getObjectKeys(Objectiv.events).map((_type) => ({ name: _type }))),
      description: `Event's _type discriminator attribute values`,
    });

    // Context definitions
    getContexts().forEach((contextName) => {
      const context = model.contexts[contextName];
      const properties = getProperties(model.contexts, contextName);

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
      items: getContextChildren(model.LocationStack.items.type),
      discriminator: model.LocationStack.items.discriminator,
      description: model.LocationStack.description,
      rules: model.LocationStack.validation.rules,
    });

    // GlobalContexts array definition
    zodWriter.writeArray({
      name: 'GlobalContexts',
      items: getContextChildren(model.GlobalContexts.items.type),
      discriminator: model.GlobalContexts.items.discriminator,
      description: model.GlobalContexts.description,
      rules: model.GlobalContexts.validation.rules,
    });

    // Events
    getEvents().forEach((eventName) => {
      const event = model.events[eventName];
      const properties = getProperties(model.events, eventName);

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
