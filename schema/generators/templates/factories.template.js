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
            parameters: getParametersFromProperties(contextName, context, properties),
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
    const nonAbstractEvents = eventNames.filter(eventName => !eventName.startsWith('Abstract'));
    nonAbstractEvents.forEach((eventName) => {
        const event = base_schema_json_1.default.events[eventName];
        const properties = common_1.getEntityProperties(event);
        const parents = common_1.getEntityParents(event);
        const hasChildren = common_1.getChildren(eventName).length;
        tsWriter.writeES6FunctionBlock({
            export: true,
            description: common_1.getEntityDescription(event, descriptionsType, descriptionsTarget),
            name: `make${eventName}`,
            returnTypeName: eventName,
            multiLineSignature: true,
            parameters: getParametersFromProperties(eventName, event, properties),
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
    });
    writeEntityFactory(tsWriter, 'Event', nonAbstractEvents);
});
const getParametersFromProperties = (entityName, entity, properties) => common_1.getObjectKeys(properties).reduce((parameters, propertyName) => {
    const property = properties[propertyName];
    if (property === null || property === void 0 ? void 0 : property.internal) {
        return parameters;
    }
    parameters.push({
        name: String(propertyName),
        description: common_1.getPropertyDescription(entity, propertyName, descriptionsType, descriptionsTarget),
        typeName: getTypeForProperty(property),
        isOptional: property.optional,
        value: common_1.getPropertyValue(entityName, property),
    });
    return parameters;
}, []);
const writeEntityFactory = (tsWriter, entityType, entityNames) => {
    tsWriter.writeJsDocLines([
        `A factory to generate any ${entityType}.`
    ]);
    const entityPropsName = `${entityType.toLowerCase()}Props`;
    entityNames.forEach(entityName => {
        const entity = common_1.getEntityByName(entityName);
        const properties = common_1.getEntityProperties(entity);
        tsWriter.write(`export function make${entityType} (`);
        tsWriter.writeProps({
            propsName: `${entityType.toLowerCase()}Props`,
            parameters: [
                {
                    name: '_type',
                    typeName: `'${entityName}'`,
                },
                ...getParametersFromProperties(entityName, entity, properties)
            ],
        });
        tsWriter.writeLine(`): ${entityName};`);
        tsWriter.writeEndOfLine(``);
    });
    tsWriter.writeLine(`export function make${entityType} ({ _type, ...${entityPropsName} }: any) {`);
    tsWriter.increaseIndent();
    tsWriter.writeLine(`switch(_type) {`);
    entityNames.forEach(entityName => {
        tsWriter.writeLine(`${tsWriter.indentString}case '${entityName}':`);
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