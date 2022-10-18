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
entityNames.forEach(entityName => {
    var _a, _b;
    const entity = (_b = (_a = base_schema_json_1.default.contexts[entityName]) !== null && _a !== void 0 ? _a : base_schema_json_1.default.events[entityName]) !== null && _b !== void 0 ? _b : base_schema_json_1.default[entityName];
    entitiesMap.set(entityName, new class {
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
        get ownProperties() {
            if (this._properties === undefined) {
                return [];
            }
            return this._hydrateTypes(Object.keys(this._properties).map(propertyName => (Object.assign({ name: propertyName }, this._properties[propertyName]))));
        }
        get inheritedProperties() {
            let inheritedProperties = [];
            this.parents.forEach(parent => {
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
            this.parents.forEach(parent => {
                inheritedRules = [...inheritedRules, ...parent._rules];
            });
            return inheritedRules;
        }
        get rules() {
            return [...this.inheritedRules, ...this.ownRules];
        }
        _hydrateTypes(properties) {
            return properties.map(property => {
                switch (property.type) {
                    case 'LocationStack':
                    case 'GlobalContexts':
                        return Object.assign(Object.assign({}, property), getEntity(property.type));
                    default:
                        return property;
                }
            });
        }
        _namedObjectToArray(object) {
            if (object === undefined) {
                return [];
            }
            return Object.keys(object).map(key => (Object.assign({ name: key }, object[key])));
        }
        _namedArrayToObject(array) {
            let object = {};
            array.forEach(item => {
                object[item.name] = item;
            });
            return object;
        }
        _mergeBy(propertyName, propertiesA, propertiesB) {
            let mergedProperties = this._namedArrayToObject(propertiesA);
            propertiesB.forEach(property => {
                mergedProperties[property[propertyName]] = property;
            });
            return this._namedObjectToArray(mergedProperties);
        }
    });
});
function getEntity(entityName) {
    return entitiesMap.get(entityName);
}
exports.getEntity = getEntity;
function getEntities(options) {
    const { isContext, isEvent, isAbstract, isParent } = options !== null && options !== void 0 ? options : {};
    const entities = [];
    for (let [_, entity] of entitiesMap) {
        if ((isContext === undefined || isContext === entity.isContext) &&
            (isEvent === undefined || isEvent === entity.isEvent) &&
            (isAbstract === undefined || isAbstract === entity.isAbstract) &&
            (isParent === undefined || isParent === entity.isParent)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsOEVBQWdEO0FBTWhELE1BQU0sV0FBVyxHQUFHO0lBQ2xCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBVSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsZUFBZTtJQUNmLGdCQUFnQjtDQUNqQixDQUFDO0FBS0YsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUs5QixXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFOztJQUkvQixNQUFNLE1BQU0sZUFBRywwQkFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsbUNBQUksMEJBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLG1DQUFJLDBCQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFLMUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSTtRQW9COUI7O1lBWlMsU0FBSSxHQUFHLFVBQVUsQ0FBQztZQUtsQixlQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQyxjQUFTLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQyxZQUFPLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQU05QyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsS0FBMEIsTUFBTSxFQUEzQixnQkFBZ0IsVUFBSyxNQUFNLEVBQXBELHdCQUEyQyxDQUFTLENBQUM7WUFDM0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QixJQUFJ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