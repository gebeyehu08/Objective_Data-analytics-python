/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { MarkdownWriter } from '../writers/MarkdownWriter';
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
    const docsWriter = new MarkdownWriter(writer);

    docsWriter.writeH1(entity.name);
    docsWriter.writeLine(primaryDescription);
    docsWriter.writeLine();

    // TODO implement writeMermaid in docsWriter, e.g. writeMermaid({chart, caption, links})
    // TODO implement writeTable in docsWriter, e.g. writeTable({title, rows:[cell1, cell2, ...cellN]})

    if (entity.parent) {
      docsWriter.writeH3('Parent');
      docsWriter.writeLine(entity.parent.name);
      docsWriter.writeEndOfLine();
    }

    if (entity.parents.length) {
      docsWriter.writeH3('All Parents');
      docsWriter.writeLine(entity.parents.map(({ name }) => name).join(' > '));
      docsWriter.writeEndOfLine();
    }

    if (entity.ownChildren.length) {
      docsWriter.writeH3('Own Children');
      docsWriter.writeLine(entity.ownChildren.map(({ name }) => name).join(', '));
      docsWriter.writeEndOfLine();
    }

    if (entity.children.length) {
      docsWriter.writeH3('All Children');
      docsWriter.writeLine(entity.children.map(({ name }) => name).join(', '));
      docsWriter.writeEndOfLine();
    }

    if (entity.ownProperties.length) {
      docsWriter.writeH3('Own Properties');

      entity.ownProperties.forEach((entityProperty) => {
        const { name, type, description, internal } = entityProperty;
        if (!internal) {
          docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
        }
      });

      docsWriter.writeEndOfLine();
    }

    if (entity.inheritedProperties.length) {
      docsWriter.writeH3('Inherited Properties');

      entity.inheritedProperties.forEach((entityProperty) => {
        const { name, type, description, internal } = entityProperty;
        if (!internal) {
          docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
        }
      });

      docsWriter.writeEndOfLine();
    }

    if (entity.properties.length) {
      docsWriter.writeH3('All Properties');

      entity.properties.forEach((entityProperty) => {
        const { name, type, description, internal } = entityProperty;
        if (!internal) {
          docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
        }
      });

      docsWriter.writeEndOfLine();
    }

    if (entity.rules.length) {
      docsWriter.writeH3('Validation Rules');

      // Build a list of all rules summaries
      let ruleSummaries = [];
      entity.rules.forEach((entityRule) => {
        getRuleSummaries(entityRule, ruleSummaries);
      });

      // Remove dupes
      [...new Set(ruleSummaries)]
        // Sort
        .sort((a, b) => a.localeCompare(b))
        // Write a line per rule
        .forEach((ruleSummary) => docsWriter.writeLine(ruleSummary));

      docsWriter.writeEndOfLine();
    }

    docsWriter.writeLine(admonitionDescription);
  });
});

const getRuleSummaries = (rule, ruleSummaries) => {
  switch (rule.type) {
    case 'MatchContextProperty':
      rule.scope.forEach(({ contextA, contextB, property }) => {
        ruleSummaries.push(`${contextA}.${property} must equal ${contextB}.${property}`);
      });
      break;

    case 'RequiresLocationContext':
      rule.scope.forEach(({ context, position }) => {
        ruleSummaries.push(
          `Location Stack must contain ${context}${position !== undefined ? ` at index ${position}` : ''}`
        );
      });
      break;

    case 'RequiresGlobalContext':
      rule.scope.forEach(({ context }) => {
        ruleSummaries.push(`Global Contexts must contain ${context}`);
      });
      break;

    case 'UniqueContext':
      rule.scope.forEach(({ excludeContexts, includeContexts, by }) => {
        if (!excludeContexts?.length && !includeContexts?.length) {
          ruleSummaries.push(`${rule._inheritedFrom} items must be unique by their ${by.join('+')}`);
        }
        if (excludeContexts?.length) {
          ruleSummaries.push(`${rule._inheritedFrom} items must be unique by their ${by.join('+')}, except ${excludeContexts.join(',')}`);
        }
        if (includeContexts?.length) {
          includeContexts?.forEach(includedContext => {
            ruleSummaries.push(`${includedContext} must be unique by their ${by.join('+')}`);
          })
        }
      });
      break;

    default:
      throw new Error(`Cannot summarize rule ${rule.type}`);
  }

  return ruleSummaries;
};
