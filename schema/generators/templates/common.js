"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyDescription = exports.getEntityDescription = exports.getEntityProperties = exports.getParentProperties = exports.getChildren = exports.getEntityParents = exports.getEntityByName = exports.getEntityNames = exports.getEventNames = exports.getContextNames = exports.filterAbstractNames = exports.sortArrayByName = exports.getObjectKeys = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
exports.getObjectKeys = Object.keys;
exports.sortArrayByName = (array) => array.sort((a, b) => a.name.localeCompare(b.name));
exports.filterAbstractNames = (entityNames) => entityNames.filter((entityName) => !entityName.startsWith('Abstract'));
exports.getContextNames = () => exports.getObjectKeys(base_schema_json_1.default.contexts);
exports.getEventNames = () => exports.getObjectKeys(base_schema_json_1.default.events);
exports.getEntityNames = () => [...exports.getContextNames(), ...exports.getEventNames()];
exports.getEntityByName = (entityName) => { var _a; return (_a = base_schema_json_1.default.contexts[entityName]) !== null && _a !== void 0 ? _a : base_schema_json_1.default.events[entityName]; };
exports.getEntityParents = (entity, parents = []) => {
    const parentEntityName = entity['parent'];
    if (!parentEntityName) {
        return parents;
    }
    parents.push(parentEntityName);
    return exports.getEntityParents(exports.getEntityByName(parentEntityName), parents);
};
exports.getChildren = (parentEntity) => exports.getEntityNames().filter((entityName) => {
    const entity = exports.getEntityByName(entityName);
    const parents = exports.getEntityParents(entity);
    return parents.includes(parentEntity);
});
exports.getParentProperties = (parents, properties = {}) => parents.reduce((properties, parent) => {
    var _a;
    const parentEntity = exports.getEntityByName(parent);
    const parentProperties = (_a = parentEntity['properties']) !== null && _a !== void 0 ? _a : {};
    const parentParents = exports.getEntityParents(parentEntity);
    const parentPropertyKeys = exports.getObjectKeys(parentProperties);
    parentPropertyKeys.forEach((parentPropertyKey) => {
        const parentProperty = parentProperties[parentPropertyKey];
        if (properties[parentPropertyKey] === undefined) {
            properties[parentPropertyKey] = parentProperty;
        }
    });
    if (!parentParents.length) {
        return properties;
    }
    return exports.getParentProperties(parentParents, properties);
}, properties);
exports.getEntityProperties = (entity) => {
    var _a;
    const parents = exports.getEntityParents(entity);
    const properties = (_a = entity['properties']) !== null && _a !== void 0 ? _a : {};
    return exports.getParentProperties(parents, properties);
};
exports.getEntityDescription = (entity) => {
    if (entity.description) {
        return entity.description;
    }
    if (!entity.parent) {
        return;
    }
    return exports.getEntityDescription(exports.getEntityByName(entity.parent));
};
exports.getPropertyDescription = (entity, propertyName) => {
    var _a, _b;
    const properties = exports.getEntityProperties(entity);
    const property = properties[propertyName];
    return (_a = property.description) !== null && _a !== void 0 ? _a : (_b = base_schema_json_1.default[property.type]) === null || _b === void 0 ? void 0 : _b.description;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLDhFQUE4QztBQUtqQyxRQUFBLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBb0QsQ0FBQztBQUs1RSxRQUFBLGVBQWUsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBS2hGLFFBQUEsbUJBQW1CLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUNqRCxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUs1RCxRQUFBLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxxQkFBYSxDQUFDLDBCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFLekQsUUFBQSxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMscUJBQWEsQ0FBQywwQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBS3JELFFBQUEsY0FBYyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyx1QkFBZSxFQUFFLEVBQUUsR0FBRyxxQkFBYSxFQUFFLENBQUMsQ0FBQztBQUtsRSxRQUFBLGVBQWUsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLHdCQUFDLDBCQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBSSwwQkFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBQSxDQUFDO0FBSy9GLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRSxFQUFFO0lBQ3ZELE1BQU0sZ0JBQWdCLEdBQUcs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