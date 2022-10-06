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
        this.write(`${property.name}: ${mappedType ? `z.${mappedType}(${(_a = property.value) !== null && _a !== void 0 ? _a : ''})` : property.typeName}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9kV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiWm9kV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLGdEQUFvRDtBQUNwRCx5REFBc0Q7QUFFdEQsSUFBWSxtQkFLWDtBQUxELFdBQVksbUJBQW1CO0lBQzdCLDBFQUFtRCxDQUFBO0lBQ25ELHNFQUErQyxDQUFBO0lBQy9DLHNEQUErQixDQUFBO0lBQy9CLG9FQUE2QyxDQUFBO0FBQy9DLENBQUMsRUFMVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQUs5QjtBQStERCxNQUFNLDBCQUEwQixHQUFHO0lBQ2pDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGFBQWEsRUFBRSxTQUFTO0lBQ3hCLElBQUksRUFBRSxlQUFlO0NBQ3RCLENBQUM7QUFFRixNQUFhLFNBQVUsU0FBUSxtQ0FBZ0I7SUFJN0MsWUFBWSxNQUFrQjtRQUM1QixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFKaEIsNEJBQXVCLEdBQUcsR0FBRyxDQUFDO1FBQzlCLGVBQVUsR0FBYSxFQUFFLENBQUM7UUE2RW5CLDRCQUF1QixHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQWdDLEVBQUUsRUFBRTtZQUM3RyxJQUFJLFdBQVcsRUFBRTtnQkFDZixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUMvQztZQUVELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLDRCQUE0QixhQUFhLE1BQU0sQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixLQUFLLENBQUMsT0FBTyxDQUFD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