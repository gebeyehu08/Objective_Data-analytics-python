/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { FactoriesWriter } from '../writers/FactoriesWriter';

Generator.generateFromModel(
  { outputFile: '../generated/factories.ts' },
  (writer: TextWriter, model: typeof Objectiv) => {
    const factoriesWriter = new FactoriesWriter(writer);
    // TODO
  }
);
