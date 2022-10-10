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

export type RequiredContextsDefinition = {
  ruleType: string;
  context: string;
};

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

  // for Events: list of required contexts
  let requiredContexts = [] as RequiredContextsDefinition[];
  if (isEvent && validationRules) {
    validationRules.forEach((validationRule) => {
      const ruleType = validationRule.type;
      if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
          requiredContexts.push({
            'ruleType': ruleType,
            'context': validationRule.scope[0].context
          });
      }
    });
  }

  const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location-' : isGlobalContext ? 'global-' : '';
  const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;

  Generator.generate({ outputFile: `${destination}/${fullFolderName}/${entityName}.md` }, (writer: TextWriter) => {
    const docsWriter = new DocusaurusWriter(writer);

    // heading & description
    docsWriter.writeH1(entityName);
    docsWriter.writeLine();
    docsWriter.writeLine(primaryDescription);
    docsWriter.writeLine();
    
    docsWriter.writeLine("import Mermaid from '@theme/Mermaid'");
    docsWriter.writeLine();
    
    docsWriter.writeMermaidChart(entityName, entityProperties, entityParents, requiredContexts, 
      "Diagram: " + entityName);
    docsWriter.writeLine();

    // TODO implement writeMermaid in docsWriter, e.g. writeMermaid({chart, caption, links})

    // for Events: list of required contexts
    if (requiredContexts) {
      docsWriter.writeH3('Requires');
      docsWriter.writeLine();
      
      if (requiredContexts.length > 0) {
        for (let i = 0; i < requiredContexts.length; i++) {
          let requiredContext = requiredContexts[i];
          let ruleType = requiredContext.ruleType.toString();
          let context = requiredContext.context.toString();
          debugger;
          if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
            const url = (ruleType == 'RequiresLocationContext' ? '../location' : '../global') + 
              '-contexts/' + context + '.md';
            docsWriter.writeRequiredContext(context, url);
          }
        }
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
