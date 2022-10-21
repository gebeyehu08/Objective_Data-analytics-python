/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';

export class JSONWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '    ';
  }

  public writeJSON(content: any) {
    this.writeLine(JSON.stringify(content, null, 4))
  }
}
