/*
 * Copyright 2022 Objectiv B.V.
 */

import Objectiv from '../../base_schema.json';

export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const sortEnumMembers = <T extends { name: string }>(members: T[]) =>
  members.sort((a, b) => a.name.localeCompare(b.name));

export const getContexts = (includeAbstracts = false) => {
  const allContexts = getObjectKeys(Objectiv.contexts);

  if (includeAbstracts) {
    return allContexts;
  }

  return allContexts.filter((entityName) => !entityName.startsWith('Abstract'));
};

export const getEntityProperties = (entity) => entity['properties'] ?? {};

export const getEntity = (entityType) => Objectiv.contexts[entityType] ?? Objectiv.events[entityType];

export const getEntityParents = (entity, parents = []) => {
  const parentEntityType = entity['parent'];

  if(!parentEntityType) {
    return parents.sort();
  }

  parents.push(parentEntityType);

  return getEntityParents(getEntity(parentEntityType), parents);
};

export const getContextChildren = (parentContext) => getContexts().filter(contextType => {
  const context = Objectiv.contexts[contextType];
  const contextParents = getEntityParents(context);
  return contextParents.includes(parentContext);
}).sort();


// recursive helper to fetch parent attributes
export const getParentProperties = (entities, parents, properties = {}) =>
  parents.reduce((properties, parent) => {
    const parentProperties = getEntityProperties(entities[parent]);
    const parentParents = getEntityParents(entities[parent]);

    const parentPropertyKeys = getObjectKeys(parentProperties);
    parentPropertyKeys.forEach((parentPropertyKey) => {
      const parentProperty = parentProperties[parentPropertyKey];
      if (properties[parentPropertyKey] === undefined) {
        properties[parentPropertyKey] = parentProperty;
      }
    });

    if (!parentParents.length) {
      return properties;
    }

    return getParentProperties(entities, parentParents, properties);
  }, properties);

export const getProperties = (entities, entityName) => {
  const parents = getEntityParents(entities[entityName]);
  const properties = getEntityProperties(entities[entityName]);

  return getParentProperties(entities, parents, properties);
};
