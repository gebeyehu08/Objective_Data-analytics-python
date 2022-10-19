"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@yellicode/core");
const templating_1 = require("@yellicode/templating");
const base_schema_json_1 = __importDefault(require("../../base_schema.json"));
const TypeScriptWriter_1 = require("../writers/TypeScriptWriter");
const parser_1 = require("./parser");
const destinationFolder = '../generated/';
const descriptionsType = 'text';
const descriptionsTarget = 'primary';
const nonAbstractContexts = parser_1.getContexts({ isAbstract: false });
const nonAbstractEvents = parser_1.getEvents({ isAbstract: false });
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
    tsWriter.writeMultiLineImports('@objectiv/schema', nonAbstractContexts.map(({ name }) => name));
    tsWriter.writeImports('./ContextNames', ['AbstractContextName', 'GlobalContextName', 'LocationContextName']);
    tsWriter.writeImports('../helpers', ['generateGUID']);
    tsWriter.writeEndOfLine();
    nonAbstractContexts.forEach((context) => {
        tsWriter.writeES6FunctionBlock({
            export: true,
            description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
            name: `make${context.name}`,
            returnTypeName: context.name,
            multiLineSignature: true,
            parameters: getParametersFromProperties(context),
        }, (tsWriter) => {
            tsWriter.writeLine('({');
            writeObjectProperty(tsWriter, context, {
                name: '__instance_id',
                value: 'generateGUID()',
            });
            if (context.isParent) {
                writeObjectProperty(tsWriter, context, {
                    name: `__${core_1.NameUtility.camelToKebabCase(context.name).replace(/-/g, '_')}`,
                    value: 'true',
                });
            }
            context.parents.forEach((parent) => {
                if (!parent.isAbstract) {
                    writeObjectProperty(tsWriter, context, {
                        name: `__${core_1.NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
                        value: 'true',
                    });
                }
            });
            if (context.isLocationContext) {
                writeObjectProperty(tsWriter, context, {
                    name: '__location_context',
                    value: 'true',
                });
            }
            if (context.isGlobalContext) {
                writeObjectProperty(tsWriter, context, {
                    name: '__global_context',
                    value: 'true',
                });
            }
            context.properties
                .map((property) => ({
                name: property.name,
                isOptional: property.optional,
                value: property.value,
            }))
                .forEach((property) => writeObjectProperty(tsWriter, context, property));
            tsWriter.writeLine('});');
        });
        tsWriter.writeLine();
    });
    tsWriter.writeJsDocLines([`A factory to generate any Context.`]);
    writeEntityFactory(tsWriter, 'makeContext', nonAbstractContexts);
});
templating_1.Generator.generateFromModel({ outputFile: `${destinationFolder}/EventFactories.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    tsWriter.writeMultiLineImports('@objectiv/schema', [...nonAbstractEvents.map(({ name }) => name), 'LocationStack', 'GlobalContexts'].sort());
    tsWriter.writeImports('./EventNames', ['AbstractEventName', 'EventName']);
    tsWriter.writeImports('../helpers', ['generateGUID']);
    tsWriter.writeEndOfLine();
    nonAbstractEvents.forEach((event) => {
        tsWriter.writeES6FunctionBlock({
            export: true,
            description: event.getDescription({ type: descriptionsType, target: descriptionsTarget }),
            name: `make${event.name}`,
            returnTypeName: event.name,
            multiLineSignature: true,
            parameters: getParametersFromProperties(event),
        }, (tsWriter) => {
            tsWriter.writeLine('({');
            writeObjectProperty(tsWriter, event, {
                name: '__instance_id',
                value: 'generateGUID()',
            });
            if (event.isParent) {
                writeObjectProperty(tsWriter, event, {
                    name: `__${core_1.NameUtility.camelToKebabCase(event.name).replace(/-/g, '_')}`,
                    value: 'true',
                });
            }
            event.parents.forEach((parent) => {
                if (!parent.isAbstract) {
                    writeObjectProperty(tsWriter, event, {
                        name: `__${core_1.NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
                        value: 'true',
                    });
                }
            });
            event.properties
                .map((property) => ({
                name: property.name,
                isOptional: property.optional,
                value: property.value,
            }))
                .forEach((property) => writeObjectProperty(tsWriter, event, property));
            tsWriter.writeLine('});');
        });
        tsWriter.writeLine();
    });
    writeEntityFactory(tsWriter, 'Event', nonAbstractEvents);
});
const getParametersFromProperties = (entity) => entity.properties.reduce((parameters, property) => {
    if (property === null || property === void 0 ? void 0 : property.internal) {
        return parameters;
    }
    parameters.push({
        name: property.name,
        description: property.description,
        typeName: getTypeForProperty(property),
        isOptional: property.optional,
        value: property.value,
    });
    return parameters;
}, []);
const writeEntityFactory = (tsWriter, factoryName, entities) => {
    entities.forEach((entity) => {
        tsWriter.write(`export function make${entity.name} (`);
        tsWriter.writeProps({
            propsName: 'props',
            parameters: [
                {
                    name: '_type',
                    typeName: `'${entity.name}'`,
                },
                ...getParametersFromProperties(entity),
            ],
        });
        tsWriter.writeLine(`): ${entity.name};`);
        tsWriter.writeEndOfLine(``);
    });
    tsWriter.writeLine(`export function ${factoryName} ({ _type, ...props }: any) {`);
    tsWriter.increaseIndent();
    tsWriter.writeLine(`switch(_type) {`);
    entities.forEach((entity) => {
        tsWriter.writeLine(`${tsWriter.indentString}case '${entity.name}':`);
        tsWriter.writeLine(`${tsWriter.indentString.repeat(2)}return make${entity.name}(props);`);
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
const mapInternalTypeToEnum = (entity) => {
    if (entity.isAbstract) {
        if (entity.isContext) {
            return `AbstractContextName.${entity.name}`;
        }
        if (entity.isEvent) {
            return `AbstractEventName.${entity.name}`;
        }
    }
    if (entity.isLocationContext) {
        return `LocationContextName.${entity.name}`;
    }
    if (entity.isGlobalContext) {
        return `GlobalContextName.${entity.name}`;
    }
    if (entity.isEvent) {
        return `EventName.${entity.name}`;
    }
};
const writeObjectProperty = (tsWriter, entity, property) => {
    var _a;
    tsWriter.increaseIndent();
    tsWriter.writeIndent();
    tsWriter.write(`${property.name}`);
    let propertyValue;
    switch (property.name) {
        case '_type':
            propertyValue = mapInternalTypeToEnum(entity);
            break;
        case '_types':
            const indent = tsWriter.indentString;
            const doubleIndent = indent.repeat(2);
            const _types = [...entity.parents, entity].map(mapInternalTypeToEnum);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUlsRCxNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLG1CQUFtQixHQUFHLG9CQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMvRCxNQUFNLGlCQUFpQixHQUFHLGtCQUFTLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUUzRCxNQUFNLGFBQWEsR0FBRywwQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFFbkQsTUFBTSxpQ0FBaUMsR0FBRztJQUN4QyxPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsUUFBUTtJQUNqQixNQUFNLEVBQUUsUUFBUTtJQUNoQixhQUFhLEVBQUUsUUFBUTtJQUN2QixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQztBQVFGLHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxpQkFBaUIsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUM3RyxNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FDNUIsa0JBQWtCLEVBQ2xCLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUM1QyxDQUFD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