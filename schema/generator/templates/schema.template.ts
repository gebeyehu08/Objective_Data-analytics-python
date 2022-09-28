/*
 * Copyright 2022 Objectiv B.V.
 */

import Objectiv from '../../base_schema.json';
import { Generator } from '@yellicode/templating';
import { TextWriter } from '@yellicode/core';
import { TypescriptWriter } from '../writers/TypescriptWriter';
import { writeEnumerations } from './common';

Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer: TextWriter, model: typeof Objectiv) => {
  const schemaWriter = new TypescriptWriter(writer);

  writeEnumerations(schemaWriter);
});
