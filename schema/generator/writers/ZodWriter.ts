/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, CodeWriterUtility, TextWriter } from '@yellicode/core';

export enum ValidationRuleTypes {
  RequiresContext = 'requires_context',
  UniqueContext = 'unique_context',
}

export type ValidationRule = {
  type: string;
  context?: string;
  position?: number;
  by?: string[];
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
  value: string | number | boolean;
};

type SuperRefineDefinition = {
  name: string;
  parameters?: ParameterDefinition[];
};

export type ObjectDefinition = {
  name: string;
  properties: PropertyDefinition[];
  description?: string;
};

export type ArrayDefinition = {
  name: string;
  items: string[];
  discriminator?: string;
  description?: string;
  rules?: ValidationRule[];
};

const SchemaToZodPropertyTypeMap = {
  integer: 'bigint',
  literal: 'literal',
  string: 'string',
  discriminator: 'literal',
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
  }

  public writeProperty(property: PropertyDefinition): void {
    this.increaseIndent();

    if (property.description) {
      this.writeJsDocLines(property.description.split('\n'));
    }

    this.writeIndent();

    this.write(`${property.name}: z.${SchemaToZodPropertyTypeMap[property.typeName]}(${property.value ?? ''})`);

    if (property.isOptional) {
      this.write('.optional()');
    }

    this.writeEndOfLine(',');
    this.decreaseIndent();
  }

  public writeObject(object: ObjectDefinition): void {
    if (object.description) {
      this.writeJsDocLines(object.description.split('\n'));
    }

    this.writeLine(`export const ${object.name} = z.object({`);

    object.properties.forEach((property) => this.writeProperty(property));

    this.writeLine(`});\n`);
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

    let formattedValue = parameter.value;
    if (Array.isArray(parameter.value)) {
      formattedValue = `['${parameter.value.join("', '")}']`;
    }

    this.write(`${parameter.name}: ${formattedValue}`);

    this.writeEndOfLine(',');
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
        case ValidationRuleTypes.RequiresContext:
          if (!rule.context) {
            throw new Error(`Validation rule ${rule.type} requires the \`context\` attribute to be set.`);
          }
          this.writeSuperRefine({
            name: 'requiresContext',
            parameters: [
              { name: 'context', value: `ContextTypes.enum.${rule.context}` },
              { name: 'position', value: rule.position },
            ],
          });
          break;
        case ValidationRuleTypes.UniqueContext:
          if (!rule.by) {
            throw new Error(`Validation rule ${rule.type} requires the \`by\` attribute to be set.`);
          }
          this.writeSuperRefine({
            name: 'uniqueContext',
            parameters: [
              { name: 'context', value: rule.context ? `ContextTypes.enum.${rule.context}` : undefined },
              { name: 'by', value: `['${rule.by.join("', '")}']` },
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
