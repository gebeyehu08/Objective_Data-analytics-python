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

	// extract required contexts for this entity
	// TODO: turn into a proper objectiv with keys instead of an array
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
	
	Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entity.name}.md` }, (writer: TextWriter) => {
		const docsWriter = new DocusaurusWriter(writer);

		docsWriter.writeH1(entity.name);
		docsWriter.writeLine();
		docsWriter.writeLine(primaryDescription);
		docsWriter.writeLine();

		docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
		docsWriter.writeLine();

		// Mermaid chart
		docsWriter.writeMermaidChartForEntity(entity, "Diagram: " + entity.name + ' inheritance');
		docsWriter.writeLine();

		// for Events: write list of required contexts
		if (entity.isEvent) {
			docsWriter.writeH3('Requires');
			docsWriter.writeLine();
			if (requiredContexts.length > 0) {
				for (let i = 0; i < requiredContexts.length; i++) {
					let rc = requiredContexts[i];
					docsWriter.writeRequiredContext(rc[0], rc[2], rc[1]);
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

		// final notes
		docsWriter.writeLine(admonitionDescription);
	});
});
