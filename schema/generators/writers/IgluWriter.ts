/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';
import Objectiv from '../../base_schema.json';

const version = Objectiv.version.base_schema.replace(/\./g, '-');
const format = 'jsonschema';

export type SelfDescribingEntityDefinition = {
  vendor: string;
  name: string;
  description: string;
  properties: [
    // This is not complete: expand it as needed
    {
      [key: string]: any;
      name: string;
      type: string;
      items?: Array<string>;
      description: string;
    }
  ];
};

const skipProperties = ['_type'];

export class IgluWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '    ';
  }

  public writeJSON(content: any) {
    this.write(JSON.stringify(content, null, 4));
  }

  public writeSelfDescribingEntity(entity: SelfDescribingEntityDefinition) {
    const properties = mapSchemaPropertiesToIglu(entity.properties);

    this.writeJSON({
      $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/${format}/${version}#`,
      description: entity.description,
      self: {
        vendor: entity.vendor,
        name: entity.name,
        format,
        version,
      },
      type: 'object',
      properties,
      additionalProperties: false,
      required: Object.values(entity.properties)
        .filter(({ name, optional }) => !optional && !skipProperties.includes(name))
        .map(({ name }) => name),
    });
  }
}

const mapSchemaPropertiesToIglu = (properties) => {
  let igluProperties = {};

  if (!properties.length) {
    return igluProperties;
  }

  properties
    .filter(({ name }) => !skipProperties.includes(name))
    .forEach(({ name, type, nullable, description, internal, value, _rules, _inherited, ...otherAttributes }) => {
      igluProperties[name] = {
        type: nullable ? [type, 'null'] : [type],
        description: description.replace(/\n/g, ''),
        ...otherAttributes,
      };
    });

  return igluProperties;
};
