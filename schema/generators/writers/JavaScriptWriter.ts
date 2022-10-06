/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, CodeWriterUtility, TextWriter } from '@yellicode/core';

export class JavaScriptWriter extends CodeWriter {
  documentationLineLength = 120;

  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
    writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
  }

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
}
