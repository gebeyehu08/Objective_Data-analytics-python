/*
 * Copyright 2022 Objectiv B.V.
 */

const { RootLocationContext } = require('./validator.js');

describe('RootLocationContext', () => {
  it('should parse successfully', () => {
    expect(RootLocationContext.safeParse({
      _type: 'RootLocationContext',
      id: 'test',
    }).success).toBe(true);
  })
})
