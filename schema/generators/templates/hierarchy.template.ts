/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { JavaScriptWriter } from '../writers/JavaScriptWriter';
import { getEntityByName, getEntityNames, getEntityParents } from './common';

Generator.generate({ outputFile: `../../../backend/objectiv_backend/schema/hierarchy.json` }, (writer: TextWriter) => {
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
