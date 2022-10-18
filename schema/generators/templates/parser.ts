/*
 * Copyright 2022 Objectiv B.V.
 */

import BaseSchema from '../../base_schema.json';

/**
 * TypeScript friendly Object.keys
 */
export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

const entityNames = [...getObjectKeys(BaseSchema.contexts), ...getObjectKeys(BaseSchema.events)];
const entitiesMap = new Map();

entityNames.forEach(entityName => {
  const entity = BaseSchema.contexts[entityName] ?? BaseSchema.events[entityName];
  entitiesMap.set(entityName, new class {
    private readonly _parent;

    constructor() {
      const { parent, ...entityWithoutParentProperty } = entity;
      Object.assign(this, entityWithoutParentProperty);
      this._parent = parent;
    }

    name = entityName
    isAbstract = entityName.startsWith('Abstract')
    isContext = entityName.endsWith('Context')
    isEvent = entityName.endsWith('Event')

    get parent() {
      return getEntity(this._parent);
    }

    get parents() {
      const getEntityParents = (entity, parents = []) => {
        if (!entity.parent) {
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
        if(parent === entityName) {
          children.push(getEntity(childName))
        }
      }
      return children;
    }
  })
})

export function getEntity(entityName) {
  return entitiesMap.get(entityName)
}
