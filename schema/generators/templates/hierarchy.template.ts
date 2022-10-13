/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import fs from 'fs';
import { JavaScriptWriter } from '../writers/JavaScriptWriter';
import { getEntityByName, getEntityNames, getEntityParents } from './common';

const fileName = 'hierarchy.json';
const outputFile = `../generated/${fileName}`;
const copyDestinations = [
  `../../../backend/objectiv_backend/schema/${fileName}`,
  `../../../tracker/core/schema/src/generated/${fileName}`,
];

Generator.generate({ outputFile }, (writer: TextWriter) => {
  const jsWriter = new JavaScriptWriter(writer, { writeCopyright: false });

  const hierarchy = {};

  getEntityNames()
    .sort()
    .forEach((entityName) => {
      const entityParents = getEntityParents(getEntityByName(entityName));
      hierarchy[entityName] = [...entityParents, entityName];
    });

  jsWriter.writeJSONObject(hierarchy);
});

// Copy generated hierarchy.json
copyDestinations.forEach((destination) => {
  fs.copyFileSync(outputFile, destination);
});
