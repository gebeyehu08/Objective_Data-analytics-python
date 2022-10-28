/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { IgluWriter } from '../writers/IgluWriter';
import { getContexts, getEntity } from './parser';

const destination = '../generated/snowplow/';
const format = 'jsonschema';
const version = Objectiv.version.base_schema.replace(/\./g, '-');

const vendor = 'io.objectiv';
Generator.generate(
  { outputFile: `${destination}${vendor}/location_stack/${format}/${version}` },
  (writer: TextWriter) => {
    const igluWriter = new IgluWriter(writer);

    const locationStack = getEntity('LocationStack');
    const name = 'location_stack';
    const description = locationStack.getDescription({ type: 'text', target: 'primary' }).replace(/\n/g, '');

    igluWriter.writeSelfDescribingEntity({
      vendor,
      name,
      description,
      properties: [
        {
          name,
          description,
          type: locationStack.type,
          items: ['object'],
          minItems: 1,
        },
      ],
    });
  }
);

getContexts().forEach((context) => {
  const contextsVendor = `${vendor}.context`;
  const outputFile = `${destination}${contextsVendor}/${context.name}/${format}/${version}`;
  const description = context.getDescription({ type: 'text', target: 'primary' }).replace(/\n/g, '');

  Generator.generate({ outputFile }, (writer: TextWriter) => {
    const igluWriter = new IgluWriter(writer);

    igluWriter.writeSelfDescribingEntity({
      vendor: contextsVendor,
      name: context.name,
      description: description,
      properties: context.properties,
    });
  });
});
