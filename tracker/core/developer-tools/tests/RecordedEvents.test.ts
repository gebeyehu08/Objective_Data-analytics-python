/*
 * Copyright 2022 Objectiv B.V.
 */

import {
  makeApplicationContext,
  makeApplicationLoadedEvent,
  makeContentContext,
  makeHttpContext,
  makeLinkContext,
  makeMediaLoadEvent,
  makeMediaPlayerContext,
  makeNavigationContext,
  makeOverlayContext,
  makePathContext,
  makePressableContext,
  makePressEvent,
  makeRootLocationContext,
  makeVisibleEvent,
} from '@objectiv/schema';
import { expectToThrow } from '@objectiv/testing-tools';
import { RecordedEvent } from '@objectiv/tracker-core';
import { RecordedEvents } from '../src/RecordedEvents';

describe('RecordedEvents', () => {
  // TODO fix this fixture (pun not intended). The new schema is stricter than this
  const events = [
    makeApplicationLoadedEvent({
      id: 'ApplicationLoadedEvent#1',
      location_stack: [makeRootLocationContext({ id: 'home' })],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makeMediaLoadEvent({
      id: 'MediaLoadEvent#1',
      location_stack: [
        makeRootLocationContext({ id: 'video' }),
        makeContentContext({ id: 'modeling' }),
        makeMediaPlayerContext({ id: '2-minute-video' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/video' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#1',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'logo', href: '/' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#10',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'contact-us', href: 'mailto:hi@objectiv.io' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#2',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'about-us', href: '/about' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/video' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#3',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'blog', href: '/blog' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#4',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'jobs', href: '/jobs' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#5',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'faq', href: 'http://localhost:3000/docs/home/the-project/faq' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#6',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'docs', href: 'http://localhost:3000/docs' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#7',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'github', href: 'https://github.com/objectiv/objectiv-analytics' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/video' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#8',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'slack', href: '/join-slack' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makePressEvent({
      id: 'PressEvent#9',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makeNavigationContext({ id: 'navbar-top' }),
        makeLinkContext({ id: 'twitter', href: 'https://twitter.com/objectiv_io' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
    makeVisibleEvent({
      id: 'VisibleEvent#1',
      location_stack: [
        makeRootLocationContext({ id: 'home' }),
        makePressableContext({ id: 'star-us-notification' }),
        makeOverlayContext({ id: 'star-us-notification-overlay' }),
      ],
      global_contexts: [
        makeApplicationContext({ id: 'objectiv-website-dev' }),
        makePathContext({ id: 'http://localhost:3000/' }),
        makeHttpContext({ id: 'http_context', referrer: '', user_agent: 'mocked-user-agent', remote_address: null }),
      ],
    }),
  ];

  const recordedEvents = new RecordedEvents(events);

  describe('filter', () => {
    it('should throw', async () => {
      // @ts-ignore
      expectToThrow(() => recordedEvents.filter(), `Invalid event filter options: undefined`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.filter(null), `Invalid event filter options: null`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.filter({}), `Invalid event filter options: {}`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.filter(123), `Invalid event filter options: 123`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.filter([]), `Invalid event filter options: `);
    });

    it('should filter by event _type', async () => {
      expect(recordedEvents.filter('ApplicationLoadedEvent').events).toStrictEqual([events[0]]);
      expect(recordedEvents.filter('MediaLoadEvent').events).toStrictEqual([events[1]]);
      expect(recordedEvents.filter('PressEvent').events).toStrictEqual(events.slice(0, -1).slice(2));
      expect(recordedEvents.filter('VisibleEvent').events).toStrictEqual([events[events.length - 1]]);
    });

    it('should filter by event _types', async () => {
      expect(recordedEvents.filter(['MediaLoadEvent', 'VisibleEvent']).events).toStrictEqual([
        events[1],
        events[events.length - 1],
      ]);
    });

    it('should filter by a predicate', async () => {
      expect(
        recordedEvents.filter(
          (recordedEvent: RecordedEvent) =>
            ['MediaLoadEvent', 'VisibleEvent'].includes(recordedEvent._type) &&
            recordedEvent.location_stack.some(
              ({ _type, id }) => _type === 'OverlayContext' && id === 'star-us-notification-overlay'
            )
        ).events
      ).toStrictEqual([events[events.length - 1]]);
    });

    it('should allow to chain filter', async () => {
      expect(recordedEvents.filter(['MediaLoadEvent', 'VisibleEvent']).filter('VisibleEvent').events).toStrictEqual([
        events[events.length - 1],
      ]);
    });
  });

  describe('withLocationContext', () => {
    it('should throw', async () => {
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withLocationContext(),
        `Invalid location context filter name option: undefined`
      );
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withLocationContext(null),
        `Invalid location context filter name option: null`
      );
      // @ts-ignore
      expectToThrow(() => recordedEvents.withLocationContext({}), `Invalid location context filter name option: {}`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.withLocationContext(123), `Invalid location context filter name option: 123`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.withLocationContext([]), `Invalid location context filter name option: `);
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withLocationContext('ContentContext', null),
        `Invalid location context filter id option: null`
      );
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withLocationContext('ContentContext', {}),
        `Invalid location context filter id option: {}`
      );
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withLocationContext('ContentContext', 123),
        `Invalid location context filter id option: 123`
      );
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withLocationContext('ContentContext', []),
        `Invalid location context filter id option: `
      );
    });

    it('should filter by location context', async () => {
      expect(recordedEvents.withLocationContext('MediaPlayerContext').events).toStrictEqual([events[1]]);
      expect(recordedEvents.withLocationContext('PressableContext').events).toStrictEqual([events[events.length - 1]]);
      expect(recordedEvents.withLocationContext('LinkContext').events).toStrictEqual(events.slice(0, -1).slice(2));
    });

    it('should filter by location context and id', async () => {
      expect(recordedEvents.withLocationContext('LinkContext', 'logo').events).toStrictEqual([events[2]]);
    });

    it('should allow to chain withLocationContext', async () => {
      expect(
        recordedEvents.withLocationContext('LinkContext').withLocationContext('LinkContext', 'twitter').events
      ).toStrictEqual([events[11]]);
    });
  });

  describe('withGlobalContext', () => {
    it('should throw', async () => {
      // @ts-ignore
      expectToThrow(() => recordedEvents.withGlobalContext(), `Invalid global context filter name option: undefined`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.withGlobalContext(null), `Invalid global context filter name option: null`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.withGlobalContext({}), `Invalid global context filter name option: {}`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.withGlobalContext(123), `Invalid global context filter name option: 123`);
      // @ts-ignore
      expectToThrow(() => recordedEvents.withGlobalContext([]), `Invalid global context filter name option: `);
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withGlobalContext('ApplicationContext', null),
        `Invalid location context filter id option: null`
      );
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withGlobalContext('ApplicationContext', {}),
        `Invalid location context filter id option: {}`
      );
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withGlobalContext('ApplicationContext', 123),
        `Invalid location context filter id option: 123`
      );
      expectToThrow(
        // @ts-ignore
        () => recordedEvents.withGlobalContext('ApplicationContext', []),
        `Invalid location context filter id option: `
      );
    });

    it('should filter by global context', async () => {
      expect(recordedEvents.withGlobalContext('PathContext').events).toStrictEqual(events);
    });

    it('should filter by global context and id', async () => {
      expect(recordedEvents.withGlobalContext('PathContext', 'http://localhost:3000/video').events).toStrictEqual([
        events[1],
        events[4],
        events[9],
      ]);
    });

    it('should allow to chain withGlobalContext', async () => {
      expect(
        recordedEvents.withGlobalContext('PathContext').withGlobalContext('PathContext', 'http://localhost:3000/video')
          .events
      ).toStrictEqual([events[1], events[4], events[9]]);
    });
  });
});
