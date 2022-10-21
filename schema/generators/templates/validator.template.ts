/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import * as fs from 'fs';
import glob from 'glob';
import Objectiv from '../../base_schema.json';
import { JavaScriptWriter } from '../writers/JavaScriptWriter';
import { ZodWriter } from '../writers/ZodWriter';
import { getContexts, getEntity, getEvents } from './parser';

const validatorFolder = '../../validator/';
const schemaVersion = Objectiv.version.base_schema;
const descriptionsType = 'text';
const descriptionsTarget = 'primary';

// Validator module
Generator.generate({ outputFile: `${validatorFolder}${schemaVersion}/validator.js` }, (writer: TextWriter) => {
  const zodWriter = new ZodWriter(writer);

  // Static validation helpers
  zodWriter.writeFile('fragments/validator.template.static.ts');
  zodWriter.writeLine();

  // ContextTypes enum
  zodWriter.writeEnumeration({
    name: 'ContextTypes',
    members: getContexts(),
    description: `Context's _type discriminator attribute values`,
  });

  // EventTypes enum
  zodWriter.writeEnumeration({
    name: 'EventTypes',
    members: getEvents(),
    description: `Event's _type discriminator attribute values`,
  });

  // Context definitions
  getContexts({ isAbstract: false, isParent: false }).forEach((context) => {
    zodWriter.writeObject({
      name: context.name,
      description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
      properties: context.properties.map((property) => ({
        name: property.name,
        description: property.description,
        typeName: property.type,
        isNullable: property.nullable,
        isOptional: property.optional,
        value: property.value,
      })),
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();
  });

  getContexts({ isAbstract: false, isParent: true }).forEach((context) => {
    zodWriter.writeObject({
      name: `${context.name}Entity`,
      description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
      properties: context.properties.map((property) => ({
        name: property.name,
        description: property.description,
        typeName: property.type,
        isNullable: property.nullable,
        isOptional: property.optional,
        value: property.value,
      })),
    });
    zodWriter.writeLine(';');
    zodWriter.writeLine();

    zodWriter.writeDiscriminatedUnion({
      name: context.name,
      description: context.getDescription({ type: descriptionsType, target: descriptionsTarget }),
      discriminator: '_type',
      items: [
        {
          properties: context.properties.map((property) => ({
            name: property.name,
            description: property.description,
            typeName: property.type,
            isNullable: property.nullable,
            isOptional: property.optional,
            value: property.value,
          })),
        },
        ...context.children.map(({ name }) => name),
      ],
    });
  });

  // LocationStack array definition
  const childLocationContextNames = getContexts({ isLocationContext: true, isParent: false }).map(({ name }) => name);
  const parentLocationContextNames = getContexts({ isLocationContext: true, isParent: true }).map(({ name }) => name);
  zodWriter.writeArray({
    name: 'LocationStack',
    items: [...childLocationContextNames, ...parentLocationContextNames.map((contextName) => `${contextName}Entity`)],
    discriminator: Objectiv.LocationStack.items.discriminator,
    description: getEntity('LocationStack').getDescription({ type: descriptionsType, target: descriptionsTarget }),
    rules: Objectiv.LocationStack.validation.rules,
  });

  // GlobalContexts array definition
  const childGlobalContextNames = getContexts({ isGlobalContext: true, isParent: false }).map(({ name }) => name);
  const parentGlobalContextNames = getContexts({ isGlobalContext: true, isParent: true }).map(({ name }) => name);
  zodWriter.writeArray({
    name: 'GlobalContexts',
    items: [...childGlobalContextNames, ...parentGlobalContextNames.map((contextName) => `${contextName}Entity`)],
    discriminator: Objectiv.GlobalContexts.items.discriminator,
    description: getEntity('GlobalContexts').getDescription({ type: descriptionsType, target: descriptionsTarget }),
    rules: Objectiv.GlobalContexts.validation.rules,
  });

  // Events
  getEvents({ isAbstract: false }).forEach((event) => {
    zodWriter.writeObject({
      name: event.name,
      description: event.getDescription({ type: descriptionsType, target: descriptionsTarget }),
      properties: event.properties.map((property) => ({
        name: property.name,
        description: property.description,
        typeName: property.type,
        isNullable: property.nullable,
        isOptional: property.optional,
        value: property.value,
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
  getContexts({ isAbstract: false }).forEach((context) => {
    zodWriter.writeLine(`'${context.name}': ${context.name},`);
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
  getEvents({ isAbstract: false }).forEach((event) => zodWriter.writeLine(`${event.name},`));
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

  jsWriter.writeFile('fragments/validator-common.template.ts');

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
  jsWriter.writeFile('fragments/validator-test.template.js');
});

// Validator package.json
const packageJsonPath = `${validatorFolder}${schemaVersion}/package.json`;
Generator.generate({ outputFile: packageJsonPath }, (writer: TextWriter) => {
  writer.writeFile('fragments/validator-package_json.template.json');

  fs.readFile(packageJsonPath, 'utf8', function (err, data) {
    fs.writeFileSync(packageJsonPath, data.replace(/{{schemaVersion}}/g, schemaVersion));
  });
});

// Bundle schema
fs.copyFileSync('../../base_schema.json', `${validatorFolder}${schemaVersion}/base_schema.json`);
