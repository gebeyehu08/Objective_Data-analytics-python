/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, CodeWriterUtility, TextWriter } from '@yellicode/core';

export class JavaScriptWriter extends CodeWriter {
  documentationLineLength = 120;

  constructor(writer: TextWriter, { writeCopyright } = { writeCopyright: true }) {
    super(writer);
    this.indentString = '  ';
    if (writeCopyright) {
      writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
    }
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

  public writeJSONObject(object: object) {
    this.writeLine('{');
    this.increaseIndent();

    const objectKeys = Object.keys(object);
    objectKeys.forEach((key, index) => {
      const value = object[key];
      this.writeIndent();
      this.write(`"${key}": `);
      if (typeof value === 'string') {
        this.write(`"${value}"`);
      } else if (Array.isArray(value)) {
        this.write(`["${(value as Array<unknown>).join('", "')}"]`);
      } else {
        this.write(value);
      }
      this.write(index < objectKeys.length - 1 ? ',' : '');
      this.writeEndOfLine();
    });

    this.decreaseIndent();
    this.writeLine('}');
  }
}
