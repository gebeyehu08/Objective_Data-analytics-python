"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yellicode/core");
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const TypescriptWriter_1 = require("../writers/TypescriptWriter");
const common_1 = require("./common");
const destinationFolder = '../generated/';
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
const contextNames = common_1.getContextNames();
const eventNames = common_1.getEventNames();
const schemaVersion = base_schema_json_1.default.version.base_schema;
const SchemaToTypeScriptPropertyTypeMap = {
    integer: 'number',
    literal: 'string',
    string: 'string',
    discriminator: 'string',
    uuid: 'string',
    array: 'Array',
};
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/ContextFactories.ts` }, (writer) => {
    const tsWriter = new TypescriptWriter_1.TypescriptWriter(writer);
    tsWriter.writeMultiLineImports('@objectiv/schema', contextNames.filter(contextName => {
        return !contextName.startsWith('Abstract');
    }));
    tsWriter.writeImports('./ContextNames', ['GlobalContextName', 'LocationContextName']);
    tsWriter.writeImports('../helpers', ['generateGUID']);
    tsWriter.writeEndOfLine();
    contextNames.forEach((contextName) => {
        const context = base_schema_json_1.default.contexts[contextName];
        const properties = common_1.getEntityProperties(context);
        const parents = common_1.getEntityParents(context);
        const isAbstract = contextName.startsWith('Abstract');
        const hasChildren = common_1.getChildren(contextName).length;
        const isLocationContext = parents.includes('AbstractLocationContext') || contextName === 'AbstractLocationContext';
        const isGlobalContext = parents.includes('AbstractGlobalContext') || contextName === 'AbstractGlobalContext';
        if (!isAbstract) {
            tsWriter.writeES6FunctionBlock({
                export: true,
                description: common_1.getEntityDescription(context, descriptionsType, descriptionsTarget),
                name: `make${contextName}`,
                returnTypeName: contextName,
                multiLineSignature: true,
                parameters: common_1.getObjectKeys(properties).reduce((parameters, propertyName) => {
                    const property = properties[propertyName];
                    if (property === null || property === void 0 ? void 0 : property.internal) {
                        return parameters;
                    }
                    parameters.push({
                        name: String(propertyName),
                        description: common_1.getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
                        typeName: getTypeForProperty(property),
                        isOptional: property.optional,
                        value: common_1.getPropertyValue(contextName, property),
                    });
                    return parameters;
                }, []),
            }, (tsWriter) => {
                tsWriter.writeLine('({');
                writeObjectProperty(tsWriter, contextName, {
                    name: '__instance_id',
                    value: 'generateGUID()'
                });
                if (hasChildren) {
                    writeObjectProperty(tsWriter, contextName, {
                        name: `__${core_1.NameUtility.camelToKebabCase(contextName).replace(/-/g, '_')}`,
                        value: 'true'
                    });
                }
                parents.forEach(parentName => {
                    const isAbstract = parentName.startsWith('Abstract');
                    if (!isAbstract) {
                        writeObjectProperty(tsWriter, contextName, {
                            name: `__${core_1.NameUtility.camelToKebabCase(parentName).replace(/-/g, '_')}`,
                            value: 'true'
                        });
                    }
                });
                if (isLocationContext) {
                    writeObjectProperty(tsWriter, contextName, {
                        name: '__location_context',
                        value: 'true'
                    });
                }
                if (isGlobalContext) {
                    writeObjectProperty(tsWriter, contextName, {
                        name: '__global_context',
                        value: 'true'
                    });
                }
                common_1.getObjectKeys(properties).map((propertyName) => ({
                    name: String(propertyName),
                    isOptional: properties[propertyName].optional,
                    value: common_1.getPropertyValue(contextName, properties[propertyName]),
                })).forEach(property => writeObjectProperty(tsWriter, contextName, property));
                tsWriter.writeLine('});');
            });
            tsWriter.writeLine();
        }
    });
});
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/EventFactories.ts` }, (writer) => {
    const tsWriter = new TypescriptWriter_1.TypescriptWriter(writer);
    tsWriter.writeMultiLineImports('@objectiv/schema', [
        ...[
            ...eventNames.filter(eventName => {
                return !eventName.startsWith('Abstract');
            }),
            'LocationStack',
            'GlobalContexts'
        ].sort()
    ]);
    tsWriter.writeImports('./EventNames', ['EventName']);
    tsWriter.writeImports('../helpers', ['generateGUID']);
    tsWriter.writeEndOfLine();
    eventNames.forEach((eventName) => {
        const event = base_schema_json_1.default.events[eventName];
        const properties = common_1.getEntityProperties(event);
        const parents = common_1.getEntityParents(event);
        const isAbstract = eventName.startsWith('Abstract');
        const hasChildren = common_1.getChildren(eventName).length;
        if (!isAbstract) {
            tsWriter.writeES6FunctionBlock({
                export: true,
                description: common_1.getEntityDescription(event, descriptionsType, descriptionsTarget),
                name: `make${eventName}`,
                returnTypeName: eventName,
                multiLineSignature: true,
                parameters: common_1.getObjectKeys(properties).reduce((parameters, propertyName) => {
                    const property = properties[propertyName];
                    if (property === null || property === void 0 ? void 0 : property.internal) {
                        return parameters;
                    }
                    parameters.push({
                        name: String(propertyName),
                        description: common_1.getPropertyDescription(event, propertyName, descriptionsType, descriptionsTarget),
                        typeName: getTypeForProperty(property),
                        isOptional: property.optional,
                        value: common_1.getPropertyValue(eventName, property),
                    });
                    return parameters;
                }, []),
            }, (tsWriter) => {
                tsWriter.writeLine('({');
                writeObjectProperty(tsWriter, eventName, {
                    name: '__instance_id',
                    value: 'generateGUID()'
                });
                if (hasChildren) {
                    writeObjectProperty(tsWriter, eventName, {
                        name: `__${core_1.NameUtility.camelToKebabCase(eventName).replace(/-/g, '_')}`,
                        value: 'true'
                    });
                }
                parents.forEach(parentName => {
                    const isAbstract = parentName.startsWith('Abstract');
                    if (!isAbstract) {
                        writeObjectProperty(tsWriter, eventName, {
                            name: `__${core_1.NameUtility.camelToKebabCase(parentName).replace(/-/g, '_')}`,
                            value: 'true'
                        });
                    }
                });
                common_1.getObjectKeys(properties).map((propertyName) => ({
                    name: String(propertyName),
                    isOptional: properties[propertyName].optional,
                    value: common_1.getPropertyValue(eventName, properties[propertyName]),
                })).forEach(property => writeObjectProperty(tsWriter, eventName, property));
                tsWriter.writeLine('});');
            });
            tsWriter.writeLine();
        }
    });
});
const getTypeForProperty = (property) => {
    const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
    const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
    return `${mappedType !== null && mappedType !== void 0 ? mappedType : property.type}${mappedSubType ? `<${mappedSubType}>` : ''}`;
};
const writeObjectProperty = (tsWriter, entityName, property) => {
    var _a;
    const entity = common_1.getEntityByName(entityName);
    const parents = common_1.getEntityParents(entity);
    const isLocation = parents.includes('AbstractLocationContext');
    const isGlobal = parents.includes('AbstractGlobalContext');
    const isEvent = parents.includes('AbstractEvent');
    tsWriter.increaseIndent();
    tsWriter.writeIndent();
    tsWriter.write(`${property.name}`);
    let propertyValue;
    switch (property.name) {
        case '_type':
            propertyValue = ``;
            propertyValue += `${isLocation ? 'LocationContext' : ''}`;
            propertyValue += `${isGlobal ? 'GlobalContext' : ''}`;
            propertyValue += `${isEvent ? 'Event' : ''}`;
            propertyValue += `Name.${entityName}`;
            break;
        case '_types':
            const entityParents = common_1.getEntityParents(common_1.getEntityByName(entityName));
            propertyValue = `['${[...entityParents, entityName].join("', '")}']`;
            break;
        case '_schema_version':
            propertyValue = `'${schemaVersion}'`;
            break;
        default:
            propertyValue = (_a = property.value) !== null && _a !== void 0 ? _a : `props.${property.name}`;
    }
    tsWriter.write(`: ${propertyValue}`);
    if (property.isOptional) {
        tsWriter.write(' ?? null');
    }
    tsWriter.writeEndOfLine(',');
    tsWriter.decreaseIndent();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUVsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQVdrQjtBQUlsQixNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLFlBQVksR0FBRyx3QkFBZSxFQUFFLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsc0JBQWEsRUFBRSxDQUFDO0FBRW5DLE1BQU0sYUFBYSxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUVuRCxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxRQUFRO0lBQ3ZCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBUUYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixzQkFBc0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQzdHLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDbkYsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNKLFFBQVEsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDdEYsUUFBUSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3RELFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUUxQixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7UUFDbkMsTUFBTSxPQUFPLEdBQUcsMEJBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0MsTUFBTSxVQUFVLEdBQUcsNEJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEQsTUFBTSxPQUFPLEdBQUcseUJBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxNQUFNLFdBQVcsR0FBRyxvQkFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNwRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsSUFBSSxXQUFXLEtBQUsseUJBQXlCLENBQUM7UUFDbkgsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLFdBQVcsS0FBSyx1QkFBdUIsQ0FBQztRQUU3RyxJQUFHLENBQUMsVUFBVSxFQUFFO1lBQ2QsUUFBUSxDQUFDLHFCQUFxQixDQUM1QjtnQkFDRSxNQUFNLEVBQUUsSUFBSTtnQkFDWixXQUFXLEVBQUUsNkJBQW9CLENBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDO2dCQUNoRixJQUFJLEVBQUUsT0FBTyxXQUFXLEVBQUU7Z0JBQzFCLGNBQWMsRUFBRSxXQUFXO2dCQUMzQixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4QixVQUFVLEVBQUUsc0JBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLEVBQUU7b0JBQ3hFLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFMUMsSUFBRyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsUUFBUSxFQUFFO3dCQUNyQixPQUFPLFVBQVUsQ0FBQztxQkFDbkI7b0JBRUQsVUFBVSxDQUFDLElBQUksQ0FBQzt3QkFDZCxJQUFJLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQzt3QkFDMUIsV0FBVyxFQUFFLCtCQUFzQixDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7d0JBQ2hHLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7d0JBQ3RDLFVBQVUsRUFBRSxRQUFRLENBQUMsUUFBUTt3QkFDN0IsS0FBSyxFQUFFLHlCQUFnQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUM7cUJBQy9DLENBQUMsQ0FBQTtvQkFFRixPQUFPLFVBQVUsQ0FBQztnQkFDcEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQzthQUNQLEVBQ0QsQ0FBQyxRQUEwQixFQUFFLEVBQUU7Z0JBQzdCLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXpCLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUU7b0JBQ3pDLElBQUksRUFBRSxlQUFlO29CQUNyQixLQUFLLEVBQUUsZ0JBQWdCO2lCQUN4QixDQUFDLENBQUE7Z0JBRUYsSUFBRyxXQUFXLEVBQUU7b0JBQ2QsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTt3QkFDekMsSUFBSSxFQUFFLEtBQUssa0JBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUN6RSxLQUFLLEVBQUUsTUFBTTtxQkFDZCxDQUFDLENBQUE7aUJBQ0g7Z0JBRUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDM0IsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDckQsSUFBRyxDQUFDLFVBQVUsRUFBRTt3QkFDZCxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFOzRCQUN6QyxJQUFJLEVBQUUsS0FBSyxrQkFBVyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7NEJBQ3hFLEtBQUssRUFBRSxNQUFNO3lCQUNkLENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDLENBQUMsQ0FBQTtnQkFFRixJQUFHLGlCQUFpQixFQUFFO29CQUNwQixtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFO3dCQUN6QyxJQUFJLEVBQUUsb0JBQW9CO3dCQUMxQixLQUFLLEVBQUUsTUFBTTtxQkFDZCxDQUFDLENBQUE7aUJBQ0g7Z0JBRUQsSUFBRyxlQUFlLEVBQUU7b0JBQ2xCLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUU7d0JBQ3pDLElBQUksRUFBRSxrQkFBa0I7d0JBQ3hCLEtBQUssRUFBRSxNQUFNO3FCQUNkLENBQUMsQ0FBQTtpQkFDSDtnQkFFRCxzQkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUM7b0JBQzFCLFVBQVUsRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUTtvQkFDN0MsS0FBSyxFQUFFLHlCQUFnQixDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQy9ELENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDVCxRQUFRLENBQUMsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQ2pFLENBQUE7Z0JBRUQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQ0YsQ0FBQTtZQUVELFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUM7QUFFSCxzQkFBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDM0csTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QyxRQUFRLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUU7UUFDakQsR0FBRztZQUNELEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDL0IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDO1lBRUYsZUFBZTtZQUNmLGdCQUFnQjtTQUNqQixDQUFDLElBQUksRUFBRTtLQUNULENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNyRCxRQUFRLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRTFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtRQUMvQixNQUFNLEtBQUssR0FBRywwQkFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6QyxNQUFNLFVBQVUsR0FBRyw0QkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxNQUFNLE9BQU8sR0FBRyx5QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QyxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFHLG9CQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRWxELElBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDZCxRQUFRLENBQUMscUJBQXFCLENBQzVCO2dCQUNFLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFdBQVcsRUFBRSw2QkFBb0IsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUM7Z0JBQzlFLElBQUksRUFBRSxPQUFPLFNBQVMsRUFBRTtnQkFDeEIsY0FBYyxFQUFFLFNBQVM7Z0JBQ3pCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLFVBQVUsRUFBRSxzQkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsRUFBRTtvQkFDeEUsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUUxQyxJQUFHLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxRQUFRLEVBQUU7d0JBQ3JCLE9BQU8sVUFBVSxDQUFDO3FCQUNuQjtvQkFFRCxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNkLElBQUksRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDO3dCQUMxQixXQUFXLEVBQUUsK0JBQXNCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0IsQ0FBQzt3QkFDOUYsUUFBUSxFQUFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQzt3QkFDdEMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRO3dCQUM3QixLQUFLLEVBQUUseUJBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztxQkFDN0MsQ0FBQyxDQUFBO29CQUVGLE9BQU8sVUFBVSxDQUFDO2dCQUNwQixDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ1AsRUFDRCxDQUFDLFFBQTBCLEVBQUUsRUFBRTtnQkFDN0IsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFekIsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRTtvQkFDdkMsSUFBSSxFQUFFLGVBQWU7b0JBQ3JCLEtBQUssRUFBRSxnQkFBZ0I7aUJBQ3hCLENBQUMsQ0FBQTtnQkFFRixJQUFHLFdBQVcsRUFBRTtvQkFDZCxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFO3dCQUN2QyxJQUFJLEVBQUUsS0FBSyxrQkFBVyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7d0JBQ3ZFLEtBQUssRUFBRSxNQUFNO3FCQUNkLENBQUMsQ0FBQTtpQkFDSDtnQkFFRCxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUMzQixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNyRCxJQUFHLENBQUMsVUFBVSxFQUFFO3dCQUNkLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUU7NEJBQ3ZDLElBQUksRUFBRSxLQUFLLGtCQUFXLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTs0QkFDeEUsS0FBSyxFQUFFLE1BQU07eUJBQ2QsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUMsQ0FBQyxDQUFBO2dCQUVGLHNCQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUMvQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQztvQkFDMUIsVUFBVSxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRO29CQUM3QyxLQUFLLEVBQUUseUJBQWdCLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDN0QsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUNULFFBQVEsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FDL0QsQ0FBQTtnQkFFRCxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FDRixDQUFBO1lBRUQsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtJQUN0QyxNQUFNLFVBQVUsR0FBRyxpQ0FBaUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEUsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNySCxPQUFPLEdBQUcsVUFBVSxhQUFWLFVBQVUsY0FBVixVQUFVLEdBQUksUUFBUSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3JGLENBQUMsQ0FBQTtBQUVELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxRQUEwQixFQUFFLFVBQVUsRUFBRSxRQUE0QixFQUFFLEVBQUU7O0lBQ25HLE1BQU0sTUFBTSxHQUFHLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsTUFBTSxPQUFPLEdBQUcseUJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9ELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUMzRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRWxELFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUUxQixRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFdkIsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRW5DLElBQUksYUFBYSxDQUFDO0lBRWxCLFFBQU8sUUFBUSxDQUFDLElBQUksRUFBRTtRQUNwQixLQUFLLE9BQU87WUFDVixhQUFhLEdBQUcsRUFBRSxDQUFDO1lBQ25CLGFBQWEsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFELGFBQWEsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0RCxhQUFhLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsYUFBYSxJQUFJLFFBQVEsVUFBVSxFQUFFLENBQUM7WUFDdEMsTUFBTTtRQUNSLEtBQUssUUFBUTtZQUNYLE1BQU0sYUFBYSxHQUFHLHlCQUFnQixDQUFDLHdCQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwRSxhQUFhLEdBQUcsS0FBSyxDQUFDLEdBQUcsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3JFLE1BQU07UUFDUixLQUFLLGlCQUFpQjtZQUNwQixhQUFhLEdBQUcsSUFBSSxhQUFhLEdBQUcsQ0FBQztZQUNyQyxNQUFNO1FBQ1I7WUFDRSxhQUFhLFNBQUcsUUFBUSxDQUFDLEtBQUssbUNBQUksU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDOUQ7SUFFRCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssYUFBYSxFQUFFLENBQUMsQ0FBQztJQUVyQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDdkIsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM1QjtJQUVELFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQzVCLENBQUMsQ0FBQSJ9