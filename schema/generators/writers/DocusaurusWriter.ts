/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';
import { timeStamp } from 'console';
import { RecordWithTtl } from 'dns';
import { RmOptions } from 'fs';

export type TaxonomyPropertyDefinition = {
  name: string;
  typeName: string;
  isOptional?: boolean;
  value?: string;
  description?: string;
  contains?: string;
};

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

  // required contexts list item for a taxonomy doc
  public writeRequiredContext(text: string, url: string) {
    this.writeLine('* [' + text + '](' + url + ').');
  }

  public writeTableRow(columns: string[], colLengths: number[], startChar = " ", fillChar=" ", endChar=" ") {
    this.write('|');
    for (let i = 0; i < columns.length; i++) {
      let columnContent = columns[i]?? ""; // deal with 'undefined' entries
      this.write(startChar + columnContent);
      // fill columns with spaces for max length of column
      let columnLength = columnContent.length;
      for (let k = 0; k < (colLengths[i] - columnLength); k++ ) {
        this.write(fillChar);
      }
      this.write(endChar + "|");
    }
    this.writeEndOfLine();
  }

  public writeTable(columns: string[], rows: [string[]]) {
    // first determine the length of each column, based on max length of content (min is column header length)
    let columnLengths = [] as number[];
    columns.forEach((column) => {
      columnLengths.push(column.length);
    })
    rows.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        let columnContent = row[i];
        if(columnContent && (columnLengths[i] < columnContent.length)) {
          columnLengths[i] = columnContent.length;
        };
      }
    });
    
    // now let's write the content, starting with the heder
    this.writeTableRow(columns, columnLengths)

    // then write header separator
    let headerSeperatorColumns = [];
    columns.forEach((column) => {
      headerSeperatorColumns.push("");
    });
    this.writeTableRow(headerSeperatorColumns, columnLengths, ":", "-", "-")

    // finally, write table content
    rows.forEach((row) => {
      if(row.length > 0) {
        this.writeTableRow(row, columnLengths)
      }
    });
  }

  public writeEmphasisLine(text: string, strong: boolean = false) {
    if (strong) this.writeLine('**' + text + '**');
    else this.writeLine('*' + text + '*');
  }
}
