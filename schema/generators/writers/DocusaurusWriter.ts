/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';
import { PrefixingTransform } from '@yellicode/elements';

export type TaxonomyPropertyDefinition = {
  name: string;
  type: string;
  optional?: boolean;
  value?: string;
  description?: string;
  contains?: string;
};

export type EntityPropertyDefinition = {
  type: string;
};

export type RequiredContextsDefinition = {
  contextClass: string;
  contextName: string;
};

export type EntityParentDefinition = {
  name?: string;
  properties?: TaxonomyPropertyDefinition[];
  requiredContexts?: RequiredContextsDefinition[];
};

export class DocusaurusWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
  }

  /**
   * Write an H1 element.
   * @param {string} text - The content of the H1 element.
   */
  public writeH1(text: string): void {
    this.writeLine('# ' + text);
  }

  /**
   * Write an H2 element.
   * @param {string} text - The content of the H2 element.
   */
  public writeH2(text: string): void {
    this.writeLine('## ' + text);
  }

  /**
   * Write an H3 element.
   * @param {string} text - The content of the H3 element.
   */
  public writeH3(text: string): void {
    this.writeLine('### ' + text);
  }

  /**
   * Write a line that's emphasized.
   * @param {string} text - The content of the emphasized line.
   * @param {boolean} [strong=false] - Whether to make the line bold.
   */
  public writeEmphasisLine(text: string, strong: boolean = false) {
    if (strong) this.writeLine('**' + text + '**');
    else this.writeLine('*' + text + '*');
  }

  /**
   * Write a list item (*).
   * @param {string} text - The content of the list item.
   */
  public writeListItem(text: string) {
    this.writeLine('* ' + text);
  }

  /**
   * Write a link.
   * @param {string} text - The content of the link.
   * @param {string} url - The URL of the link.
   */
  public writeLink(text: string, url: string) {
    this.write('[' + text + '](' + url + ')');
  }

  /**
   * Write a list item line with a required context and its link.
   * @param {string} text - The content of the required context line.
   * @param {string} url - The URL of the link to the required context.
   */
  // required contexts list item for a taxonomy doc
  public writeRequiredContext(text: string, url: string) {
    this.writeLine('* [' + text + '](' + url + ').');
  }

  /**
   * Write a table row that's not a header.
   * @param {string[]} columns - The columns to write for the row.
   * @param {number[]} colLengths - The number of characters in each column.
   * @param {string} [startChar=" "] - Starting character(s) for each column, e.g. to start with a space.
   * @param {string} [fillChar=" "] - Character(s) to fill each column with up until its max length.
   * @param {string} [endChar=" "] - Ending character(s) for each column, e.g. to end with a space.
   */
  public writeTableRow(columns: string[], colLengths: number[], startChar = ' ', fillChar = ' ', endChar = ' ') {
    this.write('|');
    for (let i = 0; i < columns.length; i++) {
      let columnContent = columns[i] ?? ''; // deal with 'undefined' entries
      this.write(startChar + columnContent);
      // fill columns with spaces for max length of column
      let columnLength = columnContent.length;
      for (let k = 0; k < colLengths[i] - columnLength; k++) {
        this.write(fillChar);
      }
      this.write(endChar + '|');
    }
    this.writeEndOfLine();
  }

  /**
   * Write a table.
   * @param {string[]} columnNames - The titles of the columns.
   * @param {[string[]]} rows - The rows with each entry being a row.
   */
  public writeTable(columnNames: string[], rows: [string[]]) {
    // first determine the length of each column, based on max length of content (min is column header length)
    let columnLengths = [] as number[];
    columnNames.forEach((column) => {
      columnLengths.push(column.length);
    });
    rows.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        let columnContent = row[i];
        if (columnContent && columnLengths[i] < columnContent.length) {
          columnLengths[i] = columnContent.length;
        }
      }
    });

    // now let's first write the heder
    this.writeTableRow(columnNames, columnLengths);
    // then write the header separator
    let headerSeperatorColumns = [];
    columnNames.forEach((column) => {
      headerSeperatorColumns.push('');
    });
    this.writeTableRow(headerSeperatorColumns, columnLengths, ':', '-', '-');

    // finally, write the table content
    rows.forEach((row) => {
      if (row.length > 0) {
        this.writeTableRow(row, columnLengths);
      }
    });
  }

  /**
   * Write a Mermaid chart definition for a specific entity.
   * @param {string} entityName - The entity for which to generate the Mermaid graph.
   * @param {EntityPropertyDefinition[]} entityProperties - The entity's own properties (not inherited).
   * @param {EntityParentDefinition[]} entityParents - The entity's parents.
   * @param {RequiredContextsDefinition[]} requiredContexts - The entity's required Contexts.
   * @param {string} [caption] - A caption for the chart.
   */
  public writeMermaidChartForEntity(
    entityName: string,
    entityProperties: EntityPropertyDefinition[],
    entityParents: EntityParentDefinition[],
    requiredContexts: RequiredContextsDefinition[],
    caption: string
  ) {
    this.writeLine('<Mermaid chart={`');
    this.increaseIndent();
    this.increaseIndent();
    this.writeLine('graph LR');

    // first, get its parents in reverse order
    const parents = entityParents.reverse();
    this.increaseIndent();
    this.writeIndent();
    for (let i = 0; i < parents.length; i++) {
      const parent = parents[i];
      this.write(parent.name);
      // write the parents' required contexts & properties
      const parentHasContextsOrProperties =
        (parent.requiredContexts && parent.requiredContexts.length > 0) || 
        (parent.properties && Object.entries(parent.properties).length > 0);
      const parentHasContextsAndProperties =
        (parent.requiredContexts && parent.requiredContexts.length > 0) && 
        (parent.properties && Object.entries(parent.properties).length > 0);
      if (parentHasContextsOrProperties) {
        this.write('["' + parent.name);
        if (parentHasContextsAndProperties) {
          this.write("<span class='requires_context_and_properties'>");
        }

        // write the parents' required contexts
        if (parent.requiredContexts && parent.requiredContexts.length > 0) {
          this.write("<span class='requires_context'>requires:<br />");
          parent.requiredContexts.forEach((requiredContext) => {
            this.write(requiredContext.contextName + '<br />');
          });
          this.write('</span>');
        }

        // write the parents' properties
        if (parent.properties) {
          this.write("<span class='properties'>");
          for (const [key, value] of Object.entries(parent.properties)) {
            this.write(key.toString() + ': ' + value.type + '<br />');
          }
          this.write('</span>');
        }

        if (parentHasContextsAndProperties) {
          this.write("</span");
        }

        this.write('"]');
      }

      // start every relation on a new line
      if (i > 0 && i % 2 == 1) {
        this.write(';');
        this.writeEndOfLine();
      } else {
        if (i < parents.length) {
          this.write(' --> ');
        }
      }
    }

    // write this entity and its requirements & properties
    // TODO: generalize into a function also used for parents
    const hasContextsOrProperties = requiredContexts.length > 0 || Object.entries(entityProperties).length > 0;
    this.writeIndent();
    // write relation with any previous parent first
    if (entityParents.length > 0) {
      this.write(entityParents[entityParents.length - 1].name + ' --> ');
    }
    this.write(entityName);
    if (hasContextsOrProperties) {
      this.write('["' + entityName);
      if (requiredContexts.length > 0) {
        this.write("<span class='requires_context'>requires:<br />");
        requiredContexts.forEach((requiredContext) => {
          this.write(requiredContext.contextName + '<br />');
        });
        this.write('</span>');
      }
      if (Object.entries(entityProperties).length > 0) {
        this.write("<br /><span class='properties'>");
        for (const [key, value] of Object.entries(entityProperties)) {
          this.write(key.toString() + ': ' + value.type + '<br />');
        }
        this.write('</span>');
      }
      this.write('"]');
    }
    this.write(';');
    this.writeEndOfLine();

    this.decreaseIndent();
    this.writeLine('class ' + entityName + ' diagramActive');
    this.decreaseIndent();

    this.writeLine('`}');
    this.writeLine('caption="' + caption + '"');
    this.writeLine('baseColor="blue"');
    // TODO: Add links to elements

    this.decreaseIndent();
    this.writeLine('/>');
  }
}
