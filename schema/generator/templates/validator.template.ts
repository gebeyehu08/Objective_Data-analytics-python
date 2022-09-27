/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { getObjectKeys, sortEnumMembers } from "./common";
import { EnumMemberDefinition, ZodWriter } from "../writers/ZodWriter";

Generator.generateFromModel({ outputFile: '../generated/validator.js' }, (writer: TextWriter, model: typeof Objectiv) => {
  const zod = new ZodWriter(writer);

  zod.writeEnumeration({
    export: true,
    name: "ContextTypes",
    members: sortEnumMembers<EnumMemberDefinition>(getObjectKeys(model.contexts).map((_type) => ({ name: _type})))
  });

  zod.writeLine();

  zod.writeEnumeration({
    export: true,
    name: "EventTypes",
    members: sortEnumMembers<EnumMemberDefinition>(getObjectKeys(model.events).map((_type) => ({ name: _type})))
  });
});
