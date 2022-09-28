/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { TypeScriptWriter } from '@yellicode/typescript';

export class TypescriptWriter extends TypeScriptWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
  }
}

export * from '@yellicode/typescript';
