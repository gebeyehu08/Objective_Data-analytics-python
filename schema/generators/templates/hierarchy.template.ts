/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { JavaScriptWriter } from '../writers/JavaScriptWriter';
import { sortBy } from "./common";
import { getContexts, getEvents } from "./parser";

Generator.generate({ outputFile: `../../../backend/objectiv_backend/schema/hierarchy.json` }, (writer: TextWriter) => {
  const jsWriter = new JavaScriptWriter(writer, { writeCopyright: false });

  const hierarchy = {};

  sortBy([...getContexts(), ...getEvents()], 'name')
    .forEach((entity) => {
      hierarchy[entity.name] = [...entity.parents.map(({ name }) => name), entity.name];
    });

  jsWriter.writeJSONObject(hierarchy);
});
