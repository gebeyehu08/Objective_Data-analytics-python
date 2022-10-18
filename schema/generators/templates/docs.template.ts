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

    docsWriter.writeH3('Properties');

    // TODO implement writeTable in docsWriter, e.g. writeTable({title, rows:[cell1, cell2, ...cellN]})
    entity.properties.forEach((entityProperty) => {
      const { name, type, description, internal } = entityProperty;
      if (!internal) {
        docsWriter.writeLine(`\`${type}\` ${name.toString()}: ${description}`);
      }
    });

    docsWriter.writeEndOfLine();

    docsWriter.writeLine(admonitionDescription);
  });
});
