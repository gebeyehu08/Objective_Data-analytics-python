/*
 * Copyright 2022 Objectiv B.V.
 */

const crypto = require('crypto');

const { getValidatorForSchemaVersion } = require('./common');
const { validatorPath } = getValidatorForSchemaVersion();
const validator = require(`${__dirname}/${validatorPath}`);

const {
  ApplicationLoadedEvent,
  InputChangeEvent,
  LinkContext,
  LocationStack,
  PressableContext,
  PressEvent,
  RootLocationContext,
  validate,
} = validator;

console.assert(
  RootLocationContext.safeParse({
    _type: 'RootLocationContext',
    id: 'test',
  }).success === true,
  'RootLocationContext should succeed'
);

console.assert(
  RootLocationContext.safeParse(
    {
      _type: 'RootLocationContext',
    }.success === false
  ),
  'RootLocationContext without id should fail'
);

console.assert(
  RootLocationContext.safeParse({
    _type: 'RootLocationContext',
    id: 'test',
    what: '123',
  }).success === false,
  'RootLocationContext with extra properties should fail'
);

console.assert(
  LinkContext.safeParse({
    _type: 'LinkContext',
    id: 'test',
    href: '/test',
  }).success === true,
  'LinkContext should succeed'
);

console.assert(
  LinkContext.safeParse({
    _type: 'LinkContext',
    href: '/test',
  }).success === false,
  'LinkContext without id should fail'
);

console.assert(
  LinkContext.safeParse({
    _type: 'LinkContext',
    id: 'test',
  }).success === false,
  'LinkContext without href should fail'
);

console.assert(
  LinkContext.safeParse({
    _type: 'LinkContext',
    id: 'test',
    href: '/test',
    what: '123',
  }).success === false,
  'LinkContext with extra properties should fail'
);

console.assert(
  PressableContext.safeParse({
    _type: 'LinkContext',
    id: 'test',
    href: '/test',
  }).success === true,
  'PressableContext should succeed parsing LinkContext'
);

console.assert(
  PressableContext.safeParse({
    _type: 'LinkContext',
    id: 'test',
  }).success === false,
  'PressableContext should fail parsing LinkContext that is missing href'
);

console.assert(
  PressableContext.safeParse({
    _type: 'PressableContext',
    id: 'test',
  }).success === true,
  'PressableContext should succeed'
);

console.assert(
  LocationStack.safeParse([
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
      id: 'test',
      href: '/test',
    },
  ]).success === true,
  'LocationStack with LinkContext should succeed'
);

console.assert(
  LocationStack.safeParse([
    {
      _type: 'RootLocationContext',
      id: 'test',
    },
    {
      _type: 'ContentContext',
      id: 'test2',
    },
    {
      _type: 'PressableContext',
      id: 'test',
    },
  ]).success === true,
  'LocationStack with PressableContext should succeed'
);

console.assert(
  InputChangeEvent.safeParse({
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
  }).success === true,
  'InputChangeEvent should succeed'
);

console.assert(
  ApplicationLoadedEvent.safeParse({
    _type: 'ApplicationLoadedEvent',
    id: crypto.randomUUID(),
    time: Date.now(),
    global_contexts: [
      {
        _type: 'ApplicationContext',
        id: 'test',
      },
    ],
  }).success === false,
  'ApplicationLoadedEvent without LocationStack should fail'
);

console.assert(
  ApplicationLoadedEvent.safeParse({
    _type: 'ApplicationLoadedEvent',
    id: crypto.randomUUID(),
    time: Date.now(),
    location_stack: [],
    global_contexts: [
      {
        _type: 'ApplicationContext',
        id: 'test',
      },
    ],
  }).success === true,
  'ApplicationLoadedEvent with empty LocationStack should succeed'
);

console.assert(
  PressEvent.safeParse({
    _type: 'PressEvent',
    id: crypto.randomUUID(),
    time: Date.now(),
    location_stack: [],
    global_contexts: [
      {
        _type: 'ApplicationContext',
        id: 'test',
      },
    ],
  }).success === false,
  'PressEvent with empty Location Stack should fail'
);

console.assert(
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
  }).success === true,
  'validate of InputChangeEvent should succeed'
);

console.assert(
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
        id: 'nope',
        value: '123',
      },
    ],
  }).success === false,
  'validate of InputChangeEvent should fail due to InputValueContext id mismatch'
);

console.assert(
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
  }).success === true,
  'validate of InputChangeEvent with multiple InputValueContext should succeed'
);

console.assert(
  PressEvent.safeParse({
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
  }).success === true,
  'PressEvent with LinkContext should succeed'
);

console.assert(
  PressEvent.safeParse({
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
        _type: 'PressableContext',
        id: 'link',
      },
    ],
    global_contexts: [
      {
        _type: 'ApplicationContext',
        id: 'test',
      },
    ],
  }).success === true,
  'PressEvent with PressableContext should succeed'
);
