/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import * as fs from 'fs';
import Objectiv from '../../base_schema.json';
import { JavaScriptWriter } from '../writers/JavaScriptWriter';
import { ZodWriter } from '../writers/ZodWriter';
import glob from 'glob';
import {
  filterAbstractNames,
  getChildren,
  getContextNames,
  getEntityDescription,
  getEntityProperties,
  getEventNames,
  getObjectKeys,
  getPropertyDescription,
  getPropertyValue,
  sortArrayByName,
} from './common';

const validatorFolder = '../../validator/';
const schemaVersion = Objectiv.version.base_schema;
const descriptionsType = 'text';
const descriptionsTarget = 'primary';

// Validator module
Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/validator.js` }, (writer: TextWriter) => {
  const zodWriter = new ZodWriter(writer);

  // ContextTypes enum
  zodWriter.writeEnumeration({
    name: 'ContextTypes',
    members: sortArrayByName(getObjectKeys(Objectiv.contexts).map((_type) => ({ name: _type }))),
    description: `Context's _type discriminator attribute values`,
  });

  // EventTypes enum
  zodWriter.writeEnumeration({
    name: 'EventTypes',
    members: sortArrayByName(getObjectKeys(Objectiv.events).map((_type) => ({ name: _type }))),
    description: `Event's _type discriminator attribute values`,
  });

  // Context definitions
  const allContexts = filterAbstractNames(getContextNames());
  const childContexts = allContexts.filter((context) => getChildren(context).length === 0);
  childContexts.forEach((contextName) => {
    const context = Objectiv.contexts[contextName];
    const properties = getEntityProperties(context);

    zodWriter.writeObject({
      name: contextName,
      description: getEntityDescription(context, descriptionsType, descriptionsTarget),
      properties: getObjectKeys(properties).map((propertyName) => ({
        name: String(propertyName),
        description: getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
        typeName: properties[propertyName].type,
        isOptional: properties[propertyName].optional,
        value: getPropertyValue(contextName, properties[propertyName]),
      })),
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();
  });
  const parentContexts = allContexts.filter((context) => getChildren(context).length > 0);
  parentContexts.forEach((contextName) => {
    const context = Objectiv.contexts[contextName];
    const properties = getEntityProperties(context);
    const childrenNames = getChildren(contextName);

    zodWriter.writeObject({
      name: `${contextName}Entity`,
      description: getEntityDescription(context, descriptionsType, descriptionsTarget),
      properties: getObjectKeys(properties).map((propertyName) => ({
        name: String(propertyName),
        description: getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
        typeName: properties[propertyName].type,
        isOptional: properties[propertyName].optional,
        value: getPropertyValue(contextName, properties[propertyName]),
      })),
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();

    zodWriter.writeDiscriminatedUnion({
      name: contextName,
      description: getEntityDescription(context, descriptionsType, descriptionsTarget),
      discriminator: '_type',
      items: [
        {
          properties: getObjectKeys(properties).map((propertyName) => ({
            name: String(propertyName),
            description: getPropertyDescription(context, propertyName, descriptionsType, descriptionsTarget),
            typeName: properties[propertyName].type,
            isOptional: properties[propertyName].optional,
            value: getPropertyValue(contextName, properties[propertyName]),
          })),
        },
        ...childrenNames,
      ],
    });
  });

  // LocationStack array definition
  const allLocationContexts = getChildren(Objectiv.LocationStack.items.type).sort();
  const ChildLocationContexts = allLocationContexts.filter((context) => getChildren(context).length === 0);
  const ParentLocationContexts = allLocationContexts.filter((context) => getChildren(context).length > 0);
  zodWriter.writeArray({
    name: 'LocationStack',
    items: [...ChildLocationContexts, ...ParentLocationContexts.map((contextName) => `${contextName}Entity`)],
    discriminator: Objectiv.LocationStack.items.discriminator,
    description: getEntityDescription(Objectiv.LocationStack, descriptionsType, descriptionsTarget),
    rules: Objectiv.LocationStack.validation.rules,
  });

  // GlobalContexts array definition
  const allGlobalContexts = getChildren(Objectiv.GlobalContexts.items.type).sort();
  const ChildGlobalContexts = allGlobalContexts.filter((context) => getChildren(context).length === 0);
  const ParentGlobalContexts = allGlobalContexts.filter((context) => getChildren(context).length > 0);
  zodWriter.writeArray({
    name: 'GlobalContexts',
    items: [...ChildGlobalContexts, ...ParentGlobalContexts.map((contextName) => `${contextName}Entity`)],
    discriminator: Objectiv.GlobalContexts.items.discriminator,
    description: getEntityDescription(Objectiv.GlobalContexts, descriptionsType, descriptionsTarget),
    rules: Objectiv.GlobalContexts.validation.rules,
  });

  // Events
  filterAbstractNames(getEventNames()).forEach((eventName) => {
    const event = Objectiv.events[eventName];
    const properties = getEntityProperties(event);

    zodWriter.writeObject({
      name: eventName,
      description: getEntityDescription(event, descriptionsType, descriptionsTarget),
      properties: getObjectKeys(properties).map((propertyName) => ({
        name: String(propertyName),
        description: getPropertyDescription(event, propertyName, descriptionsType, descriptionsTarget),
        typeName: properties[propertyName].type,
        isOptional: properties[propertyName].optional,
        value: getPropertyValue(eventName, properties[propertyName]),
      })),
      rules: event.validation?.rules,
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();
  });

  // Entity map for refinements and validation code
  zodWriter.writeJsDocLines([`Set validators in validatorMap for the refinements.`]);
  zodWriter.writeLine(`entityMap = {`);
  zodWriter.exportList.push('entityMap');
  zodWriter.increaseIndent();
  allContexts.forEach((context) => {
    zodWriter.writeLine(`'${context}': ${context},`);
  });
  zodWriter.decreaseIndent();
  zodWriter.writeLine(`};\n`);

  // Main `validate` endpoint
  zodWriter.writeJsDocLines([
    `The validate method can be used to safely parse an Event.`,
    `Possible return values:`,
    `  - Valid event: { success: true, data: <parsed event object> }.`,
    `  - Invalid event: { success: false, error: <error collection> }.`,
  ]);
  zodWriter.writeLine(`const validate = z.union([`);
  zodWriter.exportList.push('validate');
  zodWriter.increaseIndent();
  filterAbstractNames(getEventNames()).forEach((eventName) => zodWriter.writeLine(`${eventName},`));
  zodWriter.decreaseIndent();
  zodWriter.writeLine(`]).safeParse;`);
  zodWriter.writeLine();

  // Exports
  zodWriter.exportList.forEach((name) => {
    zodWriter.writeLine(`exports.${name} = ${name};`);
  });
});

// Validator common
Generator.generate({ outputFile: `${validatorFolder}common.js` }, (writer: TextWriter) => {
  const jsWriter = new JavaScriptWriter(writer);

  jsWriter.writeFile('validator-common.template.ts');

  jsWriter.writeEndOfLine();

  const validatorFiles = glob.sync(`${validatorFolder}/*/`, { ignore: '../../validator/**/node_modules' });
  validatorFiles.forEach((validator) => {
    const validatorVersion = validator.replace(`${validatorFolder}`, '').replace('/', '');
    jsWriter.writeLine(`versions.push('${validatorVersion}');`);
  });
});

// Validator tests
Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/validator.test.js` }, (writer: TextWriter) => {
  const jsWriter = new JavaScriptWriter(writer);

  // TODO actually generate tests
  jsWriter.writeFile('validator-test.template.js');
});

// Validator package.json
const packageJsonPath = `${validatorFolder}${schemaVersion}/package.json`;
Generator.generate({ outputFile: packageJsonPath }, (writer: TextWriter) => {
  writer.writeFile('validator-package_json.template.json');

  fs.readFile(packageJsonPath, 'utf8', function (err, data) {
    fs.writeFileSync(packageJsonPath, data.replace(/{{schemaVersion}}/g, schemaVersion));
  });
});

// Bundle schema
fs.copyFileSync('../../base_schema.json', `${validatorFolder}${schemaVersion}/base_schema.json`);
