/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { DocsWriter } from "../writers/DocsWriter";

Generator.generateFromModel({ outputFile: '../generated/docs.md' }, (writer: TextWriter, model: typeof Objectiv) => {
  const ts = new DocsWriter(writer);
  // TODO
});
