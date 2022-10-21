/*
 * Copyright 2022 Objectiv B.V.
 */

import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import Objectiv from '../../base_schema.json';
import { IgluWriter } from '../writers/IgluWriter';
import { getEntity } from './parser';

const destination = '../generated/snowplow/';
const format = 'jsonschema';
const version = Objectiv.version.base_schema.replace(/\./g, '-');

Generator.generate({ outputFile: `${destination}location_stack/${format}/${version}` }, (writer: TextWriter) => {
  const igluWriter = new IgluWriter(writer);

  const locationStack = getEntity('LocationStack');
  const name = 'location_stack';
  const description = locationStack.getDescription({ type: 'text', target: 'primary' });

  igluWriter.writeSelfDescribingEntity({
    name,
    description: description,
    properties: {
      [name]: {
        type: 'array',
        description,
        isRequired: true,
        minItems: 1,
      },
    },
  });
});
