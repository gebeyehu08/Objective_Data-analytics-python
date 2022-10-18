"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyValue = exports.getPropertyDescription = exports.getEntityDescription = exports.getEntityMarkdownDescription = exports.getEntityDescriptionFromDocumentation = exports.getEntityDescriptionsFromDocumentation = exports.getEntityProperties = exports.getParentProperties = exports.getChildren = exports.getEntityParents = exports.getEntityByName = exports.getEntityNames = exports.getEventNames = exports.getContextNames = exports.filterAbstractNames = exports.sortBy = exports.getObjectKeys = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
exports.getObjectKeys = Object.keys;
exports.sortBy = (array, propertyName) => array.sort((a, b) => a[propertyName].localeCompare(b[propertyName]));
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
    parents.unshift(parentEntityName);
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
exports.getPropertyValue = (entityName, property) => {
    if (property.type === 'discriminator') {
        return `${entityName.endsWith('Event') ? 'Event' : 'Context'}Types.enum.${entityName}`;
    }
    if (property.type === 'array') {
        return property.items.type;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLDhFQUE4QztBQUtqQyxRQUFBLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBb0QsQ0FBQztBQUs1RSxRQUFBLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFLdkcsUUFBQSxtQkFBbUIsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQ2pELFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBSzVELFFBQUEsZUFBZSxHQUFHLEdBQUcsRUFBRSxDQUFDLHFCQUFhLENBQUMsMEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUt6RCxRQUFBLGFBQWEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxxQkFBYSxDQUFDLDBCQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFLckQsUUFBQSxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLHVCQUFlLEVBQUUsRUFBRSxHQUFHLHFCQUFhLEVBQUUsQ0FBQyxDQUFDO0FBS2xFLFFBQUEsZUFBZSxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsa0NBQzVDLDBCQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBSSwwQkFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsbUNBQUksMEJBQVEsQ0FBQyxVQUFVLENBQUMsR0FBQSxDQUFDO0FBSzFFLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxNQUFNLEVBQUUs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