"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityAttributes = exports.getParentAttributes = exports.getEntityRequiresContext = exports.getEntityParents = exports.getEntityProperties = exports.getContexts = exports.writeEnumerations = exports.writeCopyright = exports.sortEnumMembers = exports.getObjectKeys = void 0;
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
exports.getObjectKeys = Object.keys;
exports.sortEnumMembers = (members) => members.sort((a, b) => a.name.localeCompare(b.name));
exports.writeCopyright = (writer) => {
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
};
exports.writeEnumerations = (writer) => {
    writer.writeEnumeration({
        export: true,
        name: 'ContextTypes',
        members: exports.sortEnumMembers(exports.getObjectKeys(base_schema_json_1.default.contexts).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
    writer.writeEnumeration({
        export: true,
        name: 'EventTypes',
        members: exports.sortEnumMembers(exports.getObjectKeys(base_schema_json_1.default.events).map((_type) => ({ name: _type }))),
    });
    writer.writeLine();
};
exports.getContexts = (includeAbstracts = false) => {
    const allContexts = exports.getObjectKeys(base_schema_json_1.default.contexts);
    if (includeAbstracts) {
        return allContexts;
    }
    return allContexts.filter((entityName) => !entityName.startsWith('Abstract'));
};
exports.getEntityProperties = (entity) => { var _a; return (_a = entity['properties']) !== null && _a !== void 0 ? _a : {}; };
exports.getEntityParents = (entity) => { var _a; return (_a = entity['parents']) !== null && _a !== void 0 ? _a : []; };
exports.getEntityRequiresContext = (entity) => { var _a; return (_a = entity['requiresContext']) !== null && _a !== void 0 ? _a : []; };
exports.getParentAttributes = (entities, parents, attributes = { properties: {} }) => parents.reduce((parentAttributes, parent) => {
    const parentProperties = exports.getEntityProperties(entities[parent]);
    const parentParents = exports.getEntityParents(entities[parent]);
    const parentPropertyKeys = exports.getObjectKeys(parentProperties);
    parentPropertyKeys.forEach((parentPropertyKey) => {
        const parentProperty = parentProperties[parentPropertyKey];
        if (parentAttributes.properties[parentPropertyKey] === undefined) {
            parentAttributes.properties[parentPropertyKey] = parentProperty;
        }
    });
    if (!parentParents.length) {
        return parentAttributes;
    }
    return exports.getParentAttributes(entities, parentParents, parentAttributes);
}, attributes);
exports.getEntityAttributes = (entities, entityName) => {
    const parents = exports.getEntityParents(entities[entityName]);
    const properties = exports.getEntityProperties(entities[entityName]);
    return exports.getParentAttributes(entities, parents, { properties });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUtBLDhFQUE4QztBQUlqQyxRQUFBLGFBQWEsR0FBRyxNQUFNLENBQUMsSUFBb0QsQ0FBQztBQUU1RSxRQUFBLGVBQWUsR0FBRyxDQUE2QixPQUFZLEVBQUUsRUFBRSxDQUMxRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFMUMsUUFBQSxjQUFjLEdBQUcsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUN4RixDQUFDLENBQUM7QUFFVyxRQUFBLGlCQUFpQixHQUFHLENBQUMsTUFBc0MsRUFBRSxFQUFFO0lBQzFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUN0QixNQUFNLEVBQUUsSUFBSTtRQUNaLElBQUksRUFBRSxjQUFjO1FBQ3BCLE9BQU8sRUFBRSx1QkFBZSxDQUFDLHFCQUFhLENBQUMsMEJBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdGLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUVuQixNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDdEIsTUFBTSxFQUFFLElBQUk7UUFDWixJQUFJLEVBQUUsWUFBWTtRQUNsQixPQUFPLEVBQUUsdUJBQWUsQ0FBQyxxQkFBYSxDQUFDLDBCQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzRixDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBRVcsUUFBQSxXQUFXLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsRUFBRTtJQUN0RCxNQUFNLFdBQVcsR0FBRyxxQkFBYSxDQUFDLDBCQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFckQsSUFBSSxnQkFBZ0IsRUFBRTtRQUNwQixPQUFPLFdBQVcsQ0FBQztLQUNwQjtJQUVELE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDaEYsQ0FBQyxDQUFDO0FBRVcsUUFBQSxtQkFBbUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLHdCQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUNBQUksRUFBRSxHQUFBLENBQUM7QUFDN0QsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLHdCQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUNBQUksRUFBRSxHQUFBLENBQUM7QUFDdkQsUUFBQSx3QkFBd0IsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLHdCQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxtQ0FBSSxFQUFFLEdBQUEsQ0FBQztBQUd2RSxRQUFBLG1CQUFtQixHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUN4RixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDMUMsTUFBTSxnQkFBZ0IsR0FBRywyQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMvRCxNQUFNLGFBQWEsR0FBRyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUV6RCxNQUFNLGtCQUFrQixHQUFHLHFCQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUMzRCxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDM0QsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDaEUsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsY0FBYyxDQUFDO1NBQ2pFO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtRQUN6QixPQUFPLGdCQUFnQixDQUFDO0tBQ3pCO0lBRUQsT0FBTywyQkFBbUIsQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDeEUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBRUosUUFBQSxtQkFBbUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRTtJQUMxRCxNQUFNLE9BQU8sR0FBRyx3QkFBZ0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUN2RCxNQUFNLFVBQVUsR0FBRywyQkFBbUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUU3RCxPQUFPLDJCQUFtQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFLENBQUMsQ0FBQyJ9