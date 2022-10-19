/*
 * Copyright 2022 Objectiv B.V.
 */

import Objectiv from '../../base_schema.json';
import { Generator } from '@yellicode/templating';
import { TextWriter } from '@yellicode/core';

Generator.generate({ outputFile: '../generated/iglu.json' }, (writer: TextWriter) => {
  // TODO
});
