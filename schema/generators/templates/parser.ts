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
    private readonly _rules;

    readonly name = entityName
    readonly isAbstract = entityName.startsWith('Abstract')
    readonly isContext = entityName.endsWith('Context')
    readonly isEvent = entityName.endsWith('Event')

    constructor() {
      const { parent, properties, ...otherEntityProps } = entity;
      Object.assign(this, otherEntityProps);
      this._parent = parent;
      this._properties = properties;
      this._rules = entity?.validation?.rules ?? [];
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

    get ownProperties() {
      if(this._properties === undefined) {
        return [];
      }

      return Object.keys(this._properties).map(propertyName => ({
        name: propertyName,
        ...this._properties[propertyName]
      }))
    }

    get inheritedProperties() {
      let inheritedProperties = [];

      this.parents.forEach(parent => {
        inheritedProperties = this._mergeBy('name', inheritedProperties, this._objectToArray(parent._properties));
      })

      return inheritedProperties;
    }

    get properties() {
      return this._mergeBy('name', this.inheritedProperties, this.ownProperties);
    }

    get ownRules() {
      return this._rules;
    }

    get inheritedRules() {
      let inheritedRules = [];

      this.parents.forEach(parent => {
        inheritedRules = [...inheritedRules, ...parent._rules];
      })

      return inheritedRules;
    }

    get rules() {
      return [...this.inheritedRules, ...this.ownRules];
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

    private _arrayToObject(array: Array<any>) {
      let object = {};

      array.forEach(item => {
        object[item.name] = item;
      })

      return object;
    }

    private _mergeBy (propertyName: string, propertiesA: Array<any>, propertiesB: Array<any>, ) {
      let mergedProperties = this._arrayToObject(propertiesA);

      propertiesB.forEach(property => {
        mergedProperties[property[propertyName]] = property;
      });

      return this._objectToArray(mergedProperties);
    }
  })
})

export function getEntity(entityName) {
  return entitiesMap.get(entityName)
}
