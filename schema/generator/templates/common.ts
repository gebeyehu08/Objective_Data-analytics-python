/*
 * Copyright 2022 Objectiv B.V.
 */

import Objectiv from "../../base_schema.json";
import { SchemaWriter } from "../writers/SchemaWriter";
import { ValidatorWriter } from "../writers/ValidatorWriter";

export const getObjectKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

export const sortEnumMembers = <T extends { name: string }>(members: T[]) =>
  members.sort((a, b) => a.name.localeCompare(b.name));

export const writeCopyright = (writer: SchemaWriter | ValidatorWriter,) => {
  writer.writeLine(`/*\n * Copyright ${new Date().getFullYear()} Objectiv B.V.\n */\n`);
}

export const writeEnumerations = (
  writer: SchemaWriter | ValidatorWriter,
  model: typeof Objectiv
) => {
  writer.writeEnumeration({
    export: true,
    name: "ContextTypes",
    members: sortEnumMembers(
      getObjectKeys(model.contexts).map((_type) => ({ name: _type }))
    ),
  });

  writer.writeLine();

  writer.writeEnumeration({
    export: true,
    name: "EventTypes",
    members: sortEnumMembers(
      getObjectKeys(model.events).map((_type) => ({ name: _type }))
    ),
  });

  writer.writeLine();
};
