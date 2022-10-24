/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { DocusaurusWriter } from '../writers/DocusaurusWriter';
import { getContexts, getEvents } from './parser';

const destination = '../generated/docs/';

[...getContexts(), ...getEvents()].forEach((entity) => {
	const entityCategory = entity.isEvent ? 'event' : 'context';
	const primaryDescription = entity.getDescription({ type: 'markdown', target: 'primary' });
	const admonitionDescription = entity.getDescription({ type: 'markdown', target: 'admonition' });

	const isAbstract = entity.isAbstract;
	const isLocationContext = entity.isLocationContext;
	const isGlobalContext = entity.isGlobalContext;

	const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location-' : isGlobalContext ? 'global-' : '';
	const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;

	Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entity.name}.md` }, (writer: TextWriter) => {
		const docsWriter = new DocusaurusWriter(writer);
		
		docsWriter.writeH1(entity.name);
		docsWriter.writeLine();
		docsWriter.writeLine(primaryDescription);
		docsWriter.writeLine();

		docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
		docsWriter.writeLine();

		// Mermaid chart
		// docsWriter.writeMermaidChartForEntity(entityName, entityOwnProperties, requiredContexts, 
		// entityParentsWithProperties, entityChildren, "Diagram: " + entityName);
		docsWriter.writeLine();
		
		// for Events: write list of required contexts
		const rules = entity.validation?.rules;
		if (rules) {
			docsWriter.writeH3('Requires');
			docsWriter.writeLine();
			if (rules.length > 0) {
				for (let i = 0; i < rules.length; i++) {
					let rule = rules[i];
					if (['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type)) {
						const requiredName = rule.scope[0].context;
						const type = rule.type.replace('Requires', '');
						const url = '../' + type.replace('Context', '-contexts/').toLowerCase() + requiredName + '.md';
						docsWriter.writeRequiredContext(requiredName, url, type);
					}
				}
			} else {
				docsWriter.writeLine('None.');
			}
			docsWriter.writeLine();
		}
		
		// create plain content rows from the given entity's properties
		function getPropertiesRows(properties) {
			let rows = Array() as [string[]];
			properties.forEach((p) => {
				let name = '**' + p.name.replaceAll('_', '\\_') + ((p.optional || p.nullable) ? ' _[optional]_' : '') 
					+ '**';
				rows.push([name, p.type, p.description.replace(/(\r\n|\n|\r)/gm, ""), p.value]);
			});
			return rows;
		}

		// table of own properties, if any
		if (entity.ownProperties.length > 0) {
			docsWriter.writeH3('Properties');
			docsWriter.writeLine();
			docsWriter.writeTable(['', 'type', 'description', 'contains'], 
				getPropertiesRows(entity.ownProperties));
		}

		// table of inherited properties
		docsWriter.writeH3('Inherited Properties');
		docsWriter.writeLine();
		docsWriter.writeTable(['', 'type', 'description', 'contains'], 
			getPropertiesRows(entity.inheritedProperties));

		docsWriter.writeEndOfLine();
		
		// if(entity.parent) {
		// 	docsWriter.writeH3('Parent');
		// 	docsWriter.writeLine(entity.parent.name);
		// 	docsWriter.writeEndOfLine();
		// }

		// if(entity.parents.length) {
		// 	docsWriter.writeH3('All Parents');
		// 	docsWriter.writeLine(entity.parents.map(({ name }) => name).join(' > '));
		// 	docsWriter.writeEndOfLine();
		// }

		// if(entity.ownChildren.length) {
		// 	docsWriter.writeH3('Own Children');
		// 	docsWriter.writeLine(entity.ownChildren.map(({ name }) => name).join(', '));
		// 	docsWriter.writeEndOfLine();
		// }

		// if(entity.children.length) {
		// 	docsWriter.writeH3('All Children');
		// 	docsWriter.writeLine(entity.children.map(({ name }) => name).join(', '));
		// 	docsWriter.writeEndOfLine();
		// }

		// if(entity.ownProperties.length) {
		// 	docsWriter.writeH3('Own Properties');

		// 	entity.ownProperties.forEach((entityProperty) => {
		// 		const { name, type, description, internal } = entityProperty;
		// 		if (!internal) {
		// 			docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
		// 		}
		// 	});

		// 	docsWriter.writeEndOfLine();
		// }

		// if(entity.inheritedProperties.length) {
		// 	docsWriter.writeH3('Inherited Properties');

		// 	entity.inheritedProperties.forEach((entityProperty) => {
		// 		const { name, type, description, internal } = entityProperty;
		// 		if (!internal) {
		// 			docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
		// 		}
		// 	});

		// 	docsWriter.writeEndOfLine();
		// }

		// if(entity.properties.length) {
		// 	docsWriter.writeH3('All Properties');

		// 	entity.properties.forEach((entityProperty) => {
		// 		const { name, type, description, internal } = entityProperty;
		// 		if (!internal) {
		// 			docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
		// 		}
		// 	});

		// 	docsWriter.writeEndOfLine();
		// }

		// final notes
		docsWriter.writeLine(admonitionDescription);
	});
});
