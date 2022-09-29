/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, CodeWriterUtility, TextWriter } from '@yellicode/core';

export type EnumMemberDefinition = {
  name: string;
};

export type Enumeration = {
  export?: boolean;
  name: string;
  members: EnumMemberDefinition[];
  description?: string;
};

export interface PropertyDefinition {
  name: string;
  typeName: string;
  isOptional?: boolean;
  value?: string;
  description?: string;
}

export interface ObjectDefinition {
  name: string;
  properties: PropertyDefinition[];
  description?: string;
}

export type ArrayDefinition = {
  name: string;
  items: string[];
  discriminator?: string;
  description?: string;
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
    this.writeLine('import { z } from "zod";\n');
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
    this.writeIndent();

    if (property.description) {
      // TODO
      //this.writeJsDocLines(property.description.split('\n'));
    }

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
    this.writeLine(`);`);
    this.decreaseIndent();
    this.writeLine();
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
