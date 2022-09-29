/*
 * Copyright 2022 Objectiv B.V.
 */

import { LinkContext, LocationStack, RootLocationContext } from './validator.js';

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
