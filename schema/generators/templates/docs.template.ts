/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { MarkdownWriter } from '../writers/MarkdownWriter';
import { getEntityByName, getEntityDescription, getEntityNames, getEntityParents } from './common';

const destination = '../generated/docs/';

getEntityNames().forEach((entityName) => {
  const entityCategory = entityName.endsWith('Event') ? 'event' : 'context';
  const entity = getEntityByName(entityName);
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

    // TODO generate mermaid, tables (we have to implement that in the writer), etc
  });
});
