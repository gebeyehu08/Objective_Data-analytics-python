/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';

export class DocusaurusWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
    // TODO write copyright
  }

  public writeH1(text: string): void {
    this.writeLine('# ' + text);
  }

  public writeH2(text: string): void {
    this.writeLine('## ' + text);
  }

  public writeH3(text: string): void {
    this.writeLine('### ' + text);
  }

  public writeListItem(text: string) {
    this.writeLine('* ' + text);
  }

  public writeLink(text: string, url: string) {
    this.write('[' + text + '](' + url + ')');
  }

  public writeRequiredContext(text: string, url: string) {
    this.writeLine('* [' + text + '](' + url + ').');
  }

  public writeEmphasisLine(text: string, strong: boolean = false) {
    if (strong) this.writeLine('**' + text + '**');
    else this.writeLine('*' + text + '*');
  }
}
