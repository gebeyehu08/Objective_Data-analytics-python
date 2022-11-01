/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';

export type EntityDefinition = {
  name: string;
  isAbstract: boolean;
  isContext: boolean;
  isEvent: boolean;
  parents: EntityDefinition[];
  children: EntityDefinition[];
  ownProperties: [
    {
      name: string;
      description: string;
      type: string;
      internal: boolean;
      optional: boolean;
      nullable: boolean;
    }
  ];
  validation: {
    rules: [
      {
        scope: {
          context: string;
        };
        type: string;
      }
    ];
  };
  rules: Function;
  ownRules: Function;
  inheritedRules: Function;
  _parent: string;
  _rules: [];
};

export type RequiredContextsDefinition = {
  name: string;
  type: string;
  url: string;
};

export class DocusaurusWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '  ';
  }

  /**
   * Write frontmatter to the document.
   * @param slug URL for the document.
   */
  public writeFrontmatter(slug) {
    if (slug != '') {
      this.writeLine('---');
      this.writeLine('slug: ' + slug);
      this.writeLine('---');
      this.writeLine();
    }
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
   * Write a list item (*).
   * @param {string} text - The content of the list item.
   */
  public writeListItem(text: string) {
    this.writeLine('* ' + text);
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
   * @param {string} type - The type of required context (e.g. 'LocationContext').
   */
  // required contexts list item for a taxonomy doc
  public writeRequiredContext(text: string, url: string, type: string) {
    this.writeLine('* [' + text + '](' + url + ') (a ' + type + ').');
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

    // now let's first write the header and then the separator
    this.writeTableRow(columnNames, columnLengths);
    let headerSeparatorColumns = [];
    columnNames.forEach((column) => {
      headerSeparatorColumns.push('');
    });
    this.writeTableRow(headerSeparatorColumns, columnLengths, ':', '-', '-');

    // finally, write the table content
    rows.forEach((row) => {
      if (row.length > 0) {
        this.writeTableRow(row, columnLengths);
      }
    });
  }

  /**
   * Write a Mermaid chart definition for a specific entity.
   * @param {EntityDefinition} entityName - The entity for which to generate the Mermaid graph.
   * @param {string} [caption] - A caption for the chart.
   */
  public writeMermaidChartForEntity(entity: EntityDefinition, caption: string) {
    /**
     * Generate the HTML for requiredContexts and properties for a given entity.
     * @param entity The entity to get its required contexts & properties from.
     * @returns {string} - Formatted HTML with contexts & properties.
     */
    function getRequiredContextsAndProperties(entity: EntityDefinition) {
      // first, extract the requiredContexts for this entity, from the validation rules
      const rules = entity.ownRules;
      let requiredContexts = Array();
      if (rules && rules.length > 0) {
        for (let i = 0; i < rules.length; i++) {
          let rule = rules[i];
          // show required contexts if they're location or global, and if it's either an AbstractEvent or
          // they contexts are not inherited
          if (
            ['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type) &&
            (entity.name == 'AbstractEvent' || !rule._inheritedFrom)
          ) {
            const requiredName = rule.scope[0].context;
            const type = rule.type.replace('Requires', '');
            const url = '../' + type.replace('Context', '-contexts/').toLowerCase() + requiredName + '.md';
            requiredContexts.push([requiredName, type, url]);
          }
        }
      }

      // second, get its properties
      const properties = entity.ownProperties;

      // finally, format the entity's required contexts & properties in HTML
      let cap = entity.name;
      const hasContextsOrProperties =
        (requiredContexts && requiredContexts.length > 0) || (properties && Object.entries(properties).length > 0);
      const hasContextsAndProperties =
        requiredContexts && requiredContexts.length > 0 && properties && Object.entries(properties).length > 0;

      if (hasContextsOrProperties) {
        cap += '["' + entity.name + (hasContextsAndProperties ? "<span class='requires_context_and_properties'>" : '');

        // write the required contexts
        if (requiredContexts && requiredContexts.length > 0) {
          cap += "<span class='requires_context'>requires:<br />";
          requiredContexts.forEach((requiredContext) => {
            cap += requiredContext[0] + '<br />';
          });
          cap += '</span>';
        }

        // write the properties
        if (properties) {
          cap += "<span class='properties'>";
          for (const [key, value] of Object.entries(properties)) {
            if (!value.internal) {
              cap += value.name + (value.nullable ? '?' : '') + ': ' + value.type + '<br />';
            }
          }
          cap += '</span>';
        }

        cap += (hasContextsAndProperties ? '</span>' : '') + '"]';
      }
      return cap;
    }

    // now start writing the chart
    this.writeLine('<Mermaid chart={`');
    this.increaseIndent();
    this.increaseIndent();
    this.writeLine('graph LR');

    // first, write its parents in reverse order
    const parents = entity.parents;
    this.increaseIndent();
    this.writeIndent();
    for (let i = 0; i < parents.length; i++) {
      const parentRcap = getRequiredContextsAndProperties(parents[i]);
      this.write(parentRcap);
      // start every relation on a new line
      if (i > 0 && i % 2 == 1) {
        this.write(';');
        this.writeEndOfLine();
        // write this parent's name again if there are more parents
        if (parents.length > i) {
          this.writeIndent();
          this.write(parentRcap + ' --> ');
        }
      } else {
        if (i < parents.length) {
          this.write(' --> ');
        }
      }
    }

    // write this entity and its requirements & properties
    this.writeIndent();
    let entityRcap = getRequiredContextsAndProperties(entity);
    this.write(entityRcap + ';');
    this.writeEndOfLine();

    // show its children as well
    const children = entity.children;
    if (children && children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        let childRcap = getRequiredContextsAndProperties(child);
        const parent = child._parent;
        this.writeLine((parent != entity.name ? child._parent : entity.name) + ' --> ' + childRcap + ';');
      }
    }

    this.decreaseIndent();
    this.writeLine('class ' + entity.name + ' diagramActive');
    this.decreaseIndent();

    this.writeLine('`}');
    this.writeLine('caption="' + caption + '"');
    this.writeLine('baseColor="blue"');

    /**
     * Get formatted links to a given set of entities.
     * @param entities The entities to generate links for.
     * @returns {string} A formatted set of links to the given entities.
     */
    function getFormattedLinksToEntities(entities) {
      let links = '';
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        let path = '/taxonomy/';
        // special case for AbstractContext; skip it
        if (entity.name == 'AbstractContext') {
          continue;
        } else if (entity.isAbstract) {
          path +=
            entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim().replace(' ', '-').toLowerCase() + 's';
        } else if (entity.isEvent) {
          path += 'reference/events/' + entity.name;
        } else if (entity.isGlobalContext) {
          path += 'reference/global-contexts/' + entity.name;
        } else if (entity.isLocationContext) {
          path += 'reference/location-contexts/' + entity.name;
        }
        links += "{ name: '" + entity.name + "', to: '" + path + "' }, ";
      }
      return links;
    }

    // write links to elements for all parents & children
    if (parents.length > 0 || children.length > 0) {
      this.writeLine('links={[');
    }
    this.increaseIndent();
    this.write(getFormattedLinksToEntities(parents));
    this.write(getFormattedLinksToEntities(children));
    this.decreaseIndent();
    if (parents.length > 0 || children.length > 0) {
      this.writeLine(']}');
    }

    this.decreaseIndent();
    this.writeLine('/>');
  }
}
