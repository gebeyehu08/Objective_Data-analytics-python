/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { TypeScriptWriter } from '../writers/TypeScriptWriter';
import { getObjectKeys, sortBy } from './common';

Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer: TextWriter) => {
  const schemaWriter = new TypeScriptWriter(writer);

  // ContextTypes enum
  schemaWriter.writeEnumeration({
    export: true,
    name: 'ContextTypes',
    members: sortBy(getObjectKeys(Objectiv.contexts).map((_type) => ({ name: _type })), 'name'),
  });
  writer.writeLine();

  // EventTypes enum
  schemaWriter.writeEnumeration({
    export: true,
    name: 'EventTypes',
    members: sortBy(getObjectKeys(Objectiv.events).map((_type) => ({ name: _type })), 'name'),
  });
  writer.writeLine();
});
