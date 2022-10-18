/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '../writers/TypeScriptWriter';
import { getContextNames, getEntityByName, getEntityParents, getEventNames, sortBy } from './common';

// TODO temporarily generate this in the /generated folder, as we need TS to be finished before we can use it
//const destinationFolder = '../../../tracker/core/tracker/src/generated/';
const destinationFolder = '../generated/';

const contextNames = getContextNames();
const eventNames = getEventNames();

Generator.generateFromModel({ outputFile: `${destinationFolder}/ContextNames.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);
  const globalContexts = [];
  const locationContexts = [];
  const abstractContexts = [];

  contextNames.forEach((contextName) => {
    const context = getEntityByName(contextName);
    const parents = getEntityParents(context);

    if (contextName.startsWith('Abstract')) {
      abstractContexts.push(contextName);
    }

    if (parents.includes('AbstractGlobalContext')) {
      globalContexts.push(contextName);
    }

    if (parents.includes('AbstractLocationContext')) {
      locationContexts.push(contextName);
    }
  });

  // AbstractContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'AbstractContextName',
    members: sortBy(abstractContexts.map((_type) => ({ name: _type, value: _type })), 'name'),
  });

  tsWriter.writeEndOfLine();

  // AnyAbstractContextName type
  tsWriter.writeLine('export type AnyAbstractContextName =');
  abstractContexts.forEach((contextName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === abstractContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  // GlobalContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'GlobalContextName',
    members: sortBy(globalContexts.map((_type) => ({ name: _type, value: _type })), 'name'),
  });

  tsWriter.writeEndOfLine();

  // AnyGlobalContextName type
  tsWriter.writeLine('export type AnyGlobalContextName =');
  globalContexts.forEach((contextName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === globalContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  // LocationContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'LocationContextName',
    members: sortBy(locationContexts.map((_type) => ({ name: _type, value: _type })), 'name'),
  });

  tsWriter.writeEndOfLine();

  // AnyLocationContextName type
  tsWriter.writeLine('export type AnyLocationContextName =');
  locationContexts.forEach((contextName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${contextName}'${index === locationContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  tsWriter.writeLines([
    'export const ContextNames = new Set([...Object.keys(LocationContextName), ...Object.keys(GlobalContextName)]);',
  ]);
});

Generator.generateFromModel({ outputFile: `${destinationFolder}/EventNames.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);
  const events = [];
  const abstractEvents = [];

  eventNames.forEach((eventName) => {
    if (eventName.startsWith('Abstract')) {
      abstractEvents.push(eventName);
    } else {
      events.push(eventName);
    }
  });

  // AbstractEventName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'AbstractEventName',
    members: sortBy(abstractEvents.map((_type) => ({ name: _type, value: _type })), 'name'),
  });

  tsWriter.writeEndOfLine();

  // AnyAbstractEventName type
  tsWriter.writeLine('export type AnyAbstractEventName =');
  abstractEvents.forEach((eventName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${eventName}'${index === abstractEvents.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  // EventName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'EventName',
    members: sortBy(events.map((_type) => ({ name: _type, value: _type })), 'name'),
  });

  tsWriter.writeEndOfLine();

  // AnyEventName type
  tsWriter.writeLine('export type AnyEventName =');
  events.forEach((eventName, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${eventName}'${index === events.length - 1 ? ';' : ''}`);
  });
});
