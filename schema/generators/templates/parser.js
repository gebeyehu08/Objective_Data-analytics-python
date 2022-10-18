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
exports.getEntity = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const entityNames = [...Object.keys(base_schema_json_1.default.contexts), ...Object.keys(base_schema_json_1.default.events)];
const entitiesMap = new Map();
entityNames.forEach(entityName => {
    var _a;
    const entity = (_a = base_schema_json_1.default.contexts[entityName]) !== null && _a !== void 0 ? _a : base_schema_json_1.default.events[entityName];
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
            for (let [childName, { parent }] of entitiesMap) {
                if (parent === entityName) {
                    children.push(getEntity(childName));
                }
            }
            return children;
        }
        get ownProperties() {
            if (this._properties === undefined) {
                return [];
            }
            return Object.keys(this._properties).map(propertyName => (Object.assign({ name: propertyName }, this._properties[propertyName])));
        }
        get inheritedProperties() {
            let inheritedProperties = [];
            this.parents.forEach(parent => {
                inheritedProperties = this._mergeBy('name', inheritedProperties, this._objectToArray(parent._properties));
            });
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
            });
            return inheritedRules;
        }
        get rules() {
            return [...this.inheritedRules, ...this.ownRules];
        }
        _objectToArray(object) {
            if (object === undefined) {
                return [];
            }
            return Object.keys(object).map(key => (Object.assign({ name: key }, object[key])));
        }
        _arrayToObject(array) {
            let object = {};
            array.forEach(item => {
                object[item.name] = item;
            });
            return object;
        }
        _mergeBy(propertyName, propertiesA, propertiesB) {
            let mergedProperties = this._arrayToObject(propertiesA);
            propertiesB.forEach(property => {
                mergedProperties[property[propertyName]] = property;
            });
            return this._objectToArray(mergedProperties);
        }
    });
});
function getEntity(entityName) {
    return entitiesMap.get(entityName);
}
exports.getEntity = getEntity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsOEVBQWdEO0FBRWhELE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3RixNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRTlCLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7O0lBQy9CLE1BQU0sTUFBTSxTQUFHLDBCQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBSSwwQkFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVoRixXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJO1FBVTlCOztZQUxTLFNBQUksR0FBRyxVQUFVLENBQUE7WUFDakIsZUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDOUMsY0FBUyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDMUMsWUFBTyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7WUFHN0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEtBQTBCLE1BQU0sRUFBM0IsZ0JBQWdCLFVBQUssTUFBTSxFQUFwRCx3QkFBMkMsQ0FBUyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sZUFBRyxN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