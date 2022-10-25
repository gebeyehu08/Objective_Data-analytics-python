"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodWriter = exports.ValidationRuleTypes = void 0;
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
        if (property.isNullable) {
            this.write('.nullable()');
        }
        if (property.isOptional) {
            this.write('.optional()');
        }
        this.writeEndOfLine(',');
        this.decreaseIndent();
    }
    writeInlineObject(object) {
        this.writeLine('{');
        this.increaseIndent();
        Object.keys(object).forEach((key) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiWm9kV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiWm9kV3JpdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHlEQUFzRDtBQUV0RCxJQUFZLG1CQUtYO0FBTEQsV0FBWSxtQkFBbUI7SUFDN0IsMEVBQW1ELENBQUE7SUFDbkQsc0VBQStDLENBQUE7SUFDL0Msc0RBQStCLENBQUE7SUFDL0Isb0VBQTZDLENBQUE7QUFDL0MsQ0FBQyxFQUxXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBSzlCO0FBbUVELE1BQU0sMEJBQTBCLEdBQUc7SUFDakMsT0FBTyxFQUFFLFFBQVE7SUFDakIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsYUFBYSxFQUFFLFNBQVM7SUFDeEIsSUFBSSxFQUFFLGVBQWU7SUFDckIsS0FBSyxFQUFFLE9BQU87Q0FDZixDQUFDO0FBRUYsTUFBYSxTQUFVLFNBQVEsbUNBQWdCO0lBSTdDLFlBQVksTUFBa0I7UUFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBSmhCLDRCQUF1QixHQUFHLEdBQUcsQ0FBQztRQUM5QixlQUFVLEdBQWEsRUFBRSxDQUFDO1FBbUZuQiw0QkFBdUIsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFnQyxFQUFFLEVBQUU7WUFDN0csSUFBSSxXQUFXLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDL0M7WUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsSUFBSSw0QkFBNEIsYUFBYSxNQUFNLENBQUMsQ0FBQztZQUM3RSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsS0FBSyxDQUFDLE9B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