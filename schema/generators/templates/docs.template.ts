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

	const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location_' : isGlobalContext ? 'global_' : '';
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

		if(entity.parent) {
			docsWriter.writeH3('Parent');
			docsWriter.writeLine(entity.parent.name);
			docsWriter.writeEndOfLine();
		}

		if(entity.parents.length) {
			docsWriter.writeH3('All Parents');
			docsWriter.writeLine(entity.parents.map(({ name }) => name).join(' > '));
			docsWriter.writeEndOfLine();
		}

		if(entity.ownChildren.length) {
			docsWriter.writeH3('Own Children');
			docsWriter.writeLine(entity.ownChildren.map(({ name }) => name).join(', '));
			docsWriter.writeEndOfLine();
		}

		if(entity.children.length) {
			docsWriter.writeH3('All Children');
			docsWriter.writeLine(entity.children.map(({ name }) => name).join(', '));
			docsWriter.writeEndOfLine();
		}

		if(entity.ownProperties.length) {
			docsWriter.writeH3('Own Properties');

			entity.ownProperties.forEach((entityProperty) => {
				const { name, type, description, internal } = entityProperty;
				if (!internal) {
					docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
				}
			});

			docsWriter.writeEndOfLine();
		}

		if(entity.inheritedProperties.length) {
			docsWriter.writeH3('Inherited Properties');

			entity.inheritedProperties.forEach((entityProperty) => {
				const { name, type, description, internal } = entityProperty;
				if (!internal) {
					docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
				}
			});

			docsWriter.writeEndOfLine();
		}

		if(entity.properties.length) {
			docsWriter.writeH3('All Properties');

			entity.properties.forEach((entityProperty) => {
				const { name, type, description, internal } = entityProperty;
				if (!internal) {
					docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
				}
			});

			docsWriter.writeEndOfLine();
		}

		docsWriter.writeLine(admonitionDescription);
	});
});
