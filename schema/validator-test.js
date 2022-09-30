/*
 * Copyright 2022 Objectiv B.V.
 */

import crypto from 'crypto';
import { InputChangeEvent, LinkContext, LocationStack, RootLocationContext, validate } from './validator.js';

console.log(
  'RootLocationContext validation:',
  RootLocationContext.parse({
    _type: 'RootLocationContext',
    id: 'test',
  })
);

console.log(
  'LinkContext validation:',
  LinkContext.parse({
    _type: 'LinkContext',
    id: 'test',
    href: '/test',
  })
);

console.log(
  'LocationStack validation:',
  LocationStack.parse([
    {
      _type: 'RootLocationContext',
      id: 'test',
    },
    {
      _type: 'LinkContext',
      id: 'test',
      href: '/test',
    },
    {
      _type: 'ContentContext',
      id: 'test2',
    },
  ])
);

console.log(
  'InputChangeEvent validation:',
  InputChangeEvent.parse({
    _type: 'InputChangeEvent',
    id: crypto.randomUUID(),
    time: Date.now(),
    location_stack: [
      {
        _type: 'RootLocationContext',
        id: 'test',
      },
      {
        _type: 'ContentContext',
        id: 'test2',
      },
      {
        _type: 'InputContext',
        id: 'input',
      },
    ],
    global_contexts: [
      {
        _type: 'ApplicationContext',
        id: 'test',
      },
    ],
  })
);

console.log(
  'InputChangeEvent validation:',
  validate({
    _type: 'InputChangeEvent',
    id: crypto.randomUUID(),
    time: Date.now(),
    location_stack: [
      {
        _type: 'RootLocationContext',
        id: 'test',
      },
      {
        _type: 'InputContext',
        id: 'input',
      },
    ],
    global_contexts: [
      {
        _type: 'ApplicationContext',
        id: 'test',
      },
      {
        _type: 'InputValueContext',
        id: 'input',
        value: '123',
      },
    ],
  })
);

console.log(
  'PressEvent validation:',
  validate({
    _type: 'PressEvent',
    id: crypto.randomUUID(),
    time: Date.now(),
    location_stack: [
      {
        _type: 'RootLocationContext',
        id: 'test',
      },
      {
        _type: 'PressableContext',
        id: 'button',
      },
    ],
    global_contexts: [
      {
        _type: 'ApplicationContext',
        id: 'test',
      },
    ],
  })
);
