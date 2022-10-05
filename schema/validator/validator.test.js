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

 it('should fail due to wrong `id` type', () => {
    expect(RootLocationContext.safeParse({
      _type: 'RootLocationContext',
      id: 123,
    }).success).toBe(false);
  })

 it('should fail due to wrong `_type` type', () => {
    expect(RootLocationContext.safeParse({
      _type: 123,
      id: 'test',
    }).success).toBe(false);
  })

 it('should fail due to an extra property', () => {
    expect(RootLocationContext.safeParse({
      _type: 'RootLocationContext',
      id: 'test',
      extra: 123,
    }).success).toBe(false);
  })

 it('should fail due to missing `id`', () => {
    expect(RootLocationContext.safeParse({
      _type: 'RootLocationContext'
    }).success).toBe(false);
  })

 it('should fail due to missing `_type`', () => {
    expect(RootLocationContext.safeParse({
      id: 'test',
    }).success).toBe(false);
  })

 it('should fail due to mismatching _type', () => {
    expect(RootLocationContext.safeParse({
      _type: 'NotRootLocationContext',
      id: 'test',
    }).success).toBe(false);
  })
})
