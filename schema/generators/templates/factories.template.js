"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yellicode/core");
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const TypeScriptWriter_1 = require("../writers/TypeScriptWriter");
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
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    tsWriter.writeMultiLineImports('@objectiv/schema', contextNames.filter(contextName => {
        return !contextName.startsWith('Abstract');
    }));
    tsWriter.writeImports('./ContextNames', ['AbstractContextName', 'GlobalContextName', 'LocationContextName']);
    tsWriter.writeImports('../helpers', ['generateGUID']);
    tsWriter.writeEndOfLine();
    const nonAbstractContexts = contextNames.filter(contextName => !contextName.startsWith('Abstract'));
    nonAbstractContexts.forEach((contextName) => {
        const context = base_schema_json_1.default.contexts[contextName];
        const properties = common_1.getEntityProperties(context);
        const parents = common_1.getEntityParents(context);
        const hasChildren = common_1.getChildren(contextName).length;
        const isLocationContext = parents.includes('AbstractLocationContext') || contextName === 'AbstractLocationContext';
        const isGlobalContext = parents.includes('AbstractGlobalContext') || contextName === 'AbstractGlobalContext';
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
    });
    writeEntityFactory(tsWriter, 'Context', nonAbstractContexts);
});
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/EventFactories.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    tsWriter.writeMultiLineImports('@objectiv/schema', [
        ...[
            ...eventNames.filter(eventName => {
                return !eventName.startsWith('Abstract');
            }),
            'LocationStack',
            'GlobalContexts'
        ].sort()
    ]);
    tsWriter.writeImports('./EventNames', ['AbstractEventName', 'EventName']);
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
const writeEntityFactory = (tsWriter, entityType, entityNames) => {
    const entityPropsName = `${entityType.toLowerCase()}Props`;
    entityNames.forEach(entityName => {
        tsWriter.writeLine(`export function makeContext (contextProps: { _type: '${entityName}', id: string }): ${entityName};`);
    });
    tsWriter.writeLine(`export function makeContext ({ _type, ...contextProps }: any) {`);
    tsWriter.increaseIndent();
    tsWriter.writeLine(`switch(_type) {`);
    entityNames.forEach(entityName => {
        tsWriter.writeLine(`${tsWriter.indentString}case ${entityName}:`);
        tsWriter.writeLine(`${tsWriter.indentString.repeat(2)}return make${entityName}(${entityPropsName});`);
    });
    tsWriter.writeLine(`}`);
    tsWriter.decreaseIndent();
    tsWriter.writeLine(`}`);
};
const getTypeForProperty = (property) => {
    const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
    const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
    return `${mappedType !== null && mappedType !== void 0 ? mappedType : property.type}${mappedSubType ? `<${mappedSubType}>` : ''}`;
};
const mapInternalTypeToEnum = (entityName) => {
    const entity = common_1.getEntityByName(entityName);
    const entityParents = common_1.getEntityParents(entity);
    const isLocationContext = entityParents.includes('AbstractLocationContext');
    const isGlobalContext = entityParents.includes('AbstractGlobalContext');
    const isAbstract = entityName.startsWith('Abstract');
    const isContext = entityParents.includes('AbstractContext') || entityName === 'AbstractContext';
    const isEvent = entityParents.includes('AbstractEvent') || entityName === 'AbstractEvent';
    if (isAbstract) {
        if (isContext) {
            return `AbstractContextName.${entityName}`;
        }
        if (isEvent) {
            return `AbstractEventName.${entityName}`;
        }
    }
    if (isLocationContext) {
        return `LocationContextName.${entityName}`;
    }
    if (isGlobalContext) {
        return `GlobalContextName.${entityName}`;
    }
    if (isEvent) {
        return `EventName.${entityName}`;
    }
};
const writeObjectProperty = (tsWriter, entityName, property) => {
    var _a;
    const entity = common_1.getEntityByName(entityName);
    const entityParents = common_1.getEntityParents(entity);
    tsWriter.increaseIndent();
    tsWriter.writeIndent();
    tsWriter.write(`${property.name}`);
    let propertyValue;
    switch (property.name) {
        case '_type':
            propertyValue = mapInternalTypeToEnum(entityName);
            break;
        case '_types':
            const indent = tsWriter.indentString;
            const doubleIndent = indent.repeat(2);
            const _types = [...entityParents, entityName].map(mapInternalTypeToEnum);
            propertyValue = `[\n${doubleIndent}${_types.join(`,\n${doubleIndent}`)}\n${indent}]`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQVdrQjtBQUlsQixNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLFlBQVksR0FBRyx3QkFBZSxFQUFFLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsc0JBQWEsRUFBRSxDQUFDO0FBRW5DLE1BQU0sYUFBYSxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUVuRCxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxRQUFRO0lBQ3ZCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBUUYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixzQkFBc0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQzdHLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDbkYsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNKLFFBQVEsQ0FBQyxZQUFZLENBQUMsZ0JBQWdC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