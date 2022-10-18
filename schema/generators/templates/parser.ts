/*
 * Copyright 2022 Objectiv B.V.
 */

import BaseSchema from '../../base_schema.json';

const entityNames = [...Object.keys(BaseSchema.contexts), ...Object.keys(BaseSchema.events)];
const entitiesMap = new Map();

entityNames.forEach(entityName => {
  const entity = BaseSchema.contexts[entityName] ?? BaseSchema.events[entityName];
  entitiesMap.set(entityName, new class {
    private readonly _parent;
    private readonly _properties;
    readonly name = entityName
    readonly isAbstract = entityName.startsWith('Abstract')
    readonly isContext = entityName.endsWith('Context')
    readonly isEvent = entityName.endsWith('Event')

    constructor() {
      const { parent, properties, ...otherEntityProps } = entity;
      Object.assign(this, otherEntityProps);
      this._parent = parent;
      this._properties = properties;
    }

    get parent() {
      return getEntity(this._parent);
    }

    get parents() {
      const getEntityParents = (entity, parents = []) => {
        if (!entity._parent) {
          return parents;
        }

        const parentEntity = getEntity(entity._parent);
        parents.unshift(parentEntity);

        return getEntityParents(parentEntity, parents);
      };

      return getEntityParents(this);
    }

    get children() {
      let children = [];
      for (let [childName, { parent }] of entitiesMap) {
        if (parent === entityName) {
          children.push(getEntity(childName))
        }
      }
      return children;
    }

    private _objectToArray(object) {
      if(object === undefined) {
        return [];
      }

      return Object.keys(object).map(key => ({
        name: key,
        ...object[key]
      }))
    }

    private _arrayToObject(array: Array<{ name: string }>) {
      let object = {};

      array.forEach(item => {
        object[item.name] = item;
      })

      return object;
    }

    private _mergeByName (propertiesA: Array<{ name: string }>, propertiesB: Array<{ name: string }>) {
      let mergedProperties = this._arrayToObject(propertiesA);

      propertiesB.forEach(property => {
        mergedProperties[property.name] = property;
      });

      return this._objectToArray(mergedProperties);
    }

    get ownProperties() {
      if(this._properties === undefined) {
        return [];
      }

      return Object.keys(this._properties).map(propertyName => ({
        name: propertyName,
        ...this._properties[propertyName]
      }))
    }

    get parentProperties() {
      let parentProperties = [];

      this.parents.forEach(parent => {
        parentProperties = this._mergeByName(parentProperties, this._objectToArray(parent._properties));
      })

      return parentProperties;
    }

    get properties() {
      return this._mergeByName(this.parentProperties, this.ownProperties);
    }
  })
})

export function getEntity(entityName) {
  return entitiesMap.get(entityName)
}
