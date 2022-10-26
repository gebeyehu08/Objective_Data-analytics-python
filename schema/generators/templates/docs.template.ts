/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { DocusaurusWriter } from '../writers/DocusaurusWriter';
import { getContexts, getEvents } from './parser';

const destination = '../generated/docs/';
let entitiesOverview = Array();

export type PropertiesDefinition = {
	name: string;
	description: string;
	type: string;
	internal: boolean;
	optional: boolean;
	nullable: boolean;
	items: {
		type: string;
	};
};

[...getContexts(), ...getEvents()].forEach((entity) => {
	const primaryDescription = entity.getDescription({ type: 'markdown', target: 'primary' });
	const admonitionDescription = entity.getDescription({ type: 'markdown', target: 'admonition' });
	
	const isAbstract = entity.isAbstract;
	const isLocationContext = entity.isLocationContext;
	const isGlobalContext = entity.isGlobalContext;
	
	let frontMatterSlug = ''; // the documentation URL, specifically set for Abstracts
	
	let outputFile = (isLocationContext ? 'location-contexts/' : isGlobalContext ? 'global-contexts/' 
	: 'events/') + entity.name + '.md';
	if(isAbstract) {
		// special case for AbstractContext; skip it
		if (entity.name == 'AbstractContext') {
			return;
		}
		outputFile = entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim().replace(' ', '-')
		.toLowerCase() + 's/overview.md';
		frontMatterSlug = "/taxonomy/reference/" + outputFile.replace('overview.md', '');

		// add this Abstract entity and its children to an Array used to generate the Reference overview page
		let abstractEntity = {
			name: entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim() + 's',
			description: primaryDescription,
			listOfChildren: []
		}
		let listOfChildren = Array();
		const children = entity.children;
		if (children && children.length > 0) {
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				const url = (child.isLocationContext ? './location-contexts/' 
					: child.isGlobalContext ? './global-contexts/' : './events/') + child.name + '.md';
				listOfChildren.push({
					name: child.name,
					url: url
				})
			}
		}
		abstractEntity.listOfChildren = listOfChildren;
		entitiesOverview.push(abstractEntity);
	}
	
	// extract required contexts for this entity
	const rules = entity.validation?.rules;
	let requiredContexts = Array();
	if (rules && rules.length > 0) {
		for (let i = 0; i < rules.length; i++) {
			let rule = rules[i];
			if (['RequiresLocationContext', 'RequiresGlobalContext'].includes(rule.type)) {
				const requiredName = rule.scope[0].context;
				const type = rule.type.replace('Requires', '');
				const url = '../' + type.replace('Context', '-contexts/').toLowerCase() + requiredName + '.md';
				requiredContexts.push({
					name: requiredName, 
					type: type, 
					url: url
				})
			}
		}
	}
	
	Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer: TextWriter) => {
		const docsWriter = new DocusaurusWriter(writer);
		
		docsWriter.writeFrontmatter(frontMatterSlug);
		
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
					docsWriter.writeRequiredContext(rc.name, rc.url, rc.type);
				}
			} else {
				docsWriter.writeLine('None.');
			}
			docsWriter.writeLine();
		}

		/**
		 * Create plain content rows from the given entity's properties.
		 * @param properties The entity's properties.
		 * @returns {Array<string[]>} - Rows of plain, formatted content.
		 */
		function getPropertiesRows(properties: Array<PropertiesDefinition>) {
			let rows = Array() as [string[]];
			properties.forEach((p) => {
				const type = (p.type == "array") ? (p.type + "<" + p.items.type + ">") : p.type;
				if(!p.internal) {
					let name = '**' + p.name.replaceAll('_', '\\_') 
					+ ((p.optional || p.nullable) ? ' _[optional]_' : '') + '**';
					rows.push([name, type, p.description.replace(/(\r\n|\n|\r)/gm, "")]);
				}
			});
			return rows;
		}
		
		// table of own properties, if any
		if (entity.ownProperties.length > 0) {
			docsWriter.writeH3('Properties');
			docsWriter.writeLine();
			docsWriter.writeTable(['', 'type', 'description'], getPropertiesRows(entity.ownProperties));
		}

		// table of inherited properties, if any
		if (entity.inheritedProperties.length > 0) {
			docsWriter.writeH3('Inherited Properties');
			docsWriter.writeLine();
			docsWriter.writeTable(['', 'type', 'description'], getPropertiesRows(entity.inheritedProperties));
		}

		docsWriter.writeEndOfLine();
		
		// final notes
		docsWriter.writeLine(admonitionDescription);
	});
});

// generate reference/overview.md for all the relevant Abstracts
console.log("entitiesOverview:", entitiesOverview);
const outputFile = 'overview.md';
const frontMatterSlug = '/taxonomy/reference/';
Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer: TextWriter) => {
	const docsWriter = new DocusaurusWriter(writer);
		
	docsWriter.writeFrontmatter(frontMatterSlug);
	
	entitiesOverview.forEach((category) => {
		docsWriter.writeH1(category.name);
		// TODO: add description for each category
		docsWriter.writeLine(category.description);
		category.listOfChildren.forEach((child) => {
			docsWriter.write('* ');
			docsWriter.writeLink(child.name, child.url);
			docsWriter.writeEndOfLine();
		});
		docsWriter.writeLine();
	});
});
