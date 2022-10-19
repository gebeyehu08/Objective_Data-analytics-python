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
templating_1.Generator.generate({ outputFile: `${destinationFolder}/ContextFactories.ts` }, (writer) => {
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
templating_1.Generator.generate({ outputFile: `${destinationFolder}/EventFactories.ts` }, (writer) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUlsRCxNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLG1CQUFtQixHQUFHLG9CQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUMvRCxNQUFNLGlCQUFpQixHQUFHLGtCQUFTLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUUzRCxNQUFNLGFBQWEsR0FBRywwQkFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFFbkQsTUFBTSxpQ0FBaUMsR0FBRztJQUN4QyxPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsUUFBUTtJQUNqQixNQUFNLEVBQUUsUUFBUTtJQUNoQixhQUFhLEVBQUUsUUFBUTtJQUN2QixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQztBQVFGLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDcEcsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QyxRQUFRLENBQUMscUJBQXFCLENBQzVCLGtCQUFrQixFQUNsQixtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FDNUMsQ0FBQztJ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