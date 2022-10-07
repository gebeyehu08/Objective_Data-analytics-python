/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { JavaScriptWriter } from '../writers/JavaScriptWriter';
import glob from 'glob';

const validatorFolder = '../../validator/';

Generator.generateFromModel({ outputFile: `${validatorFolder}/validator-service.js` }, (writer: TextWriter) => {
  const jsWriter = new JavaScriptWriter(writer);

  jsWriter.writeFile('validator-service.template.static.ts');

  jsWriter.writeEndOfLine();

  const validatorFiles = glob.sync(`${validatorFolder}/validator-v*.js`);
  validatorFiles.forEach((validator) => {
    const validatorVersion = validator.replace(`${validatorFolder}validator-v`, '').replace('.js', '');
    jsWriter.writeLine(`versions.push('${validatorVersion.toString()}');`);
  });
});
