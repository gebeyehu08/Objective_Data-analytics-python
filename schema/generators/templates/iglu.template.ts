/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { JSONWriter } from "../writers/JSONWriter";
import { getEntity } from "./parser";

const destination = '../generated/snowplow/'
const version = Objectiv.version.base_schema.replace(/\./g, '-');
const vendor = "io.objectiv";
const format = "jsonschema";

Generator.generate({ outputFile: `${destination}location_stack/${format}/${version}` }, (writer: TextWriter) => {
  const jsonWriter = new JSONWriter(writer);

  const locationStack = getEntity('LocationStack');
  const name = "location_stack";
  const description = locationStack.getDescription({ type: 'text', target: 'primary' }).replace(/\n/g, '');

  jsonWriter.writeJSON({
    $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/${format}/${version}#`,
    description,
    self: {
      vendor,
      name,
      format,
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
  })
});
