"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodWriter = exports.ValidationRuleTypes = void 0;
const common_1 = require("../templates/common");
const JavaScriptWriter_1 = require("./JavaScriptWriter");
var ValidationRuleTypes;
(function (ValidationRuleTypes) {
    ValidationRuleTypes["RequiresLocationContext"] = "RequiresLocationContext";
    ValidationRuleTypes["RequiresGlobalContext"] = "RequiresGlobalContext";
    ValidationRuleTypes["UniqueContext"] = "UniqueContext";
    ValidationRuleTypes["MatchContextProperty"] = "MatchContextProperty";
})(ValidationRuleTypes = exports.ValidationRuleTypes || (exports.ValidationRuleTypes = {}));
const SchemaToZodPropertyTypeMap = {
    integer: 'number',
    literal: 'literal',
    string: 'string',
    discriminator: 'literal',
    uuid: 'string().uuid',
    array: 'array',
};
class ZodWriter extends JavaScriptWriter_1.JavaScriptWriter {
    constructor(writer) {
        super(writer);
        this.documentationLineLength = 120;
        this.exportList = [];
        this.writeDiscriminatedUnion = ({ name, description, discriminator, items }) => {
            if (description) {
                this.writeJsDocLines(description.split('\n'));
            }
            this.writeLine(`const ${name} = z.discriminatedUnion('${discriminator}', [`);
            this.exportList.push(name);
            this.increaseIndent();
            items.forEach((item) => {
                if (typeof item === 'string') {
                    this.increaseIndent();
                    this.writeLine(`${item},`);
                    this.decreaseIndent();
                }
                else {
                    this.writeObject(item);
                    this.write(`,`);
                    this.writeEndOfLine();
                }
            });
            this.decreaseIndent();
            this.writeLine(`]);\n`);
        };
        this.writeArray = (array) => {
            var _a;
            if (array.description) {
                this.writeJsDocLines(array.description.split('\n'));
            }
            this.writeLine(`const ${array.name} = z`);
            this.exportList.push(array.name);
            this.increaseIndent();
            this.writeLine(`.array(`);
            this.increaseIndent();
            this.writeLine(`z.${array.discriminator ? `discriminatedUnion('${array.discriminator}', ` : 'union('}[`);
            this.increaseIndent();
            array.items.forEach((childContext) => {
                this.writeLine(`${childContext},`);
            });
            this.decreaseIndent();
            this.writeLine(`])`);
            this.decreaseIndent();
            this.writeIndent();
            this.write(`)`);
            this.writeRules(array);
            if ((_a = array.rules) === null || _a === void 0 ? void 0 : _a.length) {
                this.writeLine(';');
            }
            this.decreaseIndent();
            this.writeLine();
        };
        this.writeSuperRefine = (refineDefinition) => {
            this.writeLine();
            this.increaseIndent();
            this.writeLine(`.superRefine(`);
            this.increaseIndent();
            this.writeLine(`${refineDefinition.name}({`);
            refineDefinition.parameters
                .filter((parameter) => parameter.value !== undefined)
                .forEach((parameter) => this.writeParameter(parameter));
            this.writeLine(`})`);
            this.decreaseIndent();
            this.writeIndent();
            this.write(`)`);
            this.decreaseIndent();
        };
        this.indentString = '  ';
    }
    writeEnumeration(enumeration) {
        if (enumeration.description) {
            this.writeJsDocLines(enumeration.description.split('\n'));
        }
        this.writeLine(`const ${enumeration.name} = z.enum([`);
        this.exportList.push(enumeration.name);
        this.increaseIndent();
        enumeration.members.forEach((members) => {
            this.writeLine(`'${members.name}',`);
        });
        this.decreaseIndent();
        this.writeLine(`]);`);
        this.writeLine();
    }
    writeProperty(property) {
        var _a;
        this.increaseIndent();
        if (property.description) {
            this.writeJsDocLines(property.description.split('\n'));
        }
        this.writeIndent();
        const mappedType = SchemaToZodPropertyTypeMap[property.typeName];
        let propertyValue = (_a = property.value) !== null && _a !== void 0 ? _a : '';
        if (property.typeName === 'array') {
            propertyValue = `z.${SchemaToZodPropertyTypeMap[propertyValue]}()`;
        }
        this.write(`${property.name}: ${mappedType ? `z.${mappedType}(${propertyValue})` : property.typeName}`);
        if (property.isOptional) {
            this.write('.optional()');
        }
        this.writeEndOfLine(',');
        this.decreaseIndent();
    }
    writeInlineObject(object) {
        this.writeLine('{');
        this.increaseIndent();
        common_1.getObjectKeys(object).forEach((key) => {
            if (object[key] !== undefined) {
                this.writeLine(`${key}: ${object[key]},`);
            }
        });
        this.decreaseIndent();
        this.writeLine('},');
    }
    writeObject(object) {
        if (object.description) {
            this.writeJsDocLines(object.description.split('\n'));
        }
        if (object.name) {
            this.write(`const ${object.name} = `);
            this.exportList.push(object.name);
        }
        this.writeLine(`z.object({`);
        object.properties.forEach((property) => this.writeProperty(property));
        this.writeIndent();
        this.write(`}).strict()`);
        this.writeRules(object);
    }
    writeParameter(parameter) {
        this.increaseIndent();
        this.writeIndent();
        this.write(`${parameter.name}: `);
        if (Array.isArray(parameter.value)) {
            this.write('[');
            this.increaseIndent();
            this.writeLine();
            parameter.value.forEach((parameterValue) => this.writeInlineObject(parameterValue));
            this.decreaseIndent();
            this.writeLine('],');
        }
        else {
            this.writeLine(`${parameter.value},`);
        }
        this.decreaseIndent();
    }
    writeRules(subject) {
        var _a;
        this.decreaseIndent();
        ((_a = subject.rules) !== null && _a !== void 0 ? _a : []).forEach((rule) => {
            switch (rule.type) {
                case ValidationRuleTypes.RequiresLocationContext:
                case ValidationRuleTypes.RequiresGlobalContext:
                    if (!rule.scope || !rule.scope.length) {
                        throw new Error(`Validation rule ${rule.type} requires the \`scope\` attribute to be set with at least one item.`);
                    }
                    this.writeSuperRefine({
                        name: 'requiresContext',
                        parameters: [
                            {
                                name: 'scope',
                                value: rule.scope.map(({ context, position }) => ({
                                    context: `ContextTypes.enum.${context}`,
                                    position,
                                })),
                            },
                        ],
                    });
                    break;
                case ValidationRuleTypes.UniqueContext:
                    if (!rule.scope || !rule.scope.length) {
                        throw new Error(`Validation rule ${rule.type} requires the \`scope\` attribute to be set with at least one item.`);
                    }
                    this.writeSuperRefine({
                        name: 'uniqueContext',
                        parameters: [
                            {
                                name: 'scope',
                                value: rule.scope.map(({ includeContexts, excludeContexts, by }) => ({
                                    includeContexts: (includeContexts === null || includeContexts === void 0 ? void 0 : includeContexts.length) > 0
                                        ? `[${includeContexts.map((contextType) => `ContextTypes.enum.${contextType}`).join(', ')}]`
                                        : undefined,
                                    excludeContexts: (excludeContexts === null || excludeContexts === void 0 ? void 0 : excludeContexts.length) > 0
                                        ? `[${excludeContexts.map((contextType) => `ContextTypes.enum.${contextType}`).join(', ')}]`
                                        : undefined,
                                    by: `['${by.join("', '")}']`,
                                })),
                            },
                        ],
                    });
                    break;
                case ValidationRuleTypes.MatchContextProperty:
                    if (!rule.scope || !rule.scope.length) {
                        throw new Error(`Validation rule ${rule.type} requires the \`scope\` attribute to be set with at least one item.`);
                    }
                    this.writeSuperRefine({
                        name: 'matchContextProperty',
                        parameters: [
                            {
                                name: 'scope',
                                value: rule.scope.map(({ contextA, contextB, property }) => ({
                                    contextA: `ContextTypes.enum.${contextA}`,
                                    contextB: `ContextTypes.enum.${contextB}`,
                                    property: `'${property}'`,
                                })),
                            },
                        ],
                    });
                    break;
                default:
                    throw new Error(`Validation rule ${rule.type} cannot be applied to ${subject.name}.`);
            }
        });
    }
}
exports.ZodWriter = ZodWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9kV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiWm9kV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLGdEQUFvRDtBQUNwRCx5REFBc0Q7QUFFdEQsSUFBWSxtQkFLWDtBQUxELFdBQVksbUJBQW1CO0lBQzdCLDBFQUFtRCxDQUFBO0lBQ25ELHNFQUErQyxDQUFBO0lBQy9DLHNEQUErQixDQUFBO0lBQy9CLG9FQUE2QyxDQUFBO0FBQy9DLENBQUMsRUFMVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQUs5QjtBQWtFRCxNQUFNLDBCQUEwQixHQUFHO0lBQ2pDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxTQUFTO0lBQ3hCLElBQUksRUFBRSxlQUFlO0lBQ3JCLEtBQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQztBQUVGLE1BQWEsU0FBVSxTQUFRLG1DQUFnQjtJQUk3QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUpoQiw0QkFBdUIsR0FBRyxHQUFHLENBQUM7UUFDOUIsZUFBVSxHQUFhLEVBQUUsQ0FBQztRQStFbkIsNEJBQXVCLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBZ0MsRUFBRSxFQUFFO1lBQzdHLElBQUksV0FBVyxFQUFFO2dCQUNmLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQy9DO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksNEJBQTRCLGFBQWEsTUFBTSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RC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