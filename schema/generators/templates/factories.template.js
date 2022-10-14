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
    tsWriter.increaseIndent();
    tsWriter.writeIndent();
    tsWriter.write(`${property.name}`);
    let propertyValue;
    switch (property.name) {
        case '_type':
            propertyValue = `'${entityName}'`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUVsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQVdrQjtBQUlsQixNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLFlBQVksR0FBRyx3QkFBZSxFQUFFLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsc0JBQWEsRUFBRSxDQUFDO0FBRW5DLE1BQU0sYUFBYSxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUVuRCxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxRQUFRO0lBQ3ZCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBUUYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixzQkFBc0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQzdHLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDbkYsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNKLFFBQVEsQ0FBQyxZQUFZLENBQUMsWUFBWSxF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