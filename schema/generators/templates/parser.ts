/*
 * Copyright 2022 Objectiv B.V.
 */

import BaseSchema from '../../base_schema.json';

/**
 * A list of entity names the parser will enrich and support.
 * This includes all Contexts, Events, LocationStack and GlobalContexts.
 */
const entityNames = [
  ...Object.keys(BaseSchema.contexts),
  ...Object.keys(BaseSchema.events),
  'LocationStack',
  'GlobalContexts',
];

/**
 * A global map fo all supported entities, by their name (_type).
 */
const entitiesMap = new Map();

/**
 * Process each supported entity and fill the entitiesMap with an enriched version of them.
 */
entityNames.forEach(entityName => {
  /**
   * Get the original entity definition from the BaseSchema
   */  
  const entity = BaseSchema.contexts[entityName] ?? BaseSchema.events[entityName] ?? BaseSchema[entityName];

  /**
   * Create a class out of the entity. Most properties are simply set in state, some are enriched.
   */  
  entitiesMap.set(entityName, new class {
    private readonly _parent;
    private readonly _properties;
    private readonly _rules;

    /**
     * To ease working with arrays of entities we set their name in a new `name` property.
     */  
    readonly name = entityName;

    /**
     * Enrich entity instance with some boolean flags identifying several characteristics of this entity.
     */  
    readonly isAbstract = entityName.startsWith('Abstract');
    readonly isContext = entityName.endsWith('Context');
    readonly isEvent = entityName.endsWith('Event');
    readonly isLocationStack = entityName === 'LocationStack';
    readonly isGlobalContexts = entityName === 'GlobalContexts';

    /**
     * Assigns the entity definition onto the instance itself, omitting some properties we are going to enrich.
     */  
    constructor() {
      const { parent, properties, ...otherEntityProps } = entity;
      Object.assign(this, otherEntityProps);
      this._parent = parent;
      this._properties = properties;
      this._rules = entity?.validation?.rules ?? [];
    }

    /**
     * Gets the parent entity of this entity, if any 
     */  
    get parent() {
      return getEntity(this._parent);
    }

    /**
     * Gets the parent hierarchy of this entity, sorted by highest to lowest in hierarchy. 
     */  
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

    /**
     * Gets a list of children of this entity. E.g. entities with `parent` set to this entity. 
     */  
    get children() {
      let children = [];
      for (let [childName, { parent }] of entitiesMap) {
        if (parent === entityName) {
          children.push(getEntity(childName))
        }
      }
      return children;
    }

    /**
     * Gets the list of properties directly defined in this entity, not inherited. 
     */  
    get ownProperties() {
      if(this._properties === undefined) {
        return [];
      }

      return this._hydrateTypes(Object.keys(this._properties).map(propertyName => ({
        name: propertyName,
        ...this._properties[propertyName]
      })))
    }

    /**
     * Gets the list of properties inherited from parents. Lower properties with the same name override higher ones. 
     */  
    get inheritedProperties() {
      let inheritedProperties = [];

      this.parents.forEach(parent => {
        inheritedProperties = this._mergeBy('name', inheritedProperties, this._namedObjectToArray(parent._properties));
      })

      return this._hydrateTypes(inheritedProperties);
    }

    /**
     * Gets all the properties of this entity, both inherited and its own. 
     */  
    get properties() {
      return this._mergeBy('name', this.inheritedProperties, this.ownProperties);
    }

    /**
     * Gets the list of rules directly defined in this entity, not inherited. 
     */  
    get ownRules() {
      return this._rules;
    }

    /**
     * Gets the list of rules inherited from parents. 
     */  
    get inheritedRules() {
      let inheritedRules = [];

      this.parents.forEach(parent => {
        inheritedRules = [...inheritedRules, ...parent._rules];
      })

      return inheritedRules;
    }

    /**
     * Gets all the rules of this entity, both inherited and its own. 
     */  
    get rules() {
      return [...this.inheritedRules, ...this.ownRules];
    }

    /**
     * Hydrates some known types (LocationStack, GlobalContexts) to their definition  
     */  
    private _hydrateTypes(properties: Array<any>) {
      return properties.map(property => {
        switch(property.type) {
          case 'LocationStack':
          case 'GlobalContexts':
            return {...property, ...getEntity(property.type)};
          default:
            return property;
        }
      })
    }

    /**
     * Converts a named object, e.g. each key corresponds to an entity, to an array where the key is set to its `name`.   
     */  
    private _namedObjectToArray(object) {
      if(object === undefined) {
        return [];
      }

      return Object.keys(object).map(key => ({
        name: key,
        ...object[key]
      }))
    }

    /**
     * Converts an array of named entities, e.g. each entity has a `name` property, to an object with `name` as key.   
     */  
    private _namedArrayToObject(array: Array<any>) {
      let object = {};

      array.forEach(item => {
        object[item.name] = item;
      })

      return object;
    }

    /**
     * Merges two arrays by comparing their given `propertyName`. Properties in B with the same name, will override A.
     */
    private _mergeBy (propertyName: string, propertiesA: Array<any>, propertiesB: Array<any>, ) {
      let mergedProperties = this._namedArrayToObject(propertiesA);

      propertiesB.forEach(property => {
        mergedProperties[property[propertyName]] = property;
      });

      return this._namedObjectToArray(mergedProperties);
    }
  })
})

export function getEntity(entityName) {
  return entitiesMap.get(entityName);
}
