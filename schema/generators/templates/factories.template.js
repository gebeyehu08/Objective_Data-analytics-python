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
const destinationFolder = '../../../tracker/core/schema/src/generated/';
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
templating_1.Generator.generate({ outputFile: `${destinationFolder}factories.ts` }, (writer) => {
    const tsWriter = new TypeScriptWriter_1.TypeScriptWriter(writer);
    tsWriter.writeMultiLineImports('./contexts', nonAbstractContexts.map(({ name }) => name));
    tsWriter.writeMultiLineImports('./events', nonAbstractEvents.map(({ name }) => name));
    tsWriter.writeMultiLineImports('./types', ['LocationStack', 'GlobalContexts'].sort());
    tsWriter.writeImports('./names', [
        'AbstractContextName',
        'AbstractEventName',
        'EventName',
        'GlobalContextName',
        'LocationContextName'
    ]);
    tsWriter.writeImports('../uuidv4', ['uuidv4']);
    tsWriter.writeEndOfLine();
    nonAbstractContexts.forEach((context) => {
        const parameters = getParametersFromProperties(context);
        const optionalsCount = parameters.filter(parameter => parameter.isOptional).length;
        const areAllPropsOptional = optionalsCount === parameters.length;
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
                value: 'uuidv4()',
            }, areAllPropsOptional);
            if (context.isParent) {
                writeObjectProperty(tsWriter, context, {
                    name: `__${core_1.NameUtility.camelToKebabCase(context.name).replace(/-/g, '_')}`,
                    value: 'true',
                }, areAllPropsOptional);
            }
            context.parents.forEach((parent) => {
                if (!parent.isAbstract) {
                    writeObjectProperty(tsWriter, context, {
                        name: `__${core_1.NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
                        value: 'true',
                    }, areAllPropsOptional);
                }
            });
            if (context.isLocationContext) {
                writeObjectProperty(tsWriter, context, {
                    name: '__location_context',
                    value: 'true',
                }, areAllPropsOptional);
            }
            if (context.isGlobalContext) {
                writeObjectProperty(tsWriter, context, {
                    name: '__global_context',
                    value: 'true',
                }, areAllPropsOptional);
            }
            context.properties
                .map((property) => ({
                name: property.name,
                isOptional: property.optional,
                isNullable: property.nullable,
                value: property.value,
            }))
                .forEach((property) => writeObjectProperty(tsWriter, context, property, areAllPropsOptional));
            tsWriter.writeLine('});');
        });
        tsWriter.writeLine();
    });
    tsWriter.writeJsDocLines([`A factory to generate any Context.`]);
    writeEntityFactory(tsWriter, 'makeContext', nonAbstractContexts);
    tsWriter.writeEndOfLine();
    nonAbstractEvents.forEach((event) => {
        const parameters = getParametersFromProperties(event);
        const optionalsCount = parameters.filter(parameter => parameter.isOptional).length;
        const areAllPropsOptional = optionalsCount === parameters.length;
        tsWriter.writeES6FunctionBlock({
            export: true,
            description: event.getDescription({ type: descriptionsType, target: descriptionsTarget }),
            name: `make${event.name}`,
            returnTypeName: event.name,
            multiLineSignature: true,
            parameters,
        }, (tsWriter) => {
            tsWriter.writeLine('({');
            writeObjectProperty(tsWriter, event, {
                name: '__instance_id',
                value: 'uuidv4()',
            }, areAllPropsOptional);
            if (event.isParent) {
                writeObjectProperty(tsWriter, event, {
                    name: `__${core_1.NameUtility.camelToKebabCase(event.name).replace(/-/g, '_')}`,
                    value: 'true',
                }, areAllPropsOptional);
            }
            event.parents.forEach((parent) => {
                if (!parent.isAbstract) {
                    writeObjectProperty(tsWriter, event, {
                        name: `__${core_1.NameUtility.camelToKebabCase(parent.name).replace(/-/g, '_')}`,
                        value: 'true',
                    }, areAllPropsOptional);
                }
            });
            const processDefaultValue = (defaultValue) => {
                switch (defaultValue) {
                    case 'timestamp':
                        return 'Date.now()';
                    case 'uuid':
                        return 'uuidv4()';
                    default:
                        return JSON.stringify(defaultValue);
                }
            };
            event.properties
                .map((property) => {
                const propertyValue = `props${areAllPropsOptional ? '?' : ''}.${property.name}`;
                const defaultValue = ` ?? ${processDefaultValue(property.default_value)}`;
                return {
                    name: property.name,
                    isOptional: property.optional,
                    isNullable: property.nullable,
                    value: `${propertyValue}${property.default_value ? defaultValue : ''}`,
                };
            })
                .forEach((property) => writeObjectProperty(tsWriter, event, property, areAllPropsOptional));
            tsWriter.writeLine('});');
        });
        tsWriter.writeLine();
    });
    tsWriter.writeJsDocLines([`A factory to generate any Event.`]);
    writeEntityFactory(tsWriter, 'makeEvent', nonAbstractEvents);
});
const getParametersFromProperties = (entity) => entity.properties.reduce((parameters, property) => {
    if (property === null || property === void 0 ? void 0 : property.internal) {
        return parameters;
    }
    parameters.push({
        name: property.name,
        description: property.description,
        typeName: getTypeForProperty(property),
        isOptional: property.optional || property.nullable || property.automatically_set || property.default_value !== undefined,
        value: property.value,
    });
    return parameters;
}, []);
const writeEntityFactory = (tsWriter, factoryName, entities) => {
    entities.forEach((entity) => {
        tsWriter.write(`export function ${factoryName} (`);
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
    tsWriter.writeLine(`${tsWriter.indentString}default:`);
    tsWriter.writeLine(`${tsWriter.indentString.repeat(2)}throw new Error(\`Unknown entity \${_type}\`);`);
    tsWriter.writeLine(`}`);
    tsWriter.decreaseIndent();
    tsWriter.writeLine(`}`);
};
const getTypeForProperty = (property) => {
    const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
    const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
    const nullable = property.nullable ? ' | null' : '';
    return `${mappedType !== null && mappedType !== void 0 ? mappedType : property.type}${mappedSubType ? `<${mappedSubType}>` : ''}${nullable}`;
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
const writeObjectProperty = (tsWriter, entity, property, areAllPropsOptional) => {
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
            const parameters = getParametersFromProperties(entity);
            const optionalsCount = parameters.filter(parameter => parameter.isOptional).length;
            const areAllPropsOptional = optionalsCount === parameters.length;
            propertyValue = (_a = property.value) !== null && _a !== void 0 ? _a : `props${areAllPropsOptional ? '?' : ''}.${property.name}`;
    }
    tsWriter.write(`: ${propertyValue}`);
    if (property.isNullable) {
        tsWriter.write(' ?? null');
    }
    tsWriter.writeEndOfLine(',');
    tsWriter.decreaseIndent();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUNsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQUFrRDtBQUVsRCxNQUFNLGlCQUFpQixHQUFHLDZDQUE2QyxDQUFDO0FBRXhFLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBRXJDLE1BQU0sbUJBQW1CLEdBQUcsb0JBQVcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELE1BQU0saUJBQWlCLEdBQUcsa0JBQVMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBRTNELE1BQU0sYUFBYSxHQUFHLDBCQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUVuRCxNQUFNLGlDQUFpQyxHQUFHO0lBQ3hDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxRQUFRO0lBQ3ZCLElBQUksRUFBRSxRQUFRO0lBQ2QsS0FBSyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBU0Ysc0JBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxpQkFBaUIsY0FBYyxFQUFFLEVBQUUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDNUYsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUU5QyxRQUFRLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDMUYs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