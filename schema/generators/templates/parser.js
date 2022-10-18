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
    const { isContext, isEvent, isAbstract, isParent, isLocationContext, isGlobalContext } = options !== null && options !== void 0 ? options : {};
    const entities = [];
    for (let [_, entity] of entitiesMap) {
        if ((isContext === undefined || isContext === entity.isContext) &&
            (isEvent === undefined || isEvent === entity.isEvent) &&
            (isAbstract === undefined || isAbstract === entity.isAbstract) &&
            (isParent === undefined || isParent === entity.isParent) &&
            (isLocationContext === undefined || isLocationContext === entity.isLocationContext) &&
            (isGlobalContext === undefined || isGlobalContext === entity.isGlobalContext)) {
            entities.push(entity);
        }
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