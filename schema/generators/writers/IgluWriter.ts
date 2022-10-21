/*
 * Copyright 2022 Objectiv B.V.
 */

import { CodeWriter, TextWriter } from '@yellicode/core';
import Objectiv from '../../base_schema.json';

const version = Objectiv.version.base_schema.replace(/\./g, '-');
const vendor = 'io.objectiv';
const format = 'jsonschema';

export type SelfDescribingEntityDefinition = {
  name: string;
  description: string;
  properties: {
    [key: string]: {
      [key: string]: string | number | boolean;
      type: string;
      description: string;
      isRequired?: boolean;
    };
  };
};

const internalProperties = ['isRequired'];

export class IgluWriter extends CodeWriter {
  constructor(writer: TextWriter) {
    super(writer);
    this.indentString = '    ';
  }

  public writeJSON(content: any) {
    this.write(JSON.stringify(content, null, 4));
  }

  public writeSelfDescribingEntity(entity: SelfDescribingEntityDefinition) {
    const sanitizedProperties = JSON.parse(JSON.stringify(entity.properties));
    Object.keys(entity.properties).forEach((property) => {
      internalProperties.forEach((internalProperty) => delete sanitizedProperties[property][internalProperty]);
    });

    this.writeJSON({
      $schema: `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/${format}/${version}#`,
      description: entity.description,
      self: {
        vendor,
        name: entity.name,
        format,
        version,
      },
      type: 'object',
      properties: sanitizedProperties,
      additionalProperties: false,
      required: Object.entries(entity.properties)
        .filter(([_, property]) => property.isRequired)
        .map(([key]) => key),
    });
  }
}
