/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { MarkdownWriter } from '../writers/MarkdownWriter';
import {
  getEntityByName,
  getEntityDescription,
  getEntityNames,
  getEntityParents,
  getEntityProperties,
  getObjectKeys,
} from './common';

const destination = '../generated/docs/';

getEntityNames().forEach((entityName) => {
  const entityCategory = entityName.endsWith('Event') ? 'event' : 'context';
  const entity = getEntityByName(entityName);
  const entityProperties = getEntityProperties(entity);
  const entityParents = getEntityParents(entity);
  const isAbstract = entityName.startsWith('Abstract');
  const isLocationContext = entityParents.includes('AbstractLocationContext');
  const isGlobalContext = entityParents.includes('AbstractGlobalContext');
  const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location_' : isGlobalContext ? 'global_' : '';
  const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;
  Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entityName}.md` }, (writer: TextWriter) => {
    const docsWriter = new MarkdownWriter(writer);

    docsWriter.writeH1(entityName);
    docsWriter.writeLine(getEntityDescription(entity));
    docsWriter.writeLine();

    // TODO implement writeMermaid in docsWriter, e.g. writeMermaid({chart, caption, links})

    docsWriter.writeH3('Properties');
    // TODO implement writeTable in docsWriter, e.g. writeTable({title, rows:[cell1, cell2, ...cellN]})
    getObjectKeys(entityProperties).forEach((entityPropertyName) => {
      const { type, description } = entityProperties[entityPropertyName];
      docsWriter.writeLine(`\`${type}\` ${entityPropertyName.toString()}: ${description}`);
    });

    // TODO we have some admonitions in the current docs that would be nice to keep
    // TODO Think of how can we add those to the base_schema OR use a map here, e.g. {entityName: admonition_text}
  });
});
