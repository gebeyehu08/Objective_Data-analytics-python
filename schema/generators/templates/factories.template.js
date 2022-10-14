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
const getTypeForProperty = (property) => {
    const mappedType = SchemaToTypeScriptPropertyTypeMap[property.type];
    const mappedSubType = property.type === 'array' ? SchemaToTypeScriptPropertyTypeMap[property.items.type] : undefined;
    return `${mappedType}${mappedSubType ? `<${mappedSubType}>` : ''}`;
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
        default:
            propertyValue = (_a = property.value) !== null && _a !== void 0 ? _a : `props.${property.name}`;
    }
    tsWriter.write(`: ${propertyValue}`);
    if (property.isOptional && property.name !== '_types') {
        tsWriter.write(' ?? null');
    }
    tsWriter.writeEndOfLine(',');
    tsWriter.decreaseIndent();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yaWVzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFjdG9yaWVzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsMENBQTBEO0FBQzFELHNEQUFrRDtBQUVsRCw4RUFBOEM7QUFDOUMsa0VBQStEO0FBQy9ELHFDQVVrQjtBQUlsQixNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUUxQyxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztBQUNoQyxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUVyQyxNQUFNLFlBQVksR0FBRyx3QkFBZSxFQUFFLENBQUM7QUFFdkMsTUFBTSxpQ0FBaUMsR0FBRztJQUN4QyxPQUFPLEVBQUUsUUFBUTtJQUNqQixPQUFPLEVBQUUsUUFBUTtJQUNqQixNQUFNLEVBQUUsUUFBUTtJQUNoQixhQUFhLEVBQUUsUUFBUTtJQUN2QixJQUFJLEVBQUUsUUFBUTtJQUNkLEtBQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQztBQVFGLHNCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEVBQUUsR0FBRyxpQkFBaUIsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLE1BQWtCLEVBQUUsRUFBRTtJQUM3RyxNQUFNLFFBQVEsR0FBRyxJQUFJLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ25GLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDSixRQUFRLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBRTFCLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FB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