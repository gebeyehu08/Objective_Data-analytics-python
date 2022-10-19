/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { JavaScriptWriter } from '../writers/JavaScriptWriter';
import { getEntities } from './parser';

Generator.generate({ outputFile: `../../../backend/objectiv_backend/schema/hierarchy.json` }, (writer: TextWriter) => {
  const jsWriter = new JavaScriptWriter(writer, { writeCopyright: false });

  const hierarchy = {};

  getEntities({ exclude: ['LocationStack', 'GlobalContexts'], sortBy: 'name' }).forEach((entity) => {
    hierarchy[entity.name] = [...entity.parents.map(({ name }) => name), entity.name];
  });

  jsWriter.writeJSONObject(hierarchy);
});
