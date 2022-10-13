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
    array: 'array'
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
        this.writeFile('./validator.template.static.ts');
        this.writeLine();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9kV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiWm9kV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLGdEQUFvRDtBQUNwRCx5REFBc0Q7QUFFdEQsSUFBWSxtQkFLWDtBQUxELFdBQVksbUJBQW1CO0lBQzdCLDBFQUFtRCxDQUFBO0lBQ25ELHNFQUErQyxDQUFBO0lBQy9DLHNEQUErQixDQUFBO0lBQy9CLG9FQUE2QyxDQUFBO0FBQy9DLENBQUMsRUFMVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQUs5QjtBQWtFRCxNQUFNLDBCQUEwQixHQUFHO0lBQ2pDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxTQUFTO0lBQ3hCLElBQUksRUFBRSxlQUFlO0lBQ3JCLEtBQUssRUFBRSxPQUFPO0NBQ2YsQ0FBQztBQUVGLE1BQWEsU0FBVSxTQUFRLG1DQUFnQjtJQUk3QyxZQUFZLE1BQWtCO1FBQzVCLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUpoQiw0QkFBdUIsR0FBRyxHQUFHLENBQUM7UUFDOUIsZUFBVSxHQUFhLEVBQUUsQ0FBQztRQWlGbkIsNEJBQXVCLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBZ0MsRUFBRSxFQUFFO1lBQzdHLElBQUksV0FBVyxFQUFFO2dCQUNmLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQy9DO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksNEJBQTRCLGFBQWEsTUFBTSxDQUFDLENBQUM7WUFDN0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RC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