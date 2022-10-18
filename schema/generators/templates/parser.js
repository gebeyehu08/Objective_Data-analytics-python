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
const entityNames = [
    ...Object.keys(base_schema_json_1.default.contexts),
    ...Object.keys(base_schema_json_1.default.events),
    ...Object.keys(base_schema_json_1.default),
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
            this.isLocationStack = entityName === 'LocationStack';
            this.isGlobalContexts = entityName === 'GlobalContexts';
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
            return this._hydrateProperties(Object.keys(this._properties).map(propertyName => (Object.assign({ name: propertyName }, this._properties[propertyName]))));
        }
        get inheritedProperties() {
            let inheritedProperties = [];
            this.parents.forEach(parent => {
                inheritedProperties = this._mergeBy('name', inheritedProperties, this._objectToArray(parent._properties));
            });
            return this._hydrateProperties(inheritedProperties);
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
        _hydrateProperties(properties) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsOEVBQWdEO0FBRWhELE1BQU0sV0FBVyxHQUFHO0lBQ2xCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBVSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUFVLENBQUM7Q0FDM0IsQ0FBQztBQUNGLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFFOUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTs7SUFDL0IsTUFBTSxNQUFNLGVBQUcsMEJBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLG1DQUFJLDBCQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxtQ0FBSSwwQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRTFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUk7UUFZOUI7O1lBUFMsU0FBSSxHQUFHLFVBQVUsQ0FBQztZQUNsQixlQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQyxjQUFTLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzQyxZQUFPLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxvQkFBZSxHQUFHLFVBQVUsS0FBSyxlQUFlLENBQUM7WUFDakQscUJBQWdCLEdBQUcsVUFBVSxLQUFLLGdCQUFnQixDQUFDO1lBRzFELE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxLQUEwQixNQUFNLEVBQTNCLGdCQUFnQixVQUFLLE1BQU0sRUFBcEQsd0JBQTJDLENBQVMsQ0FBQztZQUMz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