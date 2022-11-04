/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { DocusaurusWriter } from '../writers/DocusaurusWriter';
import { getContexts, getEvents, getTypes } from './parser';

const destination = '../generated/docs/';
let entitiesOverview = Array(); // stores the full list of entities, used to generate overview pages
let typesOverview = Array(); // stores the full list of Types, used to generate overview pages

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
  const secondaryDescription = entity.getDescription({ type: 'markdown', target: 'secondary' });
  const admonitionDescription = entity.getDescription({ type: 'markdown', target: 'admonition' });

  const isAbstract = entity.isAbstract;
  const isLocationContext = entity.isLocationContext;
  const isGlobalContext = entity.isGlobalContext;

  let frontMatterSlug = ''; // the documentation URL, specifically set for Abstracts

  let outputFile =
    (isLocationContext ? 'location-contexts/' : isGlobalContext ? 'global-contexts/' : 'events/') + entity.name + '.md';
  if (isAbstract) {
    // special case for AbstractContext; skip it
    if (entity.name == 'AbstractContext') {
      return;
    }
    outputFile =
      entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim().replace(' ', '-').toLowerCase() +
      's/overview.md';
    frontMatterSlug = '/taxonomy/' + outputFile.replace('overview.md', '');

    // add this Abstract entity and its children to an Array used to generate the Reference overview page
    let abstractEntity = {
      name: entity.name.replace('Abstract', '').replace(/[A-Z]/g, ' $&').trim() + 's',
      description: secondaryDescription,
      listOfChildren: [],
    };
    let listOfChildren = Array();
    const children = entity.children;
    if (children && children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const url =
          (child.isLocationContext
            ? './location-contexts/'
            : child.isGlobalContext
            ? './global-contexts/'
            : './events/') +
          child.name +
          '.md';
        listOfChildren.push({
          name: child.name,
          url: url,
        });
      }
    }
    abstractEntity.listOfChildren = listOfChildren;
    entitiesOverview.push(abstractEntity);
  }

  // extract required contexts for this entity
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
        requiredContexts.push({
          name: requiredName,
          type: type,
          url: url,
        });
      }
    }
    // store the required Contexts in the entity itself, to use later on for showing its rules or not
    entity.requiredContexts = requiredContexts;
  }

  Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer: TextWriter) => {
    const docsWriter = new DocusaurusWriter(writer);

    docsWriter.writeFrontmatter(frontMatterSlug);

    docsWriter.writeH1(entity.name);
    docsWriter.writeLine();
    if (isAbstract) {
      docsWriter.writeLine(secondaryDescription);
    } else {
      docsWriter.writeLine(primaryDescription);
    }
    docsWriter.writeLine();

    docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
    docsWriter.writeLine();

    // Mermaid chart
    docsWriter.writeMermaidChartForEntity(entity, 'Diagram: ' + entity.name + ' inheritance');
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
        // format arrays of types like GlobalContexts appropriately
        let type = p.type == 'array' ? p.type + '<' + p.items.type + '>' : p.type;
        if (['GlobalContexts', 'LocationStack'].includes(p.type)) {
          type = '[' + type + '](/taxonomy/reference/types/' + p.type + ')';
        }
        if (!p.internal) {
          let name = '**' + p.name.replace(/_/g, '\\_') + (p.optional || p.nullable ? ' _[optional]_' : '') + '**';
          rows.push([name, type, p.description.replace(/(\r\n|\n|\r)/gm, '')]);
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

    if (entity.ownRules.length) {
      // Build a list of own rules summaries
      let ruleSummaries = [];
      entity.ownRules.forEach((entityRule) => {
        getRuleSummaries(entityRule, ruleSummaries, entity);
      });

      if (ruleSummaries.length > 0) {
        docsWriter.writeH3('Validation Rules');
        // Remove dupes
        [...new Set(ruleSummaries)]
          // Sort
          .sort((a, b) => a.localeCompare(b))
          // Write a line per rule
          .forEach((ruleSummary) => docsWriter.writeListItem(ruleSummary + '.'));
      }
      docsWriter.writeLine();
    }

    // final notes
    docsWriter.writeLine(admonitionDescription);
  });
});

// Generate pages for Types (i.e. LocationStack and GlobalContexts)
[...getTypes()].forEach((type) => {
  const markdownDescription = type.getDescription({ type: 'markdown', target: 'primary' });
  const outputFile = 'types/' + type.name + '.md';
  typesOverview.push({
    name: type.name,
    url: '/taxonomy/reference/types/' + type.name + '.md',
  });

  Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer: TextWriter) => {
    const docsWriter = new DocusaurusWriter(writer);

    docsWriter.writeH1(type.name);
    docsWriter.writeLine(markdownDescription);
    docsWriter.writeLine();

    if (type.type) {
      docsWriter.writeH2('Contains');
      docsWriter.writeLine();
      docsWriter.write(type.type + '<');
      if (type.items) {
        let outputFile =
          '/taxonomy/reference/' +
          (type.isLocationContext ? 'location-contexts/overview.md' : 'global-contexts/overview.md');
        docsWriter.write('[' + type.items.type + '](' + outputFile + ')');
      }
      docsWriter.write('>.');
      docsWriter.writeEndOfLine();
      docsWriter.writeLine();
    }

    if (type.rules.length) {
      // Build a list of own rules summaries
      let ruleSummaries = [];
      type.rules.forEach((entityRule) => {
        getRuleSummaries(entityRule, ruleSummaries, type);
      });

      if (ruleSummaries.length > 0) {
        docsWriter.writeH2('Validation Rules');
        docsWriter.writeLine(type.validation?.description);
        docsWriter.writeLine();
        docsWriter.writeLine('Specifically:');
        // Remove dupes
        [...new Set(ruleSummaries)]
          // Sort
          .sort((a, b) => a.localeCompare(b))
          // Write a line per rule
          .forEach((ruleSummary) => docsWriter.writeListItem(ruleSummary + '.'));
        docsWriter.writeLine();
      }
    }
  });
});

