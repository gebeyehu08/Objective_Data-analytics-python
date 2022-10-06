/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { TypescriptWriter } from '../writers/TypescriptWriter';

Generator.generateFromModel(
  { outputFile: '../generated/factories.ts' },
  (writer: TextWriter, model: typeof Objectiv) => {
    const factoriesWriter = new TypescriptWriter(writer);
    // TODO
  }
);
