/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { getObjectKeys, sortEnumMembers } from "./common";
import { EnumMemberDefinition, SchemaWriter } from "../writers/SchemaWriter";

Generator.generateFromModel({ outputFile: '../generated/schema.ts' }, (writer: TextWriter, model: typeof Objectiv) => {
  const ts = new SchemaWriter(writer);

  ts.writeEnumeration({
    export: true,
    name: "ContextTypes",
    members: sortEnumMembers<EnumMemberDefinition>(getObjectKeys(model.contexts).map((_type) => ({ name: _type})))
  });

  ts.writeLine();

  ts.writeEnumeration({
    export: true,
    name: "EventTypes",
    members: sortEnumMembers<EnumMemberDefinition>(getObjectKeys(model.events).map((_type) => ({ name: _type})))
  });
});
