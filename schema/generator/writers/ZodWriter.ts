/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';

export type EnumMemberDefinition = {
  name: string;
};

export type Enumeration = {
  export?: boolean;
  name: string;
  members: EnumMemberDefinition[];
};

export interface PropertyDefinition {
  name: string;
  typeName: string;
  isOptional?: boolean;
  value?: string;
}

export class ZodWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
    this.writeLine('import { z } from "zod";\n');
  }

  public writeEnumeration(enumeration: Enumeration): void {
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
    // FIXME Indent doesn't work here for some reason
    this.increaseIndent();
    this.writeIndent();

    // TODO mapping between schema and zod for typeName (eg: integer > number)
    this.write(`${property.name}: z.${property.typeName}(${property.value ?? ''})`);

    if (property.isOptional) {
      this.write('.optional()');
    }

    this.writeEndOfLine(',');
    this.decreaseIndent();
  }
}
