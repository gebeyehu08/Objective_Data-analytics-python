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
    tsWriter.writeMultiLineImports('@objectiv/schema', contextNames.filter((contextName) => {
        return !contextName.startsWith('Abstract');
    }));
    tsWriter.writeImports('./ContextNames', ['AbstractContextName', 'GlobalContextName', 'LocationContextName']);
    tsWriter.writeImports('../helpers', ['generateGUID']);
    tsWriter.writeEndOfLine();
    const nonAbstractContexts = contextNames.filter((contextName) => !contextName.startsWith('Abstract'));
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
                value: 'generateGUID()',
            });
            if (hasChildren) {
                writeObjectProperty(tsWriter, contextName, {
                    name: `__${core_1.NameUtility.camelToKebabCase(contextName).replace(/-/g, '_')}`,
                    value: 'true',
                });
            }
            parents.forEach((parentName) => {
                const isAbstract = parentName.startsWith('Abstract');
                if (!isAbstract) {
                    writeObjectProperty(tsWriter, contextName, {
                        name: `__${core_1.NameUtility.camelToKebabCase(parentName).replace(/-/g, '_')}`,
                        value: 'true',
                    });
                }
            });
            if (isLocationContext) {
                writeObjectProperty(tsWriter, contextName, {
                    name: '__location_context',
                    value: 'true',
                });
            }
            if (isGlobalContext) {
                writeObjectProperty(tsWriter, contextName, {
                    name: '__global_context',
                    value: 'true',
                });
            }
            common_1.getObjectKeys(properties)
                .map((propertyName) => ({
                name: String(propertyName),
                isOptional: properties[propertyName].optional,
                value: common_1.getPropertyValue(contextName, properties[propertyName]),
            }))
                .forEach((property) => writeObjectProperty(tsWriter, contextName, property));
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
            ...eventNames.filter((eventName) => {
                return !eventName.startsWith('Abstract');
            }),
            'LocationStack',
            'GlobalContexts',
        ].sort(),
    ]);
    tsWriter.writeImports('./EventNames', ['AbstractEventName', 'EventName']);
    tsWriter.writeImports('../helpers', ['generateGUID']);
    tsWriter.writeEndOfLine();
    const nonAbstractEvents = eventNames.filter((eventName) => !eventName.startsWith('Abstract'));
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
                value: 'generateGUID()',
            });
            if (hasChildren) {
                writeObjectProperty(tsWriter, eventName, {
                    name: `__${core_1.NameUtility.camelToKebabCase(eventName).replace(/-/g, '_')}`,
                    value: 'true',
                });
            }
            parents.forEach((parentName) => {
                const isAbstract = parentName.startsWith('Abstract');
                if (!isAbstract) {
                    writeObjectProperty(tsWriter, eventName, {
                        name: `__${core_1.NameUtility.camelToKebabCase(parentName).replace(/-/g, '_')}`,
                        value: 'true',
                    });
                }
            });
            common_1.getObjectKeys(properties)
                .map((propertyName) => ({
                name: String(propertyName),
                isOptional: properties[propertyName].optional,
                value: common_1.getPropertyValue(eventName, properties[propertyName]),
            }))
                .forEach((property) => writeObjectProperty(tsWriter, eventName, property));
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
    tsWriter.writeJsDocLines([`A factory to generate any ${entityType}.`]);
    const entityPropsName = `${entityType.toLowerCase()}Props`;
    entityNames.forEach((entityName) => {
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
                ...getParametersFromProperties(entityName, entity, properties),
            ],
        });
        tsWriter.writeLine(`): ${entityName};`);
        tsWriter.writeEndOfLine(``);
    });
    tsWriter.writeLine(`export function make${entityType} ({ _type, ...${entityPropsName} }: any) {`);
    tsWriter.increaseIndent();
    tsWriter.writeLine(`switch(_type) {`);
    entityNames.forEach((entityName) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQVdrQjtBQUlsQixNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLFlBQVksR0FBRyx3QkFBZSxFQUFFLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsc0JBQWEsRUFBRSxDQUFDO0FBRW5DLE1BQU0sYUFBYSxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUVuRCxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxRQUFRO0lBQ3ZCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBUUYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFpQixzQkFBc0IsRUFBRSxFQUFFLENBQUMsTUFBa0IsRUFBRSxFQUFFO0lBQzdHLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFOUMsUUFBUSxDQUFDLHFCQUFxQixDQUM1QixrQkFBa0IsRUFDbEIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDRixRQUFRLENBQUMsWUFBWSxDQUFD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