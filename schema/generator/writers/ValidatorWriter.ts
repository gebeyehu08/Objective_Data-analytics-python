/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from "@yellicode/core";

export type EnumMemberDefinition = {
  name: string;
};

export type Enumeration = {
  export?: boolean;
  name: string;
  members: EnumMemberDefinition[];
};

export class ValidatorWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.writeLine(
      `/*\n* Copyright ${new Date().getFullYear()} Objectiv B.V.\n*/\n`
    );
    this.writeLine('import { z } from "zod";\n');
  }

  public writeEnumeration(enumeration: Enumeration): void {
    enumeration.export && this.write("export ");
    this.writeLine(`const ${enumeration.name} = z.enum([`);
    this.increaseIndent();
    enumeration.members.forEach((members) => {
      this.writeLine(`"${members.name}",`);
    });
    this.decreaseIndent();
    this.writeLine(`]);`);
  }
}
