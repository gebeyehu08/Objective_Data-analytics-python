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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsOEVBQWdEO0FBTWhELE1BQU0sV0FBVyxHQUFHO0lBQ2xCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBVSxDQUFDLFFBQVEsQ0FBQztJQUNuQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsZUFBZTtJQUNmLGdCQUFnQjtDQUNqQixDQUFDO0FBS0QsTUFBTSxTQUFTLEdBQUc7SUFDakIseUJBQXlCO0lBQ3pCLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2Ysc0JBQXNCO0NBQ3ZCLENBQUE7QUFLRCxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBSzlCLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTs7SUFJakMsTUFBTSxNQUFNLGVBQUcsMEJBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLG1DQUFJLDBCQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxtQ0FBSSwwQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBSzFHLFdBQVcsQ0FBQyxHQUFHLENBQ2IsVUFBVSxFQUNWLElBQUksQ0FBQztRQXFCSDs7WUFaUyxTQUFJLEdBQUcsVUFBVSxDQUFDO1lBS2xCLGVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLGNBQVMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNDLFlBQU8sR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBTTlDLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxLQUEwQixNQUFNLEVBQTNCLGdCQUFnQixVQUFLLE1BQU0sRUFBcEQsd0JBQTJDLENBQVMsQ0FBQztZQUMzRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLGVBQUcsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFVBQVUsMENBQUUsS0FBSyxtQ0FBSSxFQUFFLENBQUM7UUFDaEQsQ0FBQztRQUtELElBQUksTUFBTTtZQUNSLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBS0QsSUFBSSxPQUFPO1lBQ1QsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO29CQUNuQixPQUFPLE9BQU8sQ0FBQztpQkFDaEI7Z0JBRUQsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFFOUIsT0FBTyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDO1lBRUYsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBS0QsSUFBSSxXQUFXO1lBQ2IsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksV0FBVyxFQUFFO2dCQUNoRCxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUN6QixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUNyQzthQUNGO1lBQ0QsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUtELElBQUksUUFBUTtZQUNWLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxHQUFHLEVBQUUsRUFBRSxFQUFFO2dCQUNsRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUV2QyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtvQkFDdkIsT0FBTyxRQUFRLENBQUM7aUJBQ2pCO2dCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQztnQkFFOUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO29CQUMvQixpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3hDLENBQUMsQ0FBQyxDQUFDO2dCQUVILE9BQU8sUUFBUSxDQUFDO1lBQ2xCLENBQUMsQ0FBQztZQUVGLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUtELElBQUksUUFBUTtZQUNWLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFLRCxJQUFJLGlCQUFpQjtZQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLHlCQUF5QixDQUFDLENBQUM7UUFDbEYsQ0FBQztRQUtELElBQUksZUFBZTtZQUNqQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLHVCQUF1QixDQUFDLENBQUM7UUFDaEYsQ0FBQztRQUtELElBQUksYUFBYTtZQUNmLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsaUJBQ2xELElBQUksRUFBRSxZQUFZLElBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsRUFDakMsQ0FBQyxDQUNKLENBQUM7UUFDSixDQUFDO1FBS0QsSUFBSSxtQkFBbUI7WUFDckIsSUFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFFN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDOUIsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FDakMsTUFBTSxFQUNOLG1CQUFtQixFQUNuQixJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUM3QyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBS0QsSUFBSSxVQUFVO1lBQ1osT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFLRCxJQUFJLFFBQVE7WUFDVixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQztRQUtELElBQUksY0FBYztZQUNoQixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7WUFFeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDOUIsY0FBYyxHQUFHLENBQUMsR0FBRyxjQUFjLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLGNBQWMsQ0FBQztRQUN4QixDQUFDO1FBS0QsSUFBSSxLQUFLO1lBQ1AsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBT0QsY0FBYyxDQUFDLE9BQXNGO1lBQ25HLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN2QixPQUFPLElBQUksQ0FBQzthQUNiO1lBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUM7WUFFakMsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsYUFBYTtpQkFDNUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDN0IsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFO29CQUNsQixPQUFPLENBQUEsa0JBQWtCLGFBQWxCLGtCQUFrQix1QkFBbEIsa0JBQWtCLENBQUUsSUFBSSxNQUFLLElBQUksSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO2lCQUNsRjtnQkFDRCxJQUFJLElBQUksRUFBRTtvQkFDUixPQUFPLGtCQUFrQixDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7aUJBQ3pDO2dCQUNELElBQUksTUFBTSxFQUFFO29CQUNWLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQztpQkFDN0M7Z0JBQ0QsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLENBQUM7aUJBQ0QsR0FBRyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRS9ELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hDLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxPQUFPLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFLTyxhQUFhLENBQUMsVUFBc0I7WUFDMUMsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2pDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNsRCxRQUFRLFFBQVEsQ0FBQyxJQUFJLEVBQUU7b0JBQ3JCLEtBQUssZUFBZSxDQUFDO29CQUNyQixLQUFLLGdCQUFnQjt3QkFDbkIsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDaEQsdUNBQ0ssUUFBUSxLQUVYLFdBQVcsRUFBRSxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsSUFDL0U7b0JBQ0o7d0JBQ0UsT0FBTyxRQUFRLENBQUM7aUJBQ25CO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBS08sbUJBQW1CLENBQUMsTUFBTTtZQUNoQyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxpQkFDdEMsSUFBSSxFQUFFLEdBQUcsSUFDTixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQ2QsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUtPLGlCQUFpQixDQUFDLFFBQVE7WUFDaEMsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBRTtnQkFDckMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsY0FBYyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDdEY7WUFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUM3QixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQzVCO1FBQ0gsQ0FBQztRQUtPLG1CQUFtQixDQUFDLEtBQWlCO1lBQzNDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUVoQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUtPLFFBQVEsQ0FBQyxZQUFvQixFQUFFLFdBQXVCLEVBQUUsV0FBdUI7WUFDckYsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFN0QsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUMvQixnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BELENBQUM7S0FDRixDQUFDLEVBQUUsQ0FDTCxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFLSCxTQUFnQixTQUFTLENBQUMsVUFBVTtJQUNsQyxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckMsQ0FBQztBQUZELDhCQUVDO0FBTUQsU0FBZ0IsV0FBVyxDQUFDLE9BVTNCO0lBQ0MsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FDOUcsT0FBTyxhQUFQLE9BQU8sY0FBUCxPQUFPLEdBQUksRUFBRSxDQUFDO0lBQ2hCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUVwQixLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksV0FBVyxFQUFFO1FBQ25DLElBQ0UsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQzNELENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNyRCxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDOUQsQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3hELENBQUMsaUJBQWlCLEtBQUssU0FBUyxJQUFJLGlCQUFpQixLQUFLLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztZQUNuRixDQUFDLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDN0UsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDekQ7WUFDQSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZCO1FBRUQsSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFELFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkI7S0FDRjtJQUVELElBQUksTUFBTSxFQUFFO1FBQ1YsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BFO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQXRDRCxrQ0FzQ0M7QUFNRCxTQUFnQixXQUFXLENBQUMsT0FRM0I7SUFDQyxPQUFPLFdBQVcsaUNBQU0sT0FBTyxLQUFFLFNBQVMsRUFBRSxJQUFJLElBQUcsQ0FBQztBQUN0RCxDQUFDO0FBVkQsa0NBVUM7QUFNRCxTQUFnQixTQUFTLENBQUMsT0FNekI7SUFDQyxPQUFPLFdBQVcsaUNBQU0sT0FBTyxLQUFFLE9BQU8sRUFBRSxJQUFJLElBQUcsQ0FBQztBQUNwRCxDQUFDO0FBUkQsOEJBUUM7QUFLRCxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBSzNCLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtBQUUzQixDQUFDLENBQUMsQ0FBQztBQUtGLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFLNUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFOztJQUloQyxNQUFNLE1BQU0sZUFBRywwQkFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsbUNBQUksMEJBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLG1DQUFJLDBCQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUcsSUFBRyxNQUFNLENBQUMsSUFBSSxFQUFFO1FBQ2YsUUFBUSxDQUFDLEdBQUcsQ0FDVixVQUFVLEVBQ1YsSUFBSSxDQUFDO1lBa0JIOztnQkFYUyxTQUFJLEdBQUcsVUFBVSxDQUFDO2dCQUtsQixvQkFBZSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3pELHFCQUFnQixHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFNaEUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEtBQXdCLE1BQU0sRUFBekIsY0FBYyxVQUFLLE1BQU0sRUFBbEQsd0JBQXlDLENBQVMsQ0FBQztnQkFDekQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxNQUFNLGVBQUcsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFVBQVUsMENBQUUsS0FBSyxtQ0FBSSxFQUFFLENBQUM7WUFDaEQsQ0FBQztZQUtELElBQUksS0FBSztnQkFDUCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN4QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBRXZCLENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQztZQU9ELGNBQWMsQ0FBQyxPQUFzRjtnQkFDbkcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3ZCLE9BQU8sSUFBSSxDQUFDO2lCQUNiO2dCQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDO2dCQUVqQyxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxhQUFhO3FCQUM1QyxNQUFNLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO29CQUM3QixJQUFJLElBQUksSUFBSSxNQUFNLEVBQUU7d0JBQ2xCLE9BQU8sQ0FBQSxrQkFBa0IsYUFBbEIsa0JBQWtCLHVCQUFsQixrQkFBa0IsQ0FBRSxJQUFJLE1BQUssSUFBSSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUM7cUJBQ2xGO29CQUNELElBQUksSUFBSSxFQUFFO3dCQUNSLE9BQU8sa0JBQWtCLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztxQkFDekM7b0JBQ0QsSUFBSSxNQUFNLEVBQUU7d0JBQ1YsT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDO3FCQUM3QztvQkFDRCxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDLENBQUM7cUJBQ0QsR0FBRyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUUvRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO29CQUNoQyxPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFFRCxPQUFPLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7U0FDRixDQUFDLEVBQUUsQ0FDTCxDQUFDO0tBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUtILFNBQWdCLFFBQVEsQ0FBQyxPQU14QjtJQUNDLE1BQU0sRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxPQUFPLGFBQVAsT0FBTyxjQUFQLE9BQU8sR0FBSSxFQUFFLENBQUM7SUFDdEYsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBRWpCLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxRQUFRLEVBQUU7UUFDOUIsSUFDRSxDQUFDLGVBQWUsS0FBSyxTQUFTLElBQUksZUFBZSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDckUsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLElBQUksZ0JBQWdCLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNyRSxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUN2RDtZQUNBLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEI7UUFFRCxJQUFJLE9BQU8sS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQjtLQUNGO0lBRUQsSUFBSSxNQUFNLEVBQUU7UUFDVixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakU7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUE3QkQsNEJBNkJDIn0=