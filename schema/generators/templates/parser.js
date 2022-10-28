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
exports.getTypes = exports.getEvents = exports.getContexts = exports.getEntities = exports.getEntity = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const entityNames = [
    ...Object.keys(base_schema_json_1.default.contexts),
    ...Object.keys(base_schema_json_1.default.events),
    'LocationStack',
    'GlobalContexts',
];
const ruleNames = [
    'RequiresLocationContext',
    'RequiresGlobalContext',
    'UniqueContext',
    'MatchContextProperty'
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
        get ownChildren() {
            let children = [];
            for (let [childName, { _parent }] of entitiesMap) {
                if (_parent === this.name) {
                    children.push(getEntity(childName));
                }
            }
            return children;
        }
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
            inheritedProperties = inheritedProperties.map((inheritedProperty) => {
                var _a;
                return (Object.assign(Object.assign({}, inheritedProperty), { _overridden: Object.keys((_a = this._properties) !== null && _a !== void 0 ? _a : []).find((propertyName) => propertyName === inheritedProperty.name) }));
            });
            return this._hydrateTypes(inheritedProperties);
        }
        get properties() {
            return this._mergeBy('name', this.inheritedProperties.map((inheritedProperty) => (Object.assign(Object.assign({}, inheritedProperty), { _inherited: true }))), this.ownProperties);
        }
        get ownRules() {
            return [
                ...this._rules,
                ...this.properties.reduce((rules, property) => {
                    var _a;
                    rules.push(...((_a = property._rules) !== null && _a !== void 0 ? _a : []));
                    return rules;
                }, []),
            ];
        }
        get inheritedRules() {
            let inheritedRules = [];
            this.parents.forEach((parent) => {
                inheritedRules = [...inheritedRules, ...parent.ownRules];
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
                var _a, _b;
                property.value = this._getPropertyValue(property);
                switch (property.type) {
                    case 'LocationStack':
                    case 'GlobalContexts':
                        const typeDefinition = getEntity(property.type);
                        return Object.assign(Object.assign({}, property), { description: typeDefinition.getDescription({ type: 'text', target: 'primary' }), _rules: (_b = (_a = typeDefinition === null || typeDefinition === void 0 ? void 0 : typeDefinition.validation) === null || _a === void 0 ? void 0 : _a.rules.map((rule) => (Object.assign(Object.assign({}, rule), { _inheritedFrom: property.type })))) !== null && _b !== void 0 ? _b : [] });
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
            (exclude === undefined || !exclude.includes(entity.name))) {
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
exports.getEntities = getEntities;
function getContexts(options) {
    return getEntities(Object.assign(Object.assign({}, options), { isContext: true }));
}
exports.getContexts = getContexts;
function getEvents(options) {
    return getEntities(Object.assign(Object.assign({}, options), { isEvent: true }));
}
exports.getEvents = getEvents;
const rulesMap = new Map();
ruleNames.forEach((rule) => {
});
const typesMap = new Map();
entityNames.forEach((entityName) => {
    var _a, _b;
    const entity = (_b = (_a = base_schema_json_1.default.contexts[entityName]) !== null && _a !== void 0 ? _a : base_schema_json_1.default.events[entityName]) !== null && _b !== void 0 ? _b : base_schema_json_1.default[entityName];
    if (entity.type) {
        typesMap.set(entityName, new (class {
            constructor() {
                var _a, _b;
                this.name = entityName;
                this.isLocationStack = entityName.startsWith('LocationStack');
                this.isGlobalContexts = entityName.endsWith('GlobalContexts');
                const { parent, properties } = entity, otherTypeProps = __rest(entity, ["parent", "properties"]);
                Object.assign(this, otherTypeProps);
                this._rules = (_b = (_a = entity === null || entity === void 0 ? void 0 : entity.validation) === null || _a === void 0 ? void 0 : _a.rules) !== null && _b !== void 0 ? _b : [];
            }
            get rules() {
                let rules = this._rules;
                rules.forEach((rule) => {
                });
                return rules;
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
        })());
    }
});
function getTypes(options) {
    const { isLocationStack, isGlobalContexts, exclude, include, sortBy } = options !== null && options !== void 0 ? options : {};
    const types = [];
    for (let [_, type] of typesMap) {
        if ((isLocationStack === undefined || isLocationStack === type.isContext) &&
            (isGlobalContexts === undefined || isGlobalContexts === type.isEvent) &&
            (exclude === undefined || !exclude.includes(type.name))) {
            types.push(type);
        }
        if (include !== undefined && include.includes(type.name)) {
            types.push(type);
        }
    }
    if (sortBy) {
        return types.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }
    return types;
}
exports.getTypes = getTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsOEVBQWdEO0FBTWhELE1BQU0sV0FBVyxHQUFHO0lBQ2xCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBVSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsZUFBZTtJQUNmLGdCQUFnQjtDQUNqQixDQUFDO0FBS0QsTUFBTSxTQUFTLEdBQUc7SUFDakIseUJBQXlCO0lBQ3pCLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2Ysc0JBQXNCO0NBQ3ZCLENBQUE7QUFLRCxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBSzlCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTs7SUFJakMsTUFBTSxNQUFNLGVBQUcsMEJBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLG1DQUFJLDBCQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxtQ0FBSSwwQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBSzFHLFdBQVcsQ0FBQyxHQUFHLENBQ2IsVUFBVSxFQUNWLElBQUksQ0FBQztRQXFCSDs7WUFaUyxTQUFJLEdBQUcsVUFBVSxDQUFDO1lBS2xCLGVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLGNBQVMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNDLFlBQU8sR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBTTlDLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxLQUEwQixNQUFNLEVBQTNCLGdCQUFnQixVQUFLLE1BQU0sRUFBcEQsd0JBQTJDLENBQVMsQ0FBQztZQUMzRCxNQUFN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