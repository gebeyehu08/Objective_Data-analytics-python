/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { AbstractContextName, LocationContextName } from '@objectiv/schema';
import { matchUUID, MockConsoleImplementation } from '@objectiv/testing-tools';
import {
  tagContent,
  tagExpandable,
  TaggingAttribute,
  tagInput,
  tagLink,
  tagMediaPlayer,
  tagNavigation,
  tagOverlay,
  tagPressable,
  tagRootLocation,
} from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('tagLocationHelpers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an empty object when error occurs', () => {
    // @ts-ignore
    expect(tagContent()).toBeUndefined();
    // @ts-ignore
    expect(tagExpandable()).toBeUndefined();
    // @ts-ignore
    expect(tagInput()).toBeUndefined();
    // @ts-ignore
    expect(tagLink()).toBeUndefined();
    // @ts-ignore
    expect(tagMediaPlayer()).toBeUndefined();
    // @ts-ignore
    expect(tagNavigation()).toBeUndefined();
    // @ts-ignore
    expect(tagOverlay()).toBeUndefined();
    // @ts-ignore
    expect(tagRootLocation()).toBeUndefined();
    // @ts-ignore
    expect(tagPressable()).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ wrong: 'test-button' })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: undefined })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: 0 })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: false })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: true })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: {} })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: Infinity })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: -Infinity })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: 'test', options: 'nope' })).toBeUndefined();
    // @ts-ignore
    expect(tagPressable({ id: 'test', options: 'nope' }, null)).toBeUndefined();
  });

  it('tagPressable', () => {
    const taggingAttributes = tagPressable({ id: 'test-button' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __pressable_context: true,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.PressableContext,
        ],
        id: 'test-button',
        _type: LocationContextName.PressableContext,
      }),
      [TaggingAttribute.trackClicks]: 'true',
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagContent', () => {
    const taggingAttributes = tagContent({ id: 'test-section' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.ContentContext,
        ],
        id: 'test-section',
        _type: LocationContextName.ContentContext,
      }),
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagExpandable', () => {
    const taggingAttributes = tagExpandable({ id: 'test-expandable' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.ExpandableContext,
        ],
        id: 'test-expandable',
        _type: LocationContextName.ExpandableContext,
      }),
      [TaggingAttribute.trackVisibility]: '{"mode":"auto"}',
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagInput', () => {
    const taggingAttributes = tagInput({ id: 'test-input' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.InputContext,
        ],
        id: 'test-input',
        _type: LocationContextName.InputContext,
      }),
      [TaggingAttribute.trackBlurs]: 'true',
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagInput with value tracking', () => {
    const taggingAttributes = tagInput({ id: 'test-input', options: { trackBlurs: { trackValue: true } } });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.InputContext,
        ],
        id: 'test-input',
        _type: LocationContextName.InputContext,
      }),
      [TaggingAttribute.trackBlurs]: '{"trackValue":true}',
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagLink', () => {
    const taggingAttributes = tagLink({ id: 'link', href: '/test' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __pressable_context: true,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.PressableContext,
          LocationContextName.LinkContext,
        ],
        id: 'link',
        _type: LocationContextName.LinkContext,
        href: '/test',
      }),
      [TaggingAttribute.trackClicks]: 'true',
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagMediaPlayer', () => {
    const taggingAttributes = tagMediaPlayer({ id: 'test-media-player' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.MediaPlayerContext,
        ],
        id: 'test-media-player',
        _type: LocationContextName.MediaPlayerContext,
      }),
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagNavigation', () => {
    const taggingAttributes = tagNavigation({ id: 'test-nav' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.NavigationContext,
        ],
        id: 'test-nav',
        _type: LocationContextName.NavigationContext,
      }),
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagOverlay', () => {
    const taggingAttributes = tagOverlay({ id: 'test-overlay' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.OverlayContext,
        ],
        id: 'test-overlay',
        _type: LocationContextName.OverlayContext,
      }),
      [TaggingAttribute.trackVisibility]: '{"mode":"auto"}',
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });

  it('tagRootLocation', () => {
    const taggingAttributes = tagRootLocation({ id: 'test-page' });

    const expectedTaggingAttributes = {
      [TaggingAttribute.elementId]: matchUUID,
      [TaggingAttribute.context]: JSON.stringify({
        __instance_id: taggingAttributes ? JSON.parse(taggingAttributes[TaggingAttribute.context]).__instance_id : null,
        __location_context: true,
        _types: [
          AbstractContextName.AbstractContext,
          AbstractContextName.AbstractLocationContext,
          LocationContextName.RootLocationContext,
        ],
        id: 'test-page',
        _type: LocationContextName.RootLocationContext,
      }),
    };

    expect(taggingAttributes).toStrictEqual(expectedTaggingAttributes);
  });
});
