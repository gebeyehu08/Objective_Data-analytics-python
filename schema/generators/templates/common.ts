/*
 * Copyright 2022 Objectiv B.V.
 */

/**
 * TypeScript friendly Object.keys
 */
export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

/**
 * Sorts the given array of objects by their `name` property
 */
export const sortBy = (array, propertyName) => array.sort((a, b) => a[propertyName].localeCompare(b[propertyName]));

/**
 * TODO see if we can embed this logic in the parser as well
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
