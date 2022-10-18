/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '../writers/TypeScriptWriter';
import { sortBy } from './common';
import { getContexts, getEvents } from "./parser";

// TODO temporarily generate this in the /generated folder, as we need TS to be finished before we can use it
//const destinationFolder = '../../../tracker/core/tracker/src/generated/';
const destinationFolder = '../generated/';

Generator.generateFromModel({ outputFile: `${destinationFolder}/ContextNames.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);
  const abstractContexts = sortBy(getContexts({ isAbstract: true }), 'name');
  const globalContexts = sortBy(getContexts({ isGlobalContext: true }), 'name');
  const locationContexts = sortBy(getContexts({ isLocationContext: true }), 'name');

  // AbstractContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'AbstractContextName',
    members: abstractContexts.map(({name}) => ({ name, value: name })),
  });

  tsWriter.writeEndOfLine();

  // AnyAbstractContextName type
  tsWriter.writeLine('export type AnyAbstractContextName =');
  abstractContexts.forEach((context, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${context.name}'${index === abstractContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  // GlobalContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'GlobalContextName',
    members: globalContexts.map(({ name }) => ({ name, value: name })),
  });

  tsWriter.writeEndOfLine();

  // AnyGlobalContextName type
  tsWriter.writeLine('export type AnyGlobalContextName =');
  globalContexts.forEach((context, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${context.name}'${index === globalContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  // LocationContextName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'LocationContextName',
    members: locationContexts.map(({ name }) => ({ name, value: name })),
  });

  tsWriter.writeEndOfLine();

  // AnyLocationContextName type
  tsWriter.writeLine('export type AnyLocationContextName =');
  locationContexts.forEach((context, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${context.name}'${index === locationContexts.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  tsWriter.writeLines([
    'export const ContextNames = new Set([...Object.keys(LocationContextName), ...Object.keys(GlobalContextName)]);',
  ]);
});

Generator.generateFromModel({ outputFile: `${destinationFolder}/EventNames.ts` }, (writer: TextWriter) => {
  const tsWriter = new TypeScriptWriter(writer);
  const abstractEvents = sortBy(getEvents({ isAbstract: true }), 'name');
  const events = sortBy(getEvents({ isAbstract: false }), 'name');

  // AbstractEventName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'AbstractEventName',
    members: abstractEvents.map(({ name }) => ({ name, value: name })),
  });

  tsWriter.writeEndOfLine();

  // AnyAbstractEventName type
  tsWriter.writeLine('export type AnyAbstractEventName =');
  abstractEvents.forEach((event, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${event.name}'${index === abstractEvents.length - 1 ? ';' : ''}`);
  });

  tsWriter.writeEndOfLine();

  // EventName enum
  tsWriter.writeEnumeration({
    export: true,
    name: 'EventName',
    members: events.map(({ name }) => ({ name, value: name })),
  });

  tsWriter.writeEndOfLine();

  // AnyEventName type
  tsWriter.writeLine('export type AnyEventName =');
  events.forEach((event, index) => {
    tsWriter.writeLine(`${tsWriter.indentString}| '${event.name}'${index === events.length - 1 ? ';' : ''}`);
  });
});
