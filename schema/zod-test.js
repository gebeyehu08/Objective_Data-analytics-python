/*
 * Copyright 2022 Objectiv B.V.
 */

const crypto = require('crypto');
const { InputChangeEvent, LinkContext, LocationStack, RootLocationContext } = require("./dist/zod.js");

console.log(
  "RootLocationContext validation:",
  RootLocationContext.parse({
    _type: "RootLocationContext",
    id: "test",
  })
);

console.log(
  "LinkContext validation:",
  LinkContext.parse({
    _type: "LinkContext",
    id: "test",
    href: "/test",
  })
);

console.log(
  "LocationStack validation:",
  LocationStack.parse([
    {
      _type: "RootLocationContext",
      id: "test",
    },
    {
      _type: "LinkContext",
      id: "test",
      href: "/test",
    },
    {
      _type: "ContentContext",
      id: "test2",
    },
  ])
);

console.log(
  "InputChangeEvent validation:",
  InputChangeEvent.parse({
    _type: "InputChangeEvent",
    id: crypto.randomUUID(),
    location_stack: [
      {
        _type: "RootLocationContext",
        id: "test",
      },
      {
        _type: "ContentContext",
        id: "test2",
      },
      {
        _type: "InputContext",
        id: "input",
      },
    ],
    global_contexts: [
      {
        _type: "ApplicationContext",
        id: "test",
      },
    ],
  })
);

console.log(
  "InputChangeEvent validation:",
  InputChangeEvent.parse({
    _type: "InputChangeEvent",
    id: crypto.randomUUID(),
    location_stack: [
      {
        _type: "RootLocationContext",
        id: "test",
      },
      {
        _type: "InputContext",
        id: "input",
      },
    ],
    global_contexts: [
      {
        _type: "ApplicationContext",
        id: "test",
      },
      {
        _type: "InputValueContext",
        id: "input",
        value: "123",
      },
    ],
  })
);
