"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = exports.getContexts = exports.getEntities = exports.getEntity = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const entityNames = [
    ...Object.keys(base_schema_json_1.default.contexts),
    ...Object.keys(base_schema_json_1.default.events),
    'LocationStack',
    'GlobalContexts',
];
const entitiesMap = new Map();
entityNames.forEach((entityName) => {
    var _a, _b;
    const entity = (_b = (_a = base_schema_json_1.default.contexts[entityName]) !== null && _a !== void 0 ? _a : base_schema_json_1.default.events[entityName]) !== null && _b !== void 0 ? _b : base_schema_json_1.default[entityName];
    entitiesMap.set(entityName, new (class {
        constructor() {
            var _a, _b;
            this.name = entityName;
            this.isAbstract = entityName.startsWith('Abstract');
            this.isContext = entityName.endsWith('Context');
            this.isEvent = entityName.endsWith('Event');
            const { parent, properties } = entity, otherEntityProps = __rest(entity, ["parent", "properties"]);
            Object.assign(this, otherEntityProps);
            this._parent = parent;
            this._properties = properties;
            this._rules = (_b = (_a = entity === null || entity === void 0 ? void 0 : entity.validation) === null || _a === void 0 ? void 0 : _a.rules) !== null && _b !== void 0 ? _b : [];
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
            for (let [childName, { _parent }] of entitiesMap) {
                if (_parent === this.name) {
                    children.push(getEntity(childName));
                }
            }
            return children;
        }
        get isParent() {
            return this.children.length > 0;
        }
        get isLocationContext() {
            return this.parents.some((parent) => parent.name === 'AbstractLocationContext');
        }
        get isGlobalContext() {
            return this.parents.some((parent) => parent.name === 'AbstractGlobalContext');
        }
        get ownProperties() {
            if (this._properties === undefined) {
                return [];
            }
            return this._hydrateTypes(Object.keys(this._properties).map((propertyName) => (Object.assign({ name: propertyName }, this._properties[propertyName]))));
        }
        get inheritedProperties() {
            let inheritedProperties = [];
            this.parents.forEach((parent) => {
                inheritedProperties = this._mergeBy('name', inheritedProperties, this._namedObjectToArray(parent._properties));
            });
            return this._hydrateTypes(inheritedProperties);
        }
        get properties() {
            return this._mergeBy('name', this.inheritedProperties, this.ownProperties);
        }
        get ownRules() {
            return this._rules;
        }
        get inheritedRules() {
            let inheritedRules = [];
            this.parents.forEach((parent) => {
                inheritedRules = [...inheritedRules, ...parent._rules];
            });
            return inheritedRules;
        }
        get rules() {
            return [...this.inheritedRules, ...this.ownRules];
        }
        getDescription(options) {
            if (!this.documentation) {
                return null;
            }
            const { type, target } = options;
            const matchingDescriptions = this.documentation
                .filter((documentationBlock) => {
                if (type && target) {
                    return (documentationBlock === null || documentationBlock === void 0 ? void 0 : documentationBlock.type) === type && documentationBlock.target === target;
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
        _hydrateTypes(properties) {
            return properties.map((property) => {
                property.value = this._getPropertyValue(property);
                switch (property.type) {
                    case 'LocationStack':
                    case 'GlobalContexts':
                        const typeDefinition = getEntity(property.type);
                        return Object.assign(Object.assign({}, property), { description: typeDefinition.getDescription({ type: 'text', target: 'primary' }) });
                    default:
                        return property;
                }
            });
        }
        _namedObjectToArray(object) {
            if (object === undefined) {
                return [];
            }
            return Object.keys(object).map((key) => (Object.assign({ name: key }, object[key])));
        }
        _getPropertyValue(property) {
            if (property.type === 'discriminator') {
                return `${this.name.endsWith('Event') ? 'Event' : 'Context'}Types.enum.${this.name}`;
            }
            if (property.type === 'array') {
                return property.items.type;
            }
        }
        _namedArrayToObject(array) {
            let object = {};
            array.forEach((item) => {
                object[item.name] = item;
            });
            return object;
        }
        _mergeBy(propertyName, propertiesA, propertiesB) {
            let mergedProperties = this._namedArrayToObject(propertiesA);
            propertiesB.forEach((property) => {
                mergedProperties[property[propertyName]] = property;
            });
            return this._namedObjectToArray(mergedProperties);
        }
    })());
});
function getEntity(entityName) {
    return entitiesMap.get(entityName);
}
exports.getEntity = getEntity;
function getEntities(options) {
    const { isContext, isEvent, isAbstract, isParent, isLocationContext, isGlobalContext, exclude, include, sortBy } = options !== null && options !== void 0 ? options : {};
    const entities = [];
    for (let [_, entity] of entitiesMap) {
        if ((isContext === undefined || isContext === entity.isContext) &&
            (isEvent === undefined || isEvent === entity.isEvent) &&
            (isAbstract === undefined || isAbstract === entity.isAbstract) &&
            (isParent === undefined || isParent === entity.isParent) &&
            (isLocationContext === undefined || isLocationContext === entity.isLocationContext) &&
            (isGlobalContext === undefined || isGlobalContext === entity.isGlobalContext) &&
            (exclude === undefined || !exclude.includes(entity.name)) &&
            (include === undefined || include.includes(entity.name))) {
            entities.push(entity);
        }
    }
    if (sortBy) {
        return entities.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }
    return entities;
}
exports.getEntities = getEntities;
function getContexts(options) {
    return getEntities(Object.assign(Object.assign({}, options), { isContext: true }));
}
exports.getContexts = getContexts;
function getEvents(options) {
    return getEntities(Object.assign(Object.assign({}, options), { isEvent: true }));
}
exports.getEvents = getEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsOEVBQWdEO0FBTWhELE1BQU0sV0FBVyxHQUFHO0lBQ2xCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBVSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsZUFBZTtJQUNmLGdCQUFnQjtDQUNqQixDQUFDO0FBS0YsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUs5QixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7O0lBSWpDLE1BQU0sTUFBTSxlQUFHLDBCQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBSSwwQkFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsbUNBQUksMEJBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUsxRyxXQUFXLENBQUMsR0FBRyxDQUNiLFVBQVUsRUFDVixJQUFJLENBQUM7UUFxQkg7O1lBWlMsU0FBSSxHQUFHLFVBQVUsQ0FBQztZQUtsQixlQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQyxjQUFTLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQyxZQUFPLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQU05QyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsS0FBMEIsTUFBTSxFQUEzQixnQkFBZ0IsVUFBSyxNQUFNLEVBQXBELHdCQUEyQyxDQUFTLENBQUM7WUFDM0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZ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