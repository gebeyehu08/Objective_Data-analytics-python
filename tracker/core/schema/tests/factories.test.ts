/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { expectToThrow, matchUUID } from '@objectiv/testing-tools';
import {
  AbstractContextName,
  AbstractEventName,
  EventName,
  GlobalContextName,
  LocationContextName,
  makeApplicationContext,
  makeApplicationLoadedEvent,
  makeContentContext,
  makeContext,
  makeCookieIdContext,
  makeEvent,
  makeExpandableContext,
  makeFailureEvent,
  makeHiddenEvent,
  makeHttpContext,
  makeIdentityContext,
  makeInputChangeEvent,
  makeInputContext,
  makeInputValueContext,
  makeInteractiveEvent,
  makeLinkContext,
  makeLocaleContext,
  makeMarketingContext,
  makeMediaEvent,
  makeMediaLoadEvent,
  makeMediaPauseEvent,
  makeMediaPlayerContext,
  makeMediaStartEvent,
  makeMediaStopEvent,
  makeNavigationContext,
  makeNonInteractiveEvent,
  makeOverlayContext,
  makePathContext,
  makePressableContext,
  makePressEvent,
  makeRootLocationContext,
  makeSessionContext,
  makeSuccessEvent,
  makeVisibleEvent,
  uuidv4,
} from '../src';

const contentA = makeContentContext({ id: 'A' });
const appContext = makeApplicationContext({ id: 'app' });
const customParameters = {
  location_stack: [contentA],
  global_contexts: [appContext],
  id: uuidv4(),
  time: Date.now(),
};

describe('Context Factories', () => {
  it(GlobalContextName.ApplicationContext, () => {
    expect(makeApplicationContext({ id: 'app' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.ApplicationContext,
      id: 'app',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.ApplicationContext,
      ],
    });
  });

  it(LocationContextName.ContentContext, () => {
    expect(makeContentContext({ id: 'content-A' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      _type: LocationContextName.ContentContext,
      id: 'content-A',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.ContentContext,
      ],
    });
  });

  it(GlobalContextName.CookieIdContext, () => {
    expect(makeCookieIdContext({ id: 'error-id', cookie_id: '12345' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.CookieIdContext,
      id: 'error-id',
      cookie_id: '12345', // Note: the cookieId parameter is mapped to cookie_id
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.CookieIdContext,
      ],
    });
  });

  it(LocationContextName.ExpandableContext, () => {
    expect(makeExpandableContext({ id: 'accordion-a' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      _type: LocationContextName.ExpandableContext,
      id: 'accordion-a',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.ExpandableContext,
      ],
    });
  });

  it(GlobalContextName.HttpContext, () => {
    expect(
      makeHttpContext({ id: 'http', referrer: 'referrer', user_agent: 'ua', remote_address: '0.0.0.0' })
    ).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.HttpContext,
      id: 'http',
      referrer: 'referrer',
      user_agent: 'ua',
      remote_address: '0.0.0.0',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.HttpContext,
      ],
    });

    expect(makeHttpContext({ id: 'http', referrer: 'referrer', user_agent: 'ua' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.HttpContext,
      id: 'http',
      referrer: 'referrer',
      user_agent: 'ua',
      remote_address: null,
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.HttpContext,
      ],
    });
  });

  it(LocationContextName.InputContext, () => {
    expect(makeInputContext({ id: 'input-1' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      _type: LocationContextName.InputContext,
      id: 'input-1',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.InputContext,
      ],
    });
  });

  it(GlobalContextName.InputValueContext, () => {
    expect(makeInputValueContext({ id: 'input-1', value: 'value' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.InputValueContext,
      id: 'input-1',
      value: 'value',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.InputValueContext,
      ],
    });
  });

  it(LocationContextName.LinkContext, () => {
    expect(makeLinkContext({ id: 'confirm-data', href: '/some/url' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      __pressable_context: true,
      _type: LocationContextName.LinkContext,
      id: 'confirm-data',
      href: '/some/url',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.PressableContext,
        LocationContextName.LinkContext,
      ],
    });
  });

  it(GlobalContextName.LocaleContext, () => {
    expect(makeLocaleContext({ id: 'en' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.LocaleContext,
      id: 'en',
      language_code: null,
      country_code: null,
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.LocaleContext,
      ],
    });

    expect(makeLocaleContext({ id: 'en', language_code: 'en' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.LocaleContext,
      id: 'en',
      language_code: 'en',
      country_code: null,
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.LocaleContext,
      ],
    });

    expect(makeLocaleContext({ id: 'US', country_code: 'US' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.LocaleContext,
      id: 'US',
      language_code: null,
      country_code: 'US',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.LocaleContext,
      ],
    });

    expect(makeLocaleContext({ id: 'en_US', language_code: 'en', country_code: 'US' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.LocaleContext,
      id: 'en_US',
      language_code: 'en',
      country_code: 'US',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.LocaleContext,
      ],
    });
  });

  it(GlobalContextName.MarketingContext, () => {
    expect(
      makeMarketingContext({
        id: 'utm',
        campaign: 'test-campaign',
        medium: 'test-medium',
        source: 'test-source',
      })
    ).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.MarketingContext,
      id: 'utm',
      campaign: 'test-campaign',
      medium: 'test-medium',
      source: 'test-source',
      term: null,
      content: null,
      source_platform: null,
      creative_format: null,
      marketing_tactic: null,
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.MarketingContext,
      ],
    });

    expect(
      makeMarketingContext({
        id: 'utm',
        campaign: 'test-campaign',
        medium: 'test-medium',
        source: 'test-source',
        term: 'test-term',
        content: 'test-content',
        source_platform: 'test-source-platform',
        creative_format: 'test-creative-format',
        marketing_tactic: 'test-marketing-tactic',
      })
    ).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.MarketingContext,
      id: 'utm',
      campaign: 'test-campaign',
      medium: 'test-medium',
      source: 'test-source',
      term: 'test-term',
      content: 'test-content',
      source_platform: 'test-source-platform',
      creative_format: 'test-creative-format',
      marketing_tactic: 'test-marketing-tactic',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.MarketingContext,
      ],
    });
  });

  it(GlobalContextName.IdentityContext, () => {
    expect(
      makeIdentityContext({
        id: 'backend',
        value: uuidv4(),
      })
    ).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.IdentityContext,
      id: 'backend',
      value: matchUUID,
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.IdentityContext,
      ],
    });
  });

  it(LocationContextName.MediaPlayerContext, () => {
    expect(makeMediaPlayerContext({ id: 'player-1' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      _type: LocationContextName.MediaPlayerContext,
      id: 'player-1',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.MediaPlayerContext,
      ],
    });
  });

  it(LocationContextName.NavigationContext, () => {
    expect(makeNavigationContext({ id: 'top-nav' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      _type: LocationContextName.NavigationContext,
      id: 'top-nav',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.NavigationContext,
      ],
    });
  });

  it(LocationContextName.OverlayContext, () => {
    expect(makeOverlayContext({ id: 'top-menu' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      _type: LocationContextName.OverlayContext,
      id: 'top-menu',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.OverlayContext,
      ],
    });
  });

  it(GlobalContextName.PathContext, () => {
    expect(makePathContext({ id: '/some/path' })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.PathContext,
      id: '/some/path',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.PathContext,
      ],
    });
  });

  it(LocationContextName.PressableContext, () => {
    expect(makePressableContext({ id: 'confirm-data' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      __pressable_context: true,
      _type: LocationContextName.PressableContext,
      id: 'confirm-data',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.PressableContext,
      ],
    });
  });

  it(LocationContextName.RootLocationContext, () => {
    expect(makeRootLocationContext({ id: 'page-A' })).toStrictEqual({
      __instance_id: matchUUID,
      __location_context: true,
      _type: LocationContextName.RootLocationContext,
      id: 'page-A',
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractLocationContext,
        LocationContextName.RootLocationContext,
      ],
    });
  });

  it(GlobalContextName.SessionContext, () => {
    expect(makeSessionContext({ id: 'session-id', hit_number: 123 })).toStrictEqual({
      __instance_id: matchUUID,
      __global_context: true,
      _type: GlobalContextName.SessionContext,
      id: 'session-id',
      hit_number: 123,
      _types: [
        AbstractContextName.AbstractContext,
        AbstractContextName.AbstractGlobalContext,
        GlobalContextName.SessionContext,
      ],
    });
  });

  it('Should throw an error', () => {
    // @ts-ignore
    expectToThrow(() => makeContext({ _type: 'what', id: 'test' }));
  });

  it('Should factor any context', () => {
    expect(makeContext({ _type: GlobalContextName.ApplicationContext, id: 'test' })._type).toBe(
      GlobalContextName.ApplicationContext
    );
    expect(makeContext({ _type: LocationContextName.ContentContext, id: 'test' })._type).toBe(
      LocationContextName.ContentContext
    );
    expect(makeContext({ _type: GlobalContextName.CookieIdContext, id: 'test', cookie_id: 'test' })._type).toBe(
      GlobalContextName.CookieIdContext
    );
    expect(makeContext({ _type: LocationContextName.ExpandableContext, id: 'test' })._type).toBe(
      LocationContextName.ExpandableContext
    );
    expect(
      makeContext({
        _type: GlobalContextName.HttpContext,
        id: 'test',
        referrer: 'test',
        user_agent: 'test',
        remote_address: 'test',
      })._type
    ).toBe(GlobalContextName.HttpContext);
    expect(makeContext({ _type: GlobalContextName.IdentityContext, id: 'test', value: 'test' })._type).toBe(
      GlobalContextName.IdentityContext
    );
    expect(makeContext({ _type: LocationContextName.InputContext, id: 'test' })._type).toBe(
      LocationContextName.InputContext
    );
    expect(makeContext({ _type: GlobalContextName.InputValueContext, id: 'test', value: 'test' })._type).toBe(
      GlobalContextName.InputValueContext
    );
    expect(makeContext({ _type: LocationContextName.LinkContext, id: 'test', href: 'test' })._type).toBe(
      LocationContextName.LinkContext
    );
    expect(makeContext({ _type: GlobalContextName.LocaleContext, id: 'test' })._type).toBe(
      GlobalContextName.LocaleContext
    );
    expect(
      makeContext({
        _type: GlobalContextName.MarketingContext,
        id: 'test',
        source: 'test',
        medium: 'test',
        campaign: 'test',
      })._type
    ).toBe(GlobalContextName.MarketingContext);
    expect(makeContext({ _type: LocationContextName.MediaPlayerContext, id: 'test' })._type).toBe(
      LocationContextName.MediaPlayerContext
    );
    expect(makeContext({ _type: LocationContextName.NavigationContext, id: 'test' })._type).toBe(
      LocationContextName.NavigationContext
    );
    expect(makeContext({ _type: LocationContextName.OverlayContext, id: 'test' })._type).toBe(
      LocationContextName.OverlayContext
    );
    expect(makeContext({ _type: GlobalContextName.PathContext, id: 'test' })._type).toBe(GlobalContextName.PathContext);
    expect(makeContext({ _type: LocationContextName.PressableContext, id: 'test' })._type).toBe(
      LocationContextName.PressableContext
    );
    expect(makeContext({ _type: LocationContextName.RootLocationContext, id: 'test' })._type).toBe(
      LocationContextName.RootLocationContext
    );
    expect(makeContext({ _type: GlobalContextName.SessionContext, id: 'test', hit_number: 0 })._type).toBe(
      GlobalContextName.SessionContext
    );
  });
});

describe('Event Factories', () => {
  it('ApplicationLoadedEvent', () => {
    expect(makeApplicationLoadedEvent()).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.ApplicationLoadedEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.ApplicationLoadedEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeApplicationLoadedEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.ApplicationLoadedEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.ApplicationLoadedEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('FailureEvent', () => {
    expect(makeFailureEvent({ message: 'ko' })).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.FailureEvent,
      global_contexts: [],
      location_stack: [],
      message: 'ko',
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.FailureEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeFailureEvent({ message: 'ko', ...customParameters })).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.FailureEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      message: 'ko',
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.FailureEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('HiddenEvent', () => {
    expect(makeHiddenEvent()).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.HiddenEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.HiddenEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeHiddenEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.HiddenEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.HiddenEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('InputChangeEvent', () => {
    expect(makeInputChangeEvent()).toStrictEqual({
      __interactive_event: true,
      _type: EventName.InputChangeEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent, EventName.InputChangeEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeInputChangeEvent(customParameters)).toStrictEqual({
      __interactive_event: true,
      _type: EventName.InputChangeEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent, EventName.InputChangeEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('InteractiveEvent', () => {
    expect(makeInteractiveEvent()).toStrictEqual({
      __interactive_event: true,
      _type: EventName.InteractiveEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
    expect(makeInteractiveEvent(customParameters)).toStrictEqual({
      __interactive_event: true,
      _type: EventName.InteractiveEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('MediaEvent', () => {
    expect(makeMediaEvent()).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.MediaEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeMediaEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.MediaEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('MediaLoadEvent', () => {
    expect(makeMediaLoadEvent()).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaLoadEvent,
      global_contexts: [],
      location_stack: [],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaLoadEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeMediaLoadEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaLoadEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaLoadEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('MediaStartEvent', () => {
    expect(makeMediaStartEvent()).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaStartEvent,
      global_contexts: [],
      location_stack: [],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaStartEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeMediaStartEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaStartEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaStartEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('MediaStopEvent', () => {
    expect(makeMediaStopEvent()).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaStopEvent,
      global_contexts: [],
      location_stack: [],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaStopEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeMediaStopEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaStopEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaStopEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('MediaPauseEvent', () => {
    expect(makeMediaPauseEvent()).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaPauseEvent,
      global_contexts: [],
      location_stack: [],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaPauseEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeMediaPauseEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      __media_event: true,
      _type: EventName.MediaPauseEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [
        AbstractEventName.AbstractEvent,
        EventName.NonInteractiveEvent,
        EventName.MediaEvent,
        EventName.MediaPauseEvent,
      ],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('NonInteractiveEvent', () => {
    expect(makeNonInteractiveEvent()).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.NonInteractiveEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
    expect(makeNonInteractiveEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.NonInteractiveEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('PressEvent', () => {
    expect(makePressEvent()).toStrictEqual({
      __interactive_event: true,
      _type: EventName.PressEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent, EventName.PressEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makePressEvent(customParameters)).toStrictEqual({
      __interactive_event: true,
      _type: EventName.PressEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent, EventName.PressEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('SuccessEvent', () => {
    expect(makeSuccessEvent({ message: 'ok' })).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.SuccessEvent,
      global_contexts: [],
      location_stack: [],
      message: 'ok',
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.SuccessEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeSuccessEvent({ message: 'ok', ...customParameters })).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.SuccessEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      message: 'ok',
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.SuccessEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('VisibleEvent', () => {
    expect(makeVisibleEvent()).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.VisibleEvent,
      global_contexts: [],
      location_stack: [],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.VisibleEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });

    expect(makeVisibleEvent(customParameters)).toStrictEqual({
      __non_interactive_event: true,
      _type: EventName.VisibleEvent,
      global_contexts: [appContext],
      location_stack: [contentA],
      _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.VisibleEvent],
      __instance_id: matchUUID,
      _schema_version: '1.0.0',
      id: matchUUID,
      time: expect.any(Number),
    });
  });

  it('Should throw an error', () => {
    // @ts-ignore
    expectToThrow(() => makeEvent({ _type: 'what' }));
  });

  it('Should factor any context', () => {
    expect(makeEvent({ _type: EventName.ApplicationLoadedEvent, id: 'test' })._type).toBe(
      EventName.ApplicationLoadedEvent
    );
    expect(makeEvent({ _type: EventName.FailureEvent, id: 'test', message: 'test' })._type).toBe(
      EventName.FailureEvent
    );
    expect(makeEvent({ _type: EventName.HiddenEvent, id: 'test' })._type).toBe(EventName.HiddenEvent);
    expect(makeEvent({ _type: EventName.InputChangeEvent, id: 'test' })._type).toBe(EventName.InputChangeEvent);
    expect(makeEvent({ _type: EventName.InteractiveEvent, id: 'test' })._type).toBe(EventName.InteractiveEvent);
    expect(makeEvent({ _type: EventName.MediaEvent, id: 'test' })._type).toBe(EventName.MediaEvent);
    expect(makeEvent({ _type: EventName.MediaLoadEvent, id: 'test' })._type).toBe(EventName.MediaLoadEvent);
    expect(makeEvent({ _type: EventName.MediaPauseEvent, id: 'test' })._type).toBe(EventName.MediaPauseEvent);
    expect(makeEvent({ _type: EventName.MediaStartEvent, id: 'test' })._type).toBe(EventName.MediaStartEvent);
    expect(makeEvent({ _type: EventName.MediaStopEvent, id: 'test' })._type).toBe(EventName.MediaStopEvent);
    expect(makeEvent({ _type: EventName.NonInteractiveEvent, id: 'test' })._type).toBe(EventName.NonInteractiveEvent);
    expect(makeEvent({ _type: EventName.PressEvent, id: 'test' })._type).toBe(EventName.PressEvent);
    expect(makeEvent({ _type: EventName.SuccessEvent, id: 'test', message: 'test' })._type).toBe(
      EventName.SuccessEvent
    );
    expect(makeEvent({ _type: EventName.VisibleEvent, id: 'test' })._type).toBe(EventName.VisibleEvent);
  });
});
