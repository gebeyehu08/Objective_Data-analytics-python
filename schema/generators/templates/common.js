"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyDescription = exports.getEntityDescription = exports.getEntityMarkdownDescription = exports.getEntityDescriptionFromDocumentation = exports.getEntityDescriptionsFromDocumentation = exports.getEntityOwnProperties = exports.getEntityProperties = exports.getParentProperties = exports.getChildren = exports.getEntityParents = exports.getEntityByName = exports.getEntityNames = exports.getEventNames = exports.getContextNames = exports.filterAbstractNames = exports.sortArrayByName = exports.getObjectKeys = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
exports.getObjectKeys = Object.keys;
exports.sortArrayByName = (array) => array.sort((a, b) => a.name.localeCompare(b.name));
exports.filterAbstractNames = (entityNames) => entityNames.filter((entityName) => !entityName.startsWith('Abstract'));
exports.getContextNames = () => exports.getObjectKeys(base_schema_json_1.default.contexts);
exports.getEventNames = () => exports.getObjectKeys(base_schema_json_1.default.events);
exports.getEntityNames = () => [...exports.getContextNames(), ...exports.getEventNames()];
exports.getEntityByName = (entityName) => { var _a, _b; return (_b = (_a = base_schema_json_1.default.contexts[entityName]) !== null && _a !== void 0 ? _a : base_schema_json_1.default.events[entityName]) !== null && _b !== void 0 ? _b : base_schema_json_1.default[entityName]; };
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
exports.getEntityOwnProperties = (entity) => {
    var _a;
    const properties = (_a = entity['properties']) !== null && _a !== void 0 ? _a : {};
    return properties;
};
exports.getEntityDescriptionsFromDocumentation = (entity, type, target) => {
    if (!entity.documentation) {
        return [];
    }
    return entity.documentation
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
};
exports.getEntityDescriptionFromDocumentation = (entity, type, target) => {
    return exports.getEntityDescriptionsFromDocumentation(entity, type, target)[0];
};
exports.getEntityMarkdownDescription = (entity, target) => {
    return exports.getEntityDescriptionsFromDocumentation(entity, 'markdown', target)[0];
};
exports.getEntityDescription = (entity, type, target) => {
    const entityDescriptions = exports.getEntityDescriptionsFromDocumentation(entity, type, target);
    const mainEntityDescription = entityDescriptions.length ? entityDescriptions[0] : null;
    if (mainEntityDescription) {
        return mainEntityDescription;
    }
    if (!entity.parent) {
        return;
    }
    return exports.getEntityDescription(exports.getEntityByName(entity.parent), type, target);
};
exports.getPropertyDescription = (entity, propertyName, type, target) => {
    const properties = exports.getEntityProperties(entity);
    const property = properties[propertyName];
    if (property.description) {
        return property.description;
    }
    const typeEntity = exports.getEntityByName(property.type);
    const entityDescriptions = exports.getEntityDescriptionsFromDocumentation(typeEntity, type, target);
    return entityDescriptions.length ? entityDescriptions[0] : null;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLDhFQUE4QztBQUtqQyxRQUFBLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBb0QsQ0FBQztBQUs1RSxRQUFBLGVBQWUsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBS2hGLFFBQUEsbUJBQW1CLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUNqRCxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUs1RCxRQUFBLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxxQkFBYSxDQUFDLDBCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFLekQsUUFBQSxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMscUJBQWEsQ0FBQywwQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBS3JELFFBQUEsY0FBYyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyx1QkFBZSxFQUFFLEVBQUUsR0FBRyxxQkFBYSxFQUFFLENBQUMsQ0FBQztBQUtsRSxRQUFBLGVBQWUsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLGtDQUM1QywwQkFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsbUNBQUksMEJBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLG1DQUFJLDBCQUFRLENBQUMsVUFBVSxDQUFDLEdBQUEsQ0FBQztBQUsxRSxRQUFBLGdCQUFnQixHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUs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