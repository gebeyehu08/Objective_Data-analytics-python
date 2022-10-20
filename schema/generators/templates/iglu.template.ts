/*
 * Copyright 2022 Objectiv B.V.
 */

import { NameUtility, TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { JSONWriter } from "../writers/JSONWriter";
import { getEntity } from "./parser";

const destination = '../generated/snowplow/'
const version = Objectiv.version.base_schema.replace(/\./g, '-');
const vendor = "io.objectiv";

Generator.generate({ outputFile: `${destination}location_stack/jsonschema/${version}` }, (writer: TextWriter) => {
  const jsonWriter = new JSONWriter(writer);

  const locationStack = getEntity('LocationStack');
  const name = "location_stack";
  const description = locationStack.getDescription({ type: 'text', target: 'primary' });

  jsonWriter.writeObject({
    properties: {
      $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/${version}#`,
      description,
      self: {
        vendor,
        name,
        format: 'jsonschema',
        version,
      },
      type: 'object',
      properties: {
        [name]: {
          type: 'array',
          description,
          minItems: 1,
        }
      },
      additionalProperties: false,
      required: [
        name
      ]
    },

    closeWithComma: false
  })

  // writer.writeLine('{')
  // writer.increaseIndent();
  //
  // writer.writeLine(`"$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/${version}#",`)
  //
  // writer.writeLine(`"description": "${description}",`)
  //
  // jsonWriter.writeObject({
  //   name: 'self',
  //   properties: {
  //     vendor,
  //     name,
  //     format: 'jsonschema',
  //     version,
  //   },
  //   closeWithComma: true,
  //   closeWithNewLine: true
  // });
  //
  // writer.writeLine(`"type": "object",`)
  //
  // jsonWriter.writeObject({
  //   name: 'properties',
  //   properties: {
  //     [name]: {
  //       type: 'array',
  //       description,
  //       minItems: 1,
  //     }
  //   },
  //   closeWithComma: true,
  //   closeWithNewLine: true
  // });
  //
  // writer.writeLine(`"additionalProperties": false,`)
  //
  // writer.writeLine(`"required": [`)
  // writer.increaseIndent();
  // writer.writeLine('"location_stack"');
  // writer.decreaseIndent();
  // writer.writeLine(`]`)
  //
  // writer.decreaseIndent();
  // writer.writeLine('}')
});

const removeNewLines = (string) => {
  return string.replace(/\n/g, '');
}

//
//
// {
//     "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
//     "description": "The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.",
//     "self": {
//         "vendor": "io.objectiv",
//         "name": "location_stack",
//         "format": "jsonschema",
//         "version": "1-0-0"
//     },
//     "type": "object",
//     "properties": {
//         "location_stack": {
//             "type": "array",
//             "description": "The location stack is an ordered list (stack), that contains a hierarchy of location contexts that deterministically describes where an event took place from global to specific. The whole stack (list) is needed to exactly pinpoint where in the UI the event originated.",
//             "minItems": 1
//         }
//     },
//     "additionalProperties": true,
//     "required": [
//         "location_stack"
//     ]
// }
