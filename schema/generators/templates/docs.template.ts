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
  getChildren,
  getEntityProperties,
  getEntityOwnProperties,
  getObjectKeys,
} from './common';

const destination = '../generated/docs/';

export type RequiredContextsDefinition = {
  contextClass: string;
  contextType: string;
  contextName: string;
};

getEntityNames().forEach((entityName) => {
  const entityCategory = entityName.endsWith('Event') ? 'event' : 'context';
  const entity = getEntityByName(entityName);
  const entityOwnProperties = getEntityOwnProperties(entity);
  const entityProperties = getEntityProperties(entity);
  const entityParents = getEntityParents(entity);
  const entityChildren = getChildren(entityName) as [];
  const primaryDescription = getEntityMarkdownDescription(entity, 'primary');
  const admonitionDescription = getEntityMarkdownDescription(entity, 'admonition');
  const validationRules = entity.validation?.rules ?? null;
  // for Events: create a list of required contexts
  const requiredContexts = getRequiredContextsFromValidationRules(validationRules);

  const isAbstract = entityName.startsWith('Abstract');
  const isLocationContext = entityParents.includes('AbstractLocationContext');
  const isGlobalContext = entityParents.includes('AbstractGlobalContext');
  const isEvent = entityCategory == 'event';

  const folderPrefix = isAbstract ? 'abstracts' : isLocationContext ? 'location-' : isGlobalContext ? 'global-' : '';
  const fullFolderName = `${folderPrefix}${isAbstract ? '' : `${entityCategory}s`}`;

  function getRequiredContextsFromValidationRules(validationRules) {
    // TODO: (TBD) get requiredContexts from properties as well (e.g. LocationStack and GlobalContext types)
    // TBD: maybe only for Abstracts.
    let requiredContexts = [] as RequiredContextsDefinition[];
    if (isEvent && validationRules) {
      validationRules.forEach((validationRule) => {
        const ruleType = validationRule.type;
        if (ruleType == 'RequiresLocationContext' || ruleType == 'RequiresGlobalContext') {
            requiredContexts.push({
              'contextClass': (ruleType == 'RequiresLocationContext' ? 'location' : 'global'),
              'contextType': (ruleType == 'RequiresLocationContext' ? 'LocationContext' : 'GlobalContext'),
              'contextName': validationRule.scope[0].context
            });
        }
      });
    }
    return requiredContexts;
  }

  /**
   * Get the (sub)category for an entity, e.g. 'LocationContext'.
   * @param {object} entity - The entity to get the (sub)category for.
   * @returns {string} The entity's (sub)category.
   */
  function getSubCategoryFromEntity(entity) {
    let subCategory = "";
    let parents = getEntityParents(entity);
    if (entity.name.startsWith('Abstract')) {
      subCategory = "Abstract";
    }
    else if (parents.includes('AbstractLocationContext')) {
      subCategory = "LocationContext";
    }
    else if (parents.includes('AbstractGlobalContext')) {
      subCategory = "GlobalContext";
    }
    else if (entityName.endsWith('Event')) {
      subCategory = "Event";
    }
    return subCategory;
  }
  
  // for this entity, get all properties for each of its parents
  const entityParentsWithProperties = [];
  for (let i = 0; i < entityParents.length; i++) {
    let parent = entityParents[i];
    const parentEntity = getEntityByName(parent);
    parentEntity.properties = getEntityOwnProperties(parentEntity);;
    parentEntity.name = parent;
    // add required contexts to each parent
    parentEntity.requiredContexts = (parentEntity.validation && parentEntity.validation.rules)
      ? getRequiredContextsFromValidationRules(parentEntity.validation.rules) 
      : [] as RequiredContextsDefinition[];
    // add the (sub)category to each parent
    parentEntity.subCategory = getSubCategoryFromEntity(parentEntity);
    
    entityParentsWithProperties.push(parentEntity);
  }
  // TODO: Fix that for some reason the `properties` in the above generated `entityParentsWithProperties` is 
  // overwritten when it's used below in the `writeMermaidChartForEntity` call.
  
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
    docsWriter.writeMermaidChartForEntity(entityName, entityOwnProperties, requiredContexts, 
        entityParentsWithProperties, entityChildren, "Diagram: " + entityName);
    docsWriter.writeLine();

    // for Events: write list of required contexts
    if (requiredContexts) {
      docsWriter.writeH3('Requires');
      docsWriter.writeLine();
      
      if (requiredContexts.length > 0) {
        for (let i = 0; i < requiredContexts.length; i++) {
          let rc = requiredContexts[i];
          const url = '../' + rc.contextClass + '-contexts/' + rc.contextName + '.md';
          docsWriter.writeRequiredContext(rc.contextName, url, rc.contextType);
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
