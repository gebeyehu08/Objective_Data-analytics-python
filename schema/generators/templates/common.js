"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyDescription = exports.getEntityDescription = exports.getEntityMarkdownDescription = exports.getEntityDescriptionFromDocumentation = exports.getEntityDescriptionsFromDocumentation = exports.getEntityProperties = exports.getParentProperties = exports.getChildren = exports.getEntityParents = exports.getEntityByName = exports.getEntityNames = exports.getEventNames = exports.getContextNames = exports.filterAbstractNames = exports.sortArrayByName = exports.getObjectKeys = void 0;
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
exports.getEntityDescriptionsFromDocumentation = (entity, type, intent) => {
    if (!entity.documentation) {
        return [];
    }
    return entity.documentation
        .filter((documentationBlock) => {
        if (type && intent) {
            return (documentationBlock === null || documentationBlock === void 0 ? void 0 : documentationBlock.type) === type && documentationBlock.intent === intent;
        }
        if (type) {
            return documentationBlock.type === type;
        }
        if (intent) {
            return documentationBlock.intent === intent;
        }
        return true;
    })
        .map((documentationBlock) => documentationBlock.description);
};
exports.getEntityDescriptionFromDocumentation = (entity, type, intent) => {
    return exports.getEntityDescriptionsFromDocumentation(entity, type, intent)[0];
};
exports.getEntityMarkdownDescription = (entity, intent) => {
    return exports.getEntityDescriptionsFromDocumentation(entity, 'markdown', intent)[0];
};
exports.getEntityDescription = (entity, type, intent) => {
    const entityDescriptions = exports.getEntityDescriptionsFromDocumentation(entity, type, intent);
    const mainEntityDescription = entityDescriptions.length ? entityDescriptions[0] : null;
    if (mainEntityDescription) {
        return mainEntityDescription;
    }
    if (!entity.parent) {
        return;
    }
    return exports.getEntityDescription(exports.getEntityByName(entity.parent), type, intent);
};
exports.getPropertyDescription = (entity, propertyName, type, intent) => {
    const properties = exports.getEntityProperties(entity);
    const property = properties[propertyName];
    if (property.description) {
        return property.description;
    }
    const typeEntity = exports.getEntityByName(property.type);
    const entityDescriptions = exports.getEntityDescriptionsFromDocumentation(typeEntity, type, intent);
    return entityDescriptions.length ? entityDescriptions[0] : null;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLDhFQUE4QztBQUtqQyxRQUFBLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBb0QsQ0FBQztBQUs1RSxRQUFBLGVBQWUsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBS2hGLFFBQUEsbUJBQW1CLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUNqRCxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUs1RCxRQUFBLGVBQWUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxxQkFBYSxDQUFDLDBCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFLekQsUUFBQSxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMscUJBQWEsQ0FBQywwQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBS3JELFFBQUEsY0FBYyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyx1QkFBZSxFQUFFLEVBQUUsR0FBRyxxQkFBYSxFQUFFLENBQUMsQ0FBQztBQUtsRSxRQUFBLGVBQWUsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLGtDQUM1QywwQkFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsbUNBQUksMEJBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLG1DQUFJLDBCQUFRLENBQUMsVUFBVSxDQUFDLEdBQUEsQ0FBQztBQUsxRSxRQUFBLGdCQUFnQixHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUs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