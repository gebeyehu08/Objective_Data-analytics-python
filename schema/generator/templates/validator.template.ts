/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { ValidatorWriter } from "../writers/ValidatorWriter";
import { writeEnumerations } from "./common";

Generator.generateFromModel({ outputFile: '../generated/validator.js' }, (writer: TextWriter, model: typeof Objectiv) => {
  const validator = new ValidatorWriter(writer);

  writeEnumerations(validator, model);
});
