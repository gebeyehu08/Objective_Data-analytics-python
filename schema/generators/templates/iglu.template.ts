/*
 * Copyright 2022 Objectiv B.V.
 */

import Objectiv from '../../base_schema.json';
import { Generator } from '@yellicode/templating';
import { TextWriter } from '@yellicode/core';

Generator.generateFromModel({ outputFile: '../generated/iglu.json' }, (writer: TextWriter, model: typeof Objectiv) => {
  // TODO
});
