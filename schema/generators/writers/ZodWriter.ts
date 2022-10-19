/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { JavaScriptWriter } from './JavaScriptWriter';

export enum ValidationRuleTypes {
  RequiresLocationContext = 'RequiresLocationContext',
  RequiresGlobalContext = 'RequiresGlobalContext',
  UniqueContext = 'UniqueContext',
  MatchContextProperty = 'MatchContextProperty',
}

export type ValidationRule = {
  type: string;
  scope?: Array<{
    context?: string;
    position?: number;
    includeContexts?: string[];
    excludeContexts?: string[];
    by?: string[];
  }>;
};

export type EnumMemberDefinition = {
  name: string;
};

export type Enumeration = {
  name: string;
  members: EnumMemberDefinition[];
  description?: string;
};

export type PropertyDefinition = {
  name: string;
  typeName: string;
  isNullable?: boolean;
  isOptional?: boolean;
  value?: string;
  description?: string;
  items?: {
    type: string;
  };
};

export type ParameterDefinition = {
  name: string;
  value: string | number | boolean | object[];
};

type SuperRefineDefinition = {
  name: string;
  parameters?: ParameterDefinition[];
};

export type ObjectDefinition = {
  name?: string;
  properties: PropertyDefinition[];
  description?: string;
  rules?: ValidationRule[];
};

type DiscriminatedUnionDefinition = {
  name: string;
  description?: string;
  discriminator: string;
  items: Array<string | ObjectDefinition>;
};

export type ArrayDefinition = {
  name: string;
  items: string[];
  discriminator?: string;
  description?: string;
  rules?: ValidationRule[];
};

const SchemaToZodPropertyTypeMap = {
  integer: 'number',
  literal: 'literal',
  string: 'string',
  discriminator: 'literal',
  uuid: 'string().uuid',
  array: 'array',
};

export class ZodWriter extends JavaScriptWriter {
  documentationLineLength = 120;
  exportList: string[] = [];

  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
  }

  public writeEnumeration(enumeration: Enumeration): void {
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

  public writeProperty(property: PropertyDefinition): void {
    this.increaseIndent();

    if (property.description) {
      this.writeJsDocLines(property.description.split('\n'));
    }

    this.writeIndent();

    const mappedType = SchemaToZodPropertyTypeMap[property.typeName];
    let propertyValue = property.value ?? '';
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

  public writeInlineObject(object: object): void {
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

  public writeObject(object: ObjectDefinition): void {
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

  public writeDiscriminatedUnion = ({ name, description, discriminator, items }: DiscriminatedUnionDefinition) => {
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
      } else {
        this.writeObject(item);
        this.write(`,`);
        this.writeEndOfLine();
      }
    });
    this.decreaseIndent();
    this.writeLine(`]);\n`);
  };

  public writeArray = (array: ArrayDefinition) => {
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
    if (array.rules?.length) {
      this.writeLine(';');
    }
    this.decreaseIndent();
    this.writeLine();
  };

  public writeParameter(parameter: ParameterDefinition): void {
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
    } else {
      this.writeLine(`${parameter.value},`);
    }

    this.decreaseIndent();
  }

  public writeSuperRefine = (refineDefinition: SuperRefineDefinition) => {
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

  private writeRules(subject) {
    this.decreaseIndent();

    (subject.rules ?? []).forEach((rule) => {
      switch (rule.type) {
        case ValidationRuleTypes.RequiresLocationContext:
        // TODO validate using the schema itself
        case ValidationRuleTypes.RequiresGlobalContext:
          // TODO validate using the schema itself
          if (!rule.scope || !rule.scope.length) {
            throw new Error(
              `Validation rule ${rule.type} requires the \`scope\` attribute to be set with at least one item.`
            );
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
          // TODO validate using the schema itself
          if (!rule.scope || !rule.scope.length) {
            throw new Error(
              `Validation rule ${rule.type} requires the \`scope\` attribute to be set with at least one item.`
            );
          }
          this.writeSuperRefine({
            name: 'uniqueContext',
            parameters: [
              {
                name: 'scope',
                // TODO clean up this mess and print out literal arrays on multiple lines with indent
                value: rule.scope.map(({ includeContexts, excludeContexts, by }) => ({
                  includeContexts:
                    includeContexts?.length > 0
                      ? `[${includeContexts.map((contextType) => `ContextTypes.enum.${contextType}`).join(', ')}]`
                      : undefined,
                  excludeContexts:
                    excludeContexts?.length > 0
                      ? `[${excludeContexts.map((contextType) => `ContextTypes.enum.${contextType}`).join(', ')}]`
                      : undefined,
                  by: `['${by.join("', '")}']`,
                })),
              },
            ],
          });
          break;
        case ValidationRuleTypes.MatchContextProperty:
          // TODO validate using the schema itself
          if (!rule.scope || !rule.scope.length) {
            throw new Error(
              `Validation rule ${rule.type} requires the \`scope\` attribute to be set with at least one item.`
            );
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
