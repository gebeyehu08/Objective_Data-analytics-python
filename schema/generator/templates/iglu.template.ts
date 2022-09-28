/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';

Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer: TextWriter, model: typeof Objectiv) => {
  // TODO
});