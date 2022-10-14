/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypescriptWriter } from '../writers/TypescriptWriter';
import { getContextNames, getEntityByName, getEntityParents, getEventNames, sortArrayByName } from "./common";

// TODO temporarily generate this in the /generated folder, as we need TS to be finished before we can use it
//const destinationFolder = '../../../tracker/core/tracker/src/generated/';
const destinationFolder = '../generated/';

const contextNames = getContextNames();
const eventNames = getEventNames();

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
