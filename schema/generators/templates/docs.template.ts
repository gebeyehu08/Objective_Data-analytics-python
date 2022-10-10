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

  // for Events: create a list of required contexts
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

  // for this entity, get all properties for each of its parents, and just its own properties
  let entityParentsWithProperties = [] as object[];
  let entityDeepCopy = JSON.parse(JSON.stringify(entity));
  const entityOwnProperties = entityDeepCopy['properties'] ?? {};
  entityParents.forEach(parent => {
    let parentEntity = getEntityByName(parent);
    parentEntity.name = parent;
    if (parentEntity.properties) {
      for (const [key, value] of Object.entries(parentEntity.properties)) {
        delete entityOwnProperties[key];
      };
    }
    entityParentsWithProperties.push(parentEntity);
  });
  // if (entityName == 'FailureEvent') {
  //   debugger;
  // }

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
    
    // Mermaid chart
    docsWriter.writeMermaidChart(entityName, entityOwnProperties, entityParentsWithProperties, 
      requiredContexts, "Diagram: " + entityName);
    docsWriter.writeLine();

    // for Events: write list of required contexts
    if (requiredContexts) {
      docsWriter.writeH3('Requires');
      docsWriter.writeLine();
      
      if (requiredContexts.length > 0) {
        for (let i = 0; i < requiredContexts.length; i++) {
          let requiredContext = requiredContexts[i];
          let ruleType = requiredContext.ruleType.toString();
          let context = requiredContext.context.toString();
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
