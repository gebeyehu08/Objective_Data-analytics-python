/*
 * Copyright 2022 Objectiv B.V.
 */

import crypto from 'crypto';
import {
  InputChangeEvent,
  LinkContext,
  LocationStack,
  PressableContext,
  PressEvent,
  RootLocationContext,
  validate,
} from './validator.js';

RootLocationContext.parse({
  _type: 'RootLocationContext',
  id: 'test',
});

LinkContext.parse({
  _type: 'LinkContext',
  id: 'test',
  href: '/test',
});

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
]);

LocationStack.parse([
  {
    _type: 'RootLocationContext',
    id: 'test',
  },
  {
    _type: 'PressableContext',
    id: 'test',
  },
  {
    _type: 'ContentContext',
    id: 'test2',
  },
]);

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
});

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
});

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
      _type: 'PressableContext',
      id: 'button',
    },
    {
      _type: 'InputContext',
      id: 'test',
    },
  ],
  global_contexts: [
    {
      _type: 'ApplicationContext',
      id: 'test',
    },
    {
      _type: 'InputValueContext',
      id: 'test',
      value: '1',
    },
    {
      _type: 'InputValueContext',
      id: 'test',
      value: '2',
    },
  ],
});

PressableContext.parse({
  _type: 'LinkContext',
  id: 'child',
  href: '/test',
});

PressEvent.parse({
  _type: 'PressEvent',
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
      _type: 'LinkContext',
      id: 'link',
      href: '/test',
    },
  ],
  global_contexts: [
    {
      _type: 'ApplicationContext',
      id: 'test',
    },
  ],
});
