/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { TypeScriptWriter } from '@yellicode/typescript';
import { writeCopyright } from '../templates/common';

export class SchemaWriter extends TypeScriptWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
    writeCopyright(this);
  }
}

export * from '@yellicode/typescript';
