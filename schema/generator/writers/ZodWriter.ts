/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, CodeWriterUtility, TextWriter } from '@yellicode/core';
import { getObjectKeys } from '../templates/common';

export enum ValidationRuleTypes {
  RequiresLocationContext = 'RequiresLocationContext',
  RequiresGlobalContext = 'RequiresGlobalContext',
  UniqueContext = 'UniqueContext',
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
  export?: boolean;
  name: string;
  members: EnumMemberDefinition[];
  description?: string;
};

export type PropertyDefinition = {
  name: string;
  typeName: string;
  isOptional?: boolean;
  value?: string;
  description?: string;
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
  name: string;
  properties: PropertyDefinition[];
  description?: string;
  rules?: ValidationRule[];
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
};

export class ZodWriter extends CodeWriter {
  documentationLineLength = 120;

  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
    this.writeFile('./validator.template.static.ts');
    this.writeLine();
  }

  public writeEnumeration(enumeration: Enumeration): void {
    if (enumeration.description) {
      this.writeJsDocLines(enumeration.description.split('\n'));
    }

    enumeration.export && this.write('export ');
    this.writeLine(`const ${enumeration.name} = z.enum([`);

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
    this.write(`${property.name}: ${mappedType ? `z.${mappedType}(${property.value ?? ''})` : property.typeName}`);

    if (property.isOptional) {
      this.write('.optional()');
    }

    this.writeEndOfLine(',');
    this.decreaseIndent();
  }

  public writeInlineObject(object: object): void {
    this.writeLine('{');
    this.increaseIndent();
    getObjectKeys(object).forEach((key) => {
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

    this.writeLine(`export const ${object.name} = z.object({`);

    object.properties.forEach((property) => this.writeProperty(property));

    this.writeIndent();
    this.write(`})`);
    this.writeRules(object);
    this.writeLine();
  }

  public writeArray = (array: ArrayDefinition) => {
    if (array.description) {
      this.writeJsDocLines(array.description.split('\n'));
    }

    this.writeLine(`export const ${array.name} = z`);
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

  public writeJsDocLines(lines: string[]) {
    this.writeLine('/**');

    lines.forEach((line) => {
      const lineLength = line ? line.length : 0;
      if (this.documentationLineLength > 0 && lineLength > this.documentationLineLength) {
        CodeWriterUtility.wordWrap(line, this.documentationLineLength).forEach((s) => this.writeLine(` * ${s}`));
      } else this.writeLine(` * ${line.trim()}`);
    });

    this.writeLine(' */');
  }

  private writeRules(subject) {
    if (!subject.rules?.length) {
      this.writeLine(';');
    } else {
      this.writeEndOfLine();
    }
    this.decreaseIndent();

    (subject.rules ?? []).forEach((rule, index) => {
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
        default:
          throw new Error(`Validation rule ${rule.type} cannot be applied to ${subject.name}.`);
      }
      if (index === subject.rules.length - 1) {
        this.write(';');
      }
      this.writeLine();
    });
  }
}
