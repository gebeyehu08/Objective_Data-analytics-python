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
entityNames.forEach((entityName) => {
  /**
   * Get the original entity definition from the BaseSchema
   */
  const entity = BaseSchema.contexts[entityName] ?? BaseSchema.events[entityName] ?? BaseSchema[entityName];

  /**
   * Create a class out of the entity. Most properties are simply set in state, some are enriched.
   */
  entitiesMap.set(
    entityName,
    new (class {
      private readonly _parent;
      private readonly _properties;
      private readonly _rules;
      readonly documentation;
      readonly type;

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
      get ownChildren() {
        let children = [];
        for (let [childName, { _parent }] of entitiesMap) {
          if (_parent === this.name) {
            children.push(getEntity(childName));
          }
        }
        return children;
      }

      /**
       * Gets a list of all children of this entity. E.g. also children of children, recursively.
       */
      get children() {
        const getEntityChildren = (entity, children = []) => {
          const ownChildren = entity.ownChildren;

          if (!ownChildren.length) {
            return children;
          }

          children.push(...ownChildren);

          ownChildren.forEach((ownChild) => {
            getEntityChildren(ownChild, children);
          });

          return children;
        };

        return getEntityChildren(this);
      }

      /**
       * Gets whether this entity has at least one child.
       */
      get isParent() {
        return this.children.length > 0;
      }

      /**
       * Gets whether this entity is a Location Context.
       */
      get isLocationContext() {
        return this.parents.some((parent) => parent.name === 'AbstractLocationContext');
      }

      /**
       * Gets whether this entity is a Global Context.
       */
      get isGlobalContext() {
        return this.parents.some((parent) => parent.name === 'AbstractGlobalContext');
      }

      /**
       * Gets whether this entity is a Type.
       */
      get isType() {
        return this.type !== undefined;
      }

      /**
       * Gets the list of properties directly defined in this entity, not inherited.
       */
      get ownProperties() {
        if (this._properties === undefined) {
          return [];
        }

        return this._hydrateTypes(
          Object.keys(this._properties).map((propertyName) => ({
            name: propertyName,
            ...this._properties[propertyName],
          }))
        );
      }

      /**
       * Gets the list of properties inherited from parents. Lower properties with the same name override higher ones.
       */
      get inheritedProperties() {
        let inheritedProperties = [];

        this.parents.forEach((parent) => {
          inheritedProperties = this._mergeBy(
            'name',
            inheritedProperties,
            this._namedObjectToArray(parent._properties)
          );
        });

        inheritedProperties = inheritedProperties.map((inheritedProperty) => ({
          ...inheritedProperty,
          _overridden: Object.keys(this._properties ?? []).find(
            (propertyName) => propertyName === inheritedProperty.name
          ),
        }));

        return this._hydrateTypes(inheritedProperties);
      }

      /**
       * Gets all the properties of this entity, both inherited and its own.
       */
      get properties() {
        return this._mergeBy(
          'name',
          this.inheritedProperties.map((inheritedProperty) => ({
            ...inheritedProperty,
            _inherited: true,
          })),
          this.ownProperties
        );
      }

      /**
       * Gets the list of rules directly defined in this entity, not inherited.
       */
      get ownRules() {
        return [
          ...this._rules,
          ...this.properties.reduce((rules, property) => {
            rules.push(...(property._rules ?? []));
            return rules;
          }, []),
        ];
      }

      /**
       * Gets the list of rules inherited from parents and properties.
       */
      get inheritedRules() {
        let inheritedRules = [];

        this.parents.forEach((parent) => {
          inheritedRules = [...inheritedRules, ...parent.ownRules];
        });

        return inheritedRules;
      }

      /**
       * Gets all the rules of this entity, both inherited and its own.
       */
      get rules() {
        return [...this.inheritedRules, ...this.ownRules];
      }

      /**
       * Gets a documentation description by specifying `type` and `target`.
       * Types: 'text' or 'markdown'
       * Targets: 'primary', 'secondary', 'admonition'
       */
      getDescription(options: { type: 'text' | 'markdown'; target: 'primary' | 'secondary' | 'admonition' }) {
        if (!this.documentation) {
          return null;
        }

        const { type, target } = options;

        const matchingDescriptions = this.documentation
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

        if (!matchingDescriptions.length) {
          return null;
        }

        return matchingDescriptions[0];
      }

      /**
       * Hydrates some known types (LocationStack, GlobalContexts) to their definition and processes values.
       */
      private _hydrateTypes(properties: Array<any>) {
        return properties.map((property) => {
          property.value = this._getPropertyValue(property);
          switch (property.type) {
            case 'LocationStack':
            case 'GlobalContexts':
              const typeDefinition = getEntity(property.type);
              return {
                ...property,
                // Enrich with description from type definition. Text primary, since properties have no markdowns.
                description: typeDefinition.getDescription({ type: 'text', target: 'primary' }),
                // Flatten validation.rules block onto _rules.
                _rules:
                  typeDefinition?.validation?.rules.map((rule) => ({ ...rule, _inheritedFrom: property.type })) ?? [],
              };
            default:
              return property;
          }
        });
      }

      /**
       * Converts a named object, e.g. key:name > entity, to an array where the key is set to its `name`.
       */
      private _namedObjectToArray(object) {
        if (object === undefined) {
          return [];
        }

        return Object.keys(object).map((key) => ({
          name: key,
          ...object[key],
        }));
      }

      /**
       * Gets the value of complex properties, like discriminators or arrays.
       */
      private _getPropertyValue(property) {
        if (property.type === 'discriminator') {
          return `${this.name.endsWith('Event') ? 'Event' : 'Context'}Types.enum.${this.name}`;
        }
        if (property.type === 'array') {
          return property.items.type;
        }
      }

      /**
       * Converts an array of named entities, e.g. each entity has a `name` property, to an object with `name` as key.
       */
      private _namedArrayToObject(array: Array<any>) {
        let object = {};

        array.forEach((item) => {
          object[item.name] = item;
        });

        return object;
      }

      /**
       * Merges two arrays by comparing their given `propertyName`. Properties in B with the same name, will override A.
       */
      private _mergeBy(propertyName: string, propertiesA: Array<any>, propertiesB: Array<any>) {
        let mergedProperties = this._namedArrayToObject(propertiesA);

        propertiesB.forEach((property) => {
          mergedProperties[property[propertyName]] = property;
        });

        return this._namedObjectToArray(mergedProperties);
      }
    })()
  );
});

