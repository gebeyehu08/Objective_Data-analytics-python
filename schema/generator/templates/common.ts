/*
 * Copyright 2022 Objectiv B.V.
 */

import Objectiv from '../../base_schema.json';

/**
 * TypeScript friendly Object.keys
 */
export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

/**
 * Sorts the given array of objects by their `name` property
 */
export const sortArrayByName = (array) => array.sort((a, b) => a.name.localeCompare(b.name));

/**
 * A utility to filter out Abstracts from the given list of Entity names (Contexts or Events)
 */
const filterAbstractNames = (entityNames) => entityNames.filter((entityName) => !entityName.startsWith('Abstract'));

/**
 * Gets a list of non-abstract Context names from the Objectiv schema
 */
export const getContextNames = () => filterAbstractNames(getObjectKeys(Objectiv.contexts));

/**
 * Gets a list of non-abstract Event names from the Objectiv schema
 */
export const getEventNames = () => filterAbstractNames(getObjectKeys(Objectiv.events));

/**
 * Gets a list of non-abstract Context and Event entities from the Objectiv schema
 */
export const getEntityNames = () => [...getContextNames(), ...getEventNames()];

/**
 * Retrieves either a Context or Event entity, from the ObjectivSchema, by its `_type` name
 */
export const getEntityByName = (entityName) => Objectiv.contexts[entityName] ?? Objectiv.events[entityName];

/**
 * Recursively gets all the parents of the given Entity (either Context or Event)
 */
export const getEntityParents = (entity, parents = []) => {
  const parentEntityName = entity['parent'];

  if (!parentEntityName) {
    return parents;
  }

  parents.push(parentEntityName);

  return getEntityParents(getEntityByName(parentEntityName), parents);
};

/**
 * Gets all the children of the given Entity by checking all entities' `parent` attribute
 */
export const getChildren = (parentEntity) =>
  getEntityNames().filter((entityName) => {
    const entity = getEntityByName(entityName);
    const parents = getEntityParents(entity);
    return parents.includes(parentEntity);
  });

/**
 * Recursively gets all the parent entity's properties without overriding already inherited properties
 */
export const getParentProperties = (parents, properties = {}) =>
  parents.reduce((properties, parent) => {
    const parentEntity = getEntityByName(parent);
    const parentProperties = parentEntity['properties'] ?? {};
    const parentParents = getEntityParents(parentEntity);

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

    return getParentProperties(parentParents, properties);
  }, properties);

/**
 * Gets all the properties of the given entity, including all recursively inherited properties from its parents
 */
export const getEntityProperties = (entity) => {
  const parents = getEntityParents(entity);
  const properties = entity['properties'] ?? {};

  return getParentProperties(parents, properties);
};
