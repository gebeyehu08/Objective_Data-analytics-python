/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';

Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer: TextWriter) => {
  // TODO use new parser to generate the TS schema
});