/**
 * Gets an entity from the BaseSchema, enriched with some extra attributes and getter functions to ease its usage.
 */
export function getEntity(entityName) {
  return entitiesMap.get(entityName);
}

/**
 * Gets a list of enriched entities from the BaseSchema. By default, returns all supported entities.
 * Optionally supports filtering by: isContext, isEvent, isAbstract.
 */
export function getEntities(options?: {
  isContext?: boolean;
  isEvent?: boolean;
  isAbstract?: boolean;
  isParent?: boolean;
  isLocationContext?: boolean;
  isGlobalContext?: boolean;
  isType?: boolean;
  exclude?: Array<string>;
  include?: Array<string>;
  sortBy?: string;
}) {
  const {
    isContext,
    isEvent,
    isAbstract,
    isParent,
    isLocationContext,
    isGlobalContext,
    isType,
    exclude,
    include,
    sortBy,
  } = options ?? {};
  const entities = [];

  for (let [_, entity] of entitiesMap) {
    if (
      (isContext === undefined || isContext === entity.isContext) &&
      (isEvent === undefined || isEvent === entity.isEvent) &&
      (isAbstract === undefined || isAbstract === entity.isAbstract) &&
      (isParent === undefined || isParent === entity.isParent) &&
      (isLocationContext === undefined || isLocationContext === entity.isLocationContext) &&
      (isGlobalContext === undefined || isGlobalContext === entity.isGlobalContext) &&
      (isType === undefined || isType === entity.isType) &&
      (exclude === undefined || !exclude.includes(entity.name))
    ) {
      entities.push(entity);
    }

    if (include !== undefined && include.includes(entity.name)) {
      entities.push(entity);
    }
  }

  if (sortBy) {
    return entities.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }

  return entities;
}

/**
 * Shorthand to get a list of enriched Context entities from the BaseSchema. By default, returns all Contexts.
 * Optionally supports filtering by: isAbstract and isParent.
 */
export function getContexts(options?: {
  isAbstract?: boolean;
  isParent?: boolean;
  isLocationContext?: boolean;
  isGlobalContext?: boolean;
  exclude?: Array<string>;
  include?: Array<string>;
  sortBy?: string;
}) {
  return getEntities({ ...options, isContext: true });
}

/**
 * Shorthand to get a list of enriched Event entities from the BaseSchema. By default, returns all Events.
 * Optionally supports filtering by: isAbstract and isParent.
 */
export function getEvents(options?: {
  isAbstract?: boolean;
  isParent?: boolean;
  exclude?: Array<string>;
  include?: Array<string>;
  sortBy?: string;
}) {
  return getEntities({ ...options, isEvent: true });
}

/**
 * Gets a list of enriched types from the BaseSchema. By default, returns all supported types.
 */
export function getTypes(options?: {
  isLocationStack?: boolean;
  isGlobalContexts?: boolean;
  exclude?: Array<string>;
  include?: Array<string>;
  sortBy?: string;
}) {
  return getEntities({ ...options, isType: true });
}
