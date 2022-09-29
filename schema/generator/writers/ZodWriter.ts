/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, CodeWriterUtility, TextWriter } from '@yellicode/core';

export enum ValidationRuleTypes {
  RequiresLocationContext = 'requires_location_context',
  RequiresGlobalContext = 'requires_global_context',
  UniqueLocationContext = 'unique_location_context',
  UniqueGlobalContext = 'unique_global_context',
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
}

export type ParameterDefinition = {
  name: string;
  typeName: string;
  value: string;
}

export type ObjectDefinition = {
  name: string;
  properties: PropertyDefinition[];
  description?: string;
}

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
      this.writeLine(`"${members.name}",`);
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
    this.writeLine(`)${array.rules?.length ? '' : ';'}`);

    (array.rules ?? []).forEach((rule, index) => {
      let parameters = '';
      switch (rule.type) {
        case ValidationRuleTypes.RequiresLocationContext:
        case ValidationRuleTypes.RequiresGlobalContext:
          parameters = `context: ContextTypes.enum.${rule.context}`
          if(rule.position !== undefined) {
            parameters = `${parameters}, position: ${rule.position}`
          }
          this.writeSuperRefine(`requiresContext({ ${parameters} })`);
          break;
        case ValidationRuleTypes.UniqueLocationContext:
        case ValidationRuleTypes.UniqueGlobalContext:
          if(!rule.by) {
            throw new Error(`Validation rule ${rule.type} requires the \`by\` attribute to be set.`)
          }
          if(rule.context) {
            parameters = `context: ContextTypes.enum.${rule.context}`
          }
          parameters = `${parameters}${parameters && ', '}by: ['${rule.by.join("', '")}']`
          this.writeSuperRefine(`uniqueContext({ ${parameters} })`);
          break;
        default:
          throw new Error(`Validation rule ${rule.type} cannot be applied to ${array.name}.`);
      }
      if (index === array.rules.length - 1) {
        this.write(';');
      }
      this.writeLine();
    });

    this.decreaseIndent();
    this.writeLine();
  };

  public writeParameter(parameter: ParameterDefinition): void {
    this.increaseIndent();
    this.writeIndent();

    let formattedValue = parameter.value;
    if(Array.isArray(parameter.value)) {
      formattedValue = `['${parameter.value.join("', '")}']`;
    }

    this.write(`${parameter.name}: ${formattedValue})`);

    this.writeEndOfLine(',');
    this.decreaseIndent();
  }

  public writeSuperRefine = (refineName) => {
    this.writeIndent();
    this.write(`.superRefine(${refineName})`);
  };

  public writeJsDocLines(lines: string[]) {
    this.writeLine('/**');

    lines.forEach((line) => {
      const lineLength = line ? line.length : 0;
      if (this.documentationLineLength > 0 && lineLength > this.documentationLineLength) {
        CodeWriterUtility.wordWrap(line, this.documentationLineLength).forEach((s) => this.writeLine(` * ${s}`));
      } else this.writeLine(` * ${line}`);
    });

    this.writeLine(' */');
  }
}
