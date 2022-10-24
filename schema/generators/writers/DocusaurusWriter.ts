/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';

export type EntityDefinition = {
  name: string;
  parents: EntityDefinition[];
	children: EntityDefinition[];
	ownProperties: [
		{
			type: string;
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
		]
	};
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
		// TODO write copyright
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
   * @param {EntityDefinition} entityName - The entity for which to generate the Mermaid graph.
   * @param {string} [caption] - A caption for the chart.
   */
	public writeMermaidChartForEntity(
		entity: EntityDefinition,
		caption: string
	) {
		// TODO: description
    function getRequiredContextsAndProperties(entity: EntityDefinition) {
			
			// first, extract required contexts for this entity
			const rules = entity.validation?.rules;
			let requiredContexts = Array();
			if (rules && rules.length > 0) {
				for (let i = 0; i < rules.length; i++) {
					let rule = rules[i];
					if (['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type)) {
						const requiredName = rule.scope[0].context;
						const type = rule.type.replace('Requires', '');
						const url = '../' + type.replace('Context', '-contexts/').toLowerCase() + requiredName + '.md';
						requiredContexts.push([requiredName, type, url])
					}
				}
			}
			
			// second, get its properties
			const properties = entity.ownProperties;

			// now, let's start writing the entity's required contexts & properties
			let cap = entity.name;
      const hasContextsOrProperties =
        (requiredContexts && requiredContexts.length > 0) || 
        (properties && Object.entries(properties).length > 0);
      const hasContextsAndProperties =
        (requiredContexts && requiredContexts.length > 0) && 
        (properties && Object.entries(properties).length > 0);
      if (hasContextsOrProperties) {
        cap += ('["' + entity.name);
        if (hasContextsAndProperties) {
          cap += ("<span class='requires_context_and_properties'>");
        }

        // write the required contexts
        if (requiredContexts && requiredContexts.length > 0) {
          cap += ("<span class='requires_context'>requires:<br />");
          requiredContexts.forEach((requiredContext) => {
            cap += (requiredContext.contextName + '<br />');
          });
          cap += ('</span>');
        }

        // write the properties
        if (properties) {
          cap += ("<span class='properties'>");
          for (const [key, value] of Object.entries(properties)) {
            cap += (key.toString() + ': ' + value.type + '<br />');
          }
          cap += ('</span>');
        }

        if (hasContextsAndProperties) {
          cap += ("</span");
        }
        cap += ('"]');
      }
      return cap;
    }
		
		this.writeLine('<Mermaid chart={`');
		this.increaseIndent();
		this.increaseIndent();
		this.writeLine('graph LR');

		// first, get its parents in reverse order
		const parents = entity.parents.reverse();
		this.increaseIndent();
		this.writeIndent();
		for (let i = 0; i < parents.length; i++) {
			// write the parents' required contexts & properties
			const p = parents[i];
			let parentCap = getRequiredContextsAndProperties(p);
			this.write(parentCap);

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
		this.writeIndent();
		// write relation with any previous parent first, if there's more than 1 parent
		if (entity.parents.length > 1) {
			this.write(entity.parents[entity.parents.length - 1].name + ' --> ');
		}
		let entityCap = getRequiredContextsAndProperties(entity);
		this.write(entityCap);
		this.write(';');
		this.writeEndOfLine();

		// show its children as well, just with their names
		if (entity.children && entity.children.length > 0) {
			for (let i = 0; i < entity.children.length; i++) {
				let child = entity.children[i];
				this.writeLine(entity.name + ' --> ' + child + ';');
			}
		}

		this.decreaseIndent();
		this.writeLine('class ' + entity.name + ' diagramActive');
		this.decreaseIndent();

		this.writeLine('`}');
		this.writeLine('caption="' + caption + '"');
		this.writeLine('baseColor="blue"');

		// write links to elements for all parents
		if (parents.length > 0) {
			this.writeLine('links={[');
		}
		this.increaseIndent();
		for (let i = 0; i < parents.length; i++) {
			// write the links to parents
			const parent = parents[i];
			let path = '/taxonomy/reference/'
			// if (parent.subCategory == "Abstract") {
			// 	path += 'abstracts/';
			// }
			// else if (parent.subCategory == "Event") {
			// 	path += 'events/';
			// }
			// else if (parent.subCategory == "GlobalContext") {
			// 	path += 'global-contexts/';
			// }
			// else if (parent.subCategory == "LocationContext") {
			// 	path += 'location-contexts/';
			// }
			this.writeLine('{ name: \'' + parent.name + '\', to: \'' + path + parent.name + '\' },');
		}
		this.decreaseIndent();
		if (parents.length > 0) {
			this.writeLine(']}');
		}

		this.decreaseIndent();
		this.writeLine('/>');
	}

}