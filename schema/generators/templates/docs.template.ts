/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { DocusaurusWriter } from '../writers/DocusaurusWriter';
import {
  getEntityByName,
  getEntityDescriptionFromDocumentation,
  getEntityMarkdownDescription,
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
  const primaryDescription = getEntityMarkdownDescription(entity, 'primary');
  const admonitionDescription = getEntityMarkdownDescription(entity, 'admonition');
  const validationRules = entity.validation?.rules ?? null;

  const isAbstract = entityName.startsWith('Abstract');
  const isLocationContext = entityParents.includes('AbstractLocationContext');
  const isGlobalContext = entityParents.includes('AbstractGlobalContext');
  const isEvent = entityCategory == 'event';

  const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location-' : isGlobalContext ? 'global-' : '';
  const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;

  Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entityName}.md` }, (writer: TextWriter) => {
    const docsWriter = new DocusaurusWriter(writer);

    // heading & description
    docsWriter.writeH1(entityName);
    docsWriter.writeLine();
    docsWriter.writeLine(primaryDescription);
    docsWriter.writeLine();

    // TODO implement writeMermaid in docsWriter, e.g. writeMermaid({chart, caption, links})

    // for Events: list of required contexts
    if (isEvent) {
      docsWriter.writeH3('Requires');
      docsWriter.writeLine();
      if (validationRules) {
        validationRules.forEach((validationRule) => {
          const ruleType = validationRule.type;
          if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
              const requiredContext = validationRule.scope[0].context;
              const url = (ruleType == 'RequiresLocationContext' ? '../location' : '../global') + '-contexts/' 
                + requiredContext + '.md';
              docsWriter.writeRequiredContext(requiredContext, url);
            }
        });
      } else {
        docsWriter.writeLine('None.');
      }
      docsWriter.writeLine();
    }

    // table of properties
    let properties = [[]] as [string[]];
    getObjectKeys(entityProperties).forEach((entityPropertyName) => {
      const { type, description } = entityProperties[entityPropertyName];
      properties.push(["**" + entityPropertyName.toString() + "**", type, description, ""]);
    });
    docsWriter.writeH3('Properties');
    docsWriter.writeLine();
    docsWriter.writeTable(['', 'type', 'description', 'contains'], properties);

    docsWriter.writeEndOfLine();

    // final notes
    docsWriter.writeLine(admonitionDescription);
  });
});
