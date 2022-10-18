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
                value: common_1.getPropertyValue(context.name, property),
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
                value: common_1.getPropertyValue(event.name, property),
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
        value: common_1.getPropertyValue(entity.name, property),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQUE0QztBQUM1QyxxQ0FBa0Q7QUFJbEQsTUFBTSxpQkFBaUIsR0FBRyxlQUFlLENBQUM7QUFFMUMsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFFckMsTUFBTSxtQkFBbUIsR0FBRyxvQkFBVyxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDL0QsTUFBTSxpQkFBaUIsR0FBRyxrQkFBUyxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFFM0QsTUFBTSxhQUFhLEdBQUcsMEJBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBRW5ELE1BQU0saUNBQWlDLEdBQUc7SUFDeEMsT0FBTyxFQUFFLFFBQVE7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsYUFBYSxFQUFFLFFBQVE7SUFDdkIsSUFBSSxFQUFFLFFBQVE7SUFDZCxLQUFLLEVBQUUsT0FBTztDQUNmLENBQUM7QUFRRixzQkFBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsaUJBQWlCLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDN0csTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QyxRQUFRLENBQUMscUJBQXFCLENBQzVCLGtCQUFrQixFQUNsQixtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENB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