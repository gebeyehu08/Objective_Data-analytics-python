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
export const filterAbstractNames = (entityNames) =>
  entityNames.filter((entityName) => !entityName.startsWith('Abstract'));

/**
 * Gets a list of non-abstract Context names from the Objectiv schema
 */
export const getContextNames = () => getObjectKeys(Objectiv.contexts);

/**
 * Gets a list of non-abstract Event names from the Objectiv schema
 */
export const getEventNames = () => getObjectKeys(Objectiv.events);

/**
 * Gets a list of non-abstract Context and Event entities from the Objectiv schema
 */
export const getEntityNames = () => [...getContextNames(), ...getEventNames()];

/**
 * Retrieves either a Context or Event entity, from the ObjectivSchema, by its `_type` name
 */
export const getEntityByName = (entityName) =>
  Objectiv.contexts[entityName] ?? Objectiv.events[entityName] ?? Objectiv[entityName];

/**
 * Recursively gets all the parents of the given Entity (either Context or Event)
 */
export const getEntityParents = (entity, parents = []) => {
  const parentEntityName = entity['parent'];

  if (!parentEntityName) {
    return parents;
  }

  parents.unshift(parentEntityName);

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

/**
 * Gets the descriptions from an Entity documentation array matching the given type and target
 */
export const getEntityDescriptionsFromDocumentation = (entity, type, target) => {
  if (!entity.documentation) {
    return [];
  }

  return entity.documentation
    .filter((documentationBlock) => {
      if (type && target) {
        return documentationBlock?.type === type && documentationBlock.target === target;
      }
      if (type) {
        return documentationBlock.type === type;
      }
      if (target) {
        return documentationBlock.target === target;
      }
      return true;
    })
    .map((documentationBlock) => documentationBlock.description);
};

/**
 * Gets the first description from an Entity documentation array matching the given type and target
 */
export const getEntityDescriptionFromDocumentation = (entity, type, target) => {
  return getEntityDescriptionsFromDocumentation(entity, type, target)[0];
};

/**
 * Gets the first markdown description from an Entity documentation array matching the target
 */
export const getEntityMarkdownDescription = (entity, target) => {
  return getEntityDescriptionsFromDocumentation(entity, 'markdown', target)[0];
};

/**
 * Gets the description of the given entity, recursively falling back to its parent's description if not set
 */
export const getEntityDescription = (entity, type, target) => {
  const entityDescriptions = getEntityDescriptionsFromDocumentation(entity, type, target);
  const mainEntityDescription = entityDescriptions.length ? entityDescriptions[0] : null;

  if (mainEntityDescription) {
    return mainEntityDescription;
  }

  if (!entity.parent) {
    return;
  }

  return getEntityDescription(getEntityByName(entity.parent), type, target);
};

/**
 * Gets the description of the given entity's property, falling back to the property's type description if not set
 */
export const getPropertyDescription = (entity, propertyName, type, target) => {
  const properties = getEntityProperties(entity);
  const property = properties[propertyName];

  if (property.description) {
    return property.description;
  }

  const typeEntity = getEntityByName(property.type);
  const entityDescriptions = getEntityDescriptionsFromDocumentation(typeEntity, type, target);
  return entityDescriptions.length ? entityDescriptions[0] : null;
};

/**
 * Gets the value of complex properties, like discriminators or arrays
 */
export const getPropertyValue = (entityName, property) => {
  if (property.type === 'discriminator') {
    return `${entityName.endsWith('Event') ? 'Event' : 'Context'}Types.enum.${entityName}`;
  }
  if (property.type === 'array') {
    return property.items.type;
  }
};
