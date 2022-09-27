/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { TypeScriptWriter } from "@yellicode/typescript";

export class SchemaWriter extends TypeScriptWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.writeLine(`/*\n* Copyright ${new Date().getFullYear()} Objectiv B.V.\n*/\n`);
  }
}

export * from "@yellicode/typescript";
