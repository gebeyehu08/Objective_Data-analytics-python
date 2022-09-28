/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from "@yellicode/typescript";
import Objectiv from '../../base_schema.json';

Generator.generateFromModel({ outputFile: '../generated/factories.ts' }, (writer: TextWriter, model: typeof Objectiv) => {
  const ts = new TypeScriptWriter(writer);
  // TODO
});
