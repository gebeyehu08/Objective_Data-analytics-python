/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { TypescriptWriter } from '../writers/TypescriptWriter';
import { getObjectKeys, sortEnumMembers } from './common';

Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer: TextWriter, model: typeof Objectiv) => {
  const schemaWriter = new TypescriptWriter(writer);

  // ContextTypes enum
  schemaWriter.writeEnumeration({
    export: true,
    name: 'ContextTypes',
    members: sortEnumMembers(getObjectKeys(Objectiv.contexts).map((_type) => ({ name: _type }))),
  });
  writer.writeLine();

  // EventTypes enum
  schemaWriter.writeEnumeration({
    export: true,
    name: 'EventTypes',
    members: sortEnumMembers(getObjectKeys(Objectiv.events).map((_type) => ({ name: _type }))),
  });
  writer.writeLine();
});