// generate overview.md for all the relevant Abstracts and Types
const outputFile = 'overview.md';
const frontMatterSlug = '/taxonomy/reference/';
Generator.generate({ outputFile: `${destination}/${outputFile}` }, (writer: TextWriter) => {
  const docsWriter = new DocusaurusWriter(writer);

  docsWriter.writeFrontmatter(frontMatterSlug);

  docsWriter.writeH1('Open analytics taxonomy reference');
  docsWriter.writeLine();

  entitiesOverview.forEach((category) => {
    docsWriter.writeH2(category.name);
    docsWriter.writeLine(category.description);
    docsWriter.writeLine();
    category.listOfChildren.forEach((child) => {
      docsWriter.write('* ');
      docsWriter.writeLink(child.name, child.url);
      docsWriter.writeEndOfLine();
    });
    docsWriter.writeLine();
  });

  // also show a list of types
  docsWriter.writeH2('Types');
  docsWriter.writeLine('Describe the possible contents of properties that Events and Contexts can have.');
  typesOverview.forEach((type) => {
    docsWriter.write('* ');
    docsWriter.writeLink(type.name, type.url);
    docsWriter.writeEndOfLine();
  });
});

// generate types/overview.md for all the relevant Types
const typesOverviewOutputFile = 'types/overview.md';
const typesFrontMatterSlug = '/taxonomy/types/';
Generator.generate({ outputFile: `${destination}/${typesOverviewOutputFile}` }, (writer: TextWriter) => {
  const docsWriter = new DocusaurusWriter(writer);

  docsWriter.writeFrontmatter(typesFrontMatterSlug);

  docsWriter.writeH1('Types');
  docsWriter.writeLine('The possible contents of properties that Events and Contexts can have:');
  typesOverview.forEach((type) => {
    docsWriter.write('* ');
    docsWriter.writeLink(type.name, type.url);
    docsWriter.writeEndOfLine();
  });
  docsWriter.writeLine();
});

const getRuleSummaries = (rule, ruleSummaries, entity = null) => {
  // only show if it's about the current Context entity or one of its requiredContexts
  if (!rule._inheritedFrom) {
    switch (rule.type) {
      case 'MatchContextProperty':
        // TODO: show InputValueContext as an optional Context for InputChangeEvent (and PressEvent?),
        // and show its rules on the InputValueContext page as well
        rule.scope.forEach(({ contextA, contextB, property }) => {
          ruleSummaries.push(`\`${contextA}.${property}\` should equal \`${contextB}.${property}\``);
        });
        break;

      case 'RequiresLocationContext':
        rule.scope.forEach(({ context, position }) => {
          const url = '/taxonomy/reference/location-contexts/' + context + '.md';
          ruleSummaries.push(
            `[LocationStack](/taxonomy/reference/types/LocationStack) should contain [${context}](${url})${
              position !== undefined ? ` at index ${position}` : ''
            }`
          );
        });
        break;

      case 'RequiresGlobalContext':
        rule.scope.forEach(({ context }) => {
          const url = '/taxonomy/reference/global-contexts/' + context + '.md';
          ruleSummaries.push(
            `[GlobalContexts](/taxonomy/reference/types/GlobalContexts) should contain one [${context}](${url})`
          );
        });
        break;

      case 'UniqueContext':
        rule.scope.forEach(({ excludeContexts, includeContexts, by }) => {
          if (!excludeContexts?.length && !includeContexts?.length) {
            if (rule._inheritedFrom) {
              ruleSummaries.push(
                `Items in \`${rule._inheritedFrom}\` should have a unique combination of \`{${by.join(
                  ', '
                )}}\` properties`
              );
            } else {
              ruleSummaries.push(`Items should have a unique combination of \`{${by.join(', ')}}\` properties`);
            }
          }
          if (excludeContexts?.length) {
            if (rule._inheritedFrom) {
              ruleSummaries.push(
                `Items in \`${rule._inheritedFrom}\` should have a unique combination of \`{${by.join(
                  ', '
                )}}\` properties, except for \`${excludeContexts.join(',')}\``
              );
            } else {
              ruleSummaries.push(
                `Items should have a unique combination of \`{${by.join(
                  ', '
                )}}\` properties, except for \`${excludeContexts.join(',')}\``
              );
            }
          }
          if (includeContexts?.length) {
            includeContexts?.forEach((includedContext) => {
              let requiredContextsNames = [];
              if (entity.requiredContexts) {
                for (let i = 0; i < entity.requiredContexts.length; i++) {
                  requiredContextsNames.push(entity.requiredContexts[i].name);
                }
              }
              if (entity && (entity.name == includedContext || requiredContextsNames.includes(includeContexts))) {
                ruleSummaries.push(
                  `${includedContext} should have a unique combination of \`{${by.join(', ')}}\` properties`
                );
              }
            });
          }
        });
        break;
      default:
        throw new Error(`Cannot summarize rule ${rule.type}`);
    }
  }

  return ruleSummaries;
};
