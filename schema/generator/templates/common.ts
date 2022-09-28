/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import Objectiv from '../../base_schema.json';
import { TypescriptWriter } from '../writers/SchemaWriter';
import { ZodWriter } from '../writers/ValidatorWriter';

export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const sortEnumMembers = <T extends { name: string }>(members: T[]) =>
  members.sort((a, b) => a.name.localeCompare(b.name));

export const writeCopyright = (writer: TextWriter) => {
  writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
};

export const writeEnumerations = (writer: TypescriptWriter | ZodWriter) => {
  writer.writeEnumeration({
    export: true,
    name: 'ContextTypes',
    members: sortEnumMembers(getObjectKeys(Objectiv.contexts).map((_type) => ({ name: _type }))),
  });

  writer.writeLine();

  writer.writeEnumeration({
    export: true,
    name: 'EventTypes',
    members: sortEnumMembers(getObjectKeys(Objectiv.events).map((_type) => ({ name: _type }))),
  });

  writer.writeLine();
};

export const getContexts = (includeAbstracts = false) => {
  const allContexts = getObjectKeys(Objectiv.contexts);

  if (includeAbstracts) {
    return allContexts;
  }

  return allContexts.filter((entityName) => !entityName.startsWith('Abstract'));
};

export const getEntityProperties = (entity) => entity['properties'] ?? {};
export const getEntityParents = (entity) => entity['parents'] ?? [];
export const getEntityRequiresContext = (entity) => entity['requiresContext'] ?? [];

// recursive helper to fetch parent attributes
export const getParentAttributes = (entities, parents, attributes = { properties: {} }) =>
  parents.reduce((parentAttributes, parent) => {
    const parentProperties = getEntityProperties(entities[parent]);
    const parentParents = getEntityParents(entities[parent]);

    const parentPropertyKeys = getObjectKeys(parentProperties);
    parentPropertyKeys.forEach((parentPropertyKey) => {
      const parentProperty = parentProperties[parentPropertyKey];
      if (parentAttributes.properties[parentPropertyKey] === undefined) {
        parentAttributes.properties[parentPropertyKey] = parentProperty;
      }
    });

    if (!parentParents.length) {
      return parentAttributes;
    }

    return getParentAttributes(entities, parentParents, parentAttributes);
  }, attributes);

export const getEntityAttributes = (entities, entityName) => {
  const parents = getEntityParents(entities[entityName]);
  const properties = getEntityProperties(entities[entityName]);

  return getParentAttributes(entities, parents, { properties });
};
