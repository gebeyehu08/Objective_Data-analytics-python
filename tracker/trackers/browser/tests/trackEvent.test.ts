/*
 * Copyright 2022 Objectiv B.V.
 */

import { matchUUID } from '@objectiv/testing-tools';
import {
  generateUUID,
  makeFailureEvent,
  makeApplicationLoadedEvent,
  makePressableContext,
  makePressEvent,
  makeSuccessEvent,
  makeInputChangeEvent,
  makeInteractiveEvent,
  makeContentContext,
  makeHiddenEvent,
  makeVisibleEvent,
  makeMediaEvent,
  makeMediaLoadEvent,
  makeMediaPauseEvent,
  makeMediaStartEvent,
  makeMediaStopEvent,
  makeNonInteractiveEvent,
} from '@objectiv/tracker-core';
import {
  BrowserTracker,
  getTracker,
  getTrackerRepository,
  makeTracker,
  TaggingAttribute,
  trackFailureEvent,
  trackApplicationLoadedEvent,
  trackPressEvent,
  trackSuccessEvent,
  trackEvent,
  trackInputChangeEvent,
  trackInteractiveEvent,
  trackHiddenEvent,
  trackVisibleEvent,
  trackMediaEvent,
  trackMediaLoadEvent,
  trackMediaPauseEvent,
  trackMediaStartEvent,
  trackMediaStopEvent,
  trackNonInteractiveEvent,
  trackVisibility,
} from '../src';
import { makeTaggedElement } from './mocks/makeTaggedElement';

describe('trackEvent', () => {
  const testElement = document.createElement('div');

  beforeEach(() => {
    jest.resetAllMocks();
    makeTracker({ applicationId: generateUUID(), endpoint: 'test' });
    expect(getTracker()).toBeInstanceOf(BrowserTracker);
    jest.spyOn(getTracker(), 'trackEvent');
  });

  afterEach(() => {
    getTrackerRepository().trackersMap = new Map();
    getTrackerRepository().defaultTracker = undefined;
    jest.resetAllMocks();
  });

  it('should use the global tracker instance if available', () => {
    expect(getTracker().trackEvent).not.toHaveBeenCalled();

    trackEvent({ event: makePressEvent(), element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        _type: 'PressEvent',
        id: matchUUID,
        global_contexts: [],
        location_stack: [],
      })
    );
  });

  it('should use the given location stack instead of the element DOM', () => {
    expect(getTracker().trackEvent).not.toHaveBeenCalled();

    const mainSection = makeTaggedElement('main', 'main', 'section');
    const div = document.createElement('div');
    const parentSection = makeTaggedElement('parent', 'parent', 'div');
    const section = document.createElement('section');
    const childSection = makeTaggedElement('child', 'child', 'span');
    const button = makeTaggedElement('button', 'button', 'button', true);

    mainSection.appendChild(div);
    div.appendChild(parentSection);
    parentSection.appendChild(section);
    section.appendChild(childSection);
    childSection.appendChild(button);

    trackEvent({ event: makePressEvent(), element: button });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        _type: 'PressEvent',
        id: matchUUID,
        global_contexts: [],
        location_stack: [
          makeContentContext({ id: 'main' }),
          makeContentContext({ id: 'parent' }),
          makeContentContext({ id: 'child' }),
          makePressableContext({ id: 'button' }),
        ],
      })
    );

    trackEvent({ event: makePressEvent({ location_stack: [makeContentContext({ id: 'custom' })] }), element: button });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(2);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        _type: 'PressEvent',
        id: matchUUID,
        global_contexts: [],
        location_stack: [makeContentContext({ id: 'custom' })],
      })
    );

    trackEvent({ event: makePressEvent({ location_stack: [makeContentContext({ id: 'custom' })] }) });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(3);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        _type: 'PressEvent',
        id: matchUUID,
        global_contexts: [],
        location_stack: [makeContentContext({ id: 'custom' })],
      })
    );
  });

  it('should use the given tracker instance', () => {
    const trackerOverride = new BrowserTracker({ applicationId: 'override', endpoint: 'override' });
    jest.spyOn(trackerOverride, 'trackEvent');

    expect(getTracker().trackEvent).not.toHaveBeenCalled();
    expect(trackerOverride.trackEvent).not.toHaveBeenCalled();

    trackEvent({ event: makePressEvent(), element: testElement, tracker: trackerOverride });

    expect(getTracker().trackEvent).not.toHaveBeenCalled();
    expect(trackerOverride.trackEvent).toHaveBeenCalledTimes(1);
    expect(trackerOverride.trackEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        _type: 'PressEvent',
        id: matchUUID,
        global_contexts: [],
        location_stack: [],
      })
    );
  });

  it('should track Tagged Elements with a location stack', () => {
    const testDivToTrack = document.createElement('div');
    testDivToTrack.setAttribute(TaggingAttribute.context, JSON.stringify(makeContentContext({ id: 'test' })));

    const div = document.createElement('div');
    div.setAttribute(TaggingAttribute.context, JSON.stringify(makeContentContext({ id: 'div' })));

    const midSection = document.createElement('section');
    midSection.setAttribute(TaggingAttribute.context, JSON.stringify(makeContentContext({ id: 'mid' })));

    const untrackedSection = document.createElement('div');

    const topSection = document.createElement('body');
    topSection.setAttribute(TaggingAttribute.context, JSON.stringify(makeContentContext({ id: 'top' })));

    div.appendChild(testDivToTrack);
    midSection.appendChild(div);
    untrackedSection.appendChild(midSection);
    topSection.appendChild(untrackedSection);

    trackEvent({ event: makePressEvent(), element: testDivToTrack });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        ...makePressEvent(),
        location_stack: expect.arrayContaining([
          expect.objectContaining({ _type: 'ContentContext', id: 'top' }),
          expect.objectContaining({ _type: 'ContentContext', id: 'mid' }),
          expect.objectContaining({ _type: 'ContentContext', id: 'div' }),
          expect.objectContaining({ _type: 'ContentContext', id: 'test' }),
        ]),
      })
    );
  });

  it('should track regular Elements with a location stack if their parents are Tagged Elements', () => {
    const div = document.createElement('div');
    div.setAttribute(TaggingAttribute.context, JSON.stringify(makeContentContext({ id: 'div' })));

    const midSection = document.createElement('section');
    midSection.setAttribute(TaggingAttribute.context, JSON.stringify(makeContentContext({ id: 'mid' })));

    const untrackedSection = document.createElement('div');

    const topSection = document.createElement('body');
    topSection.setAttribute(TaggingAttribute.context, JSON.stringify(makeContentContext({ id: 'top' })));

    div.appendChild(testElement);
    midSection.appendChild(div);
    untrackedSection.appendChild(midSection);
    topSection.appendChild(untrackedSection);

    trackEvent({ event: makePressEvent(), element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        ...makePressEvent(),
        location_stack: expect.arrayContaining([
          expect.objectContaining({ _type: 'ContentContext', id: 'top' }),
          expect.objectContaining({ _type: 'ContentContext', id: 'mid' }),
          expect.objectContaining({ _type: 'ContentContext', id: 'div' }),
        ]),
      })
    );
  });

  it('should track without a location stack', () => {
    const div = document.createElement('div');

    div.appendChild(testElement);

    trackEvent({ event: makePressEvent(), element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makePressEvent()));
  });

  it('should track a ClickEvent', () => {
    trackPressEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makePressEvent()));
  });

  it('should track a InputChangeEvent', () => {
    trackInputChangeEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeInputChangeEvent()));
  });

  it('should track an InteractiveEvent', () => {
    trackInteractiveEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeInteractiveEvent()));
  });

  it('should track a VisibleEvent', () => {
    trackVisibleEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeVisibleEvent()));
  });

  it('should track a HiddenEvent', () => {
    trackHiddenEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeHiddenEvent()));
  });

  it('should track a MediaEvent', () => {
    trackMediaEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeMediaEvent()));
  });

  it('should track a MediaLoadEvent', () => {
    trackMediaLoadEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeMediaLoadEvent()));
  });

  it('should track a MediaStartEvent', () => {
    trackMediaStartEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeMediaStartEvent()));
  });

  it('should track a MediaPauseEvent', () => {
    trackMediaPauseEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeMediaPauseEvent()));
  });

  it('should track a MediaStopEvent', () => {
    trackMediaStopEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeMediaStopEvent()));
    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should track an NonInteractiveEvent', () => {
    trackNonInteractiveEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeNonInteractiveEvent()));
  });

  it('should track either a VisibleEvent or HiddenEvent based on the given state', () => {
    trackVisibility({ element: testElement, isVisible: true });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeVisibleEvent()));

    trackVisibility({ element: testElement, isVisible: false });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(2);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(2, expect.objectContaining(makeHiddenEvent()));
  });

  it('should track an ApplicationLoadedEvent', () => {
    trackApplicationLoadedEvent();

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(1, expect.objectContaining(makeApplicationLoadedEvent()));

    trackApplicationLoadedEvent({ element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(2);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(2, expect.objectContaining(makeApplicationLoadedEvent()));
  });

  it('should track a SuccessCompletedEvent', () => {
    trackSuccessEvent({ message: 'ok' });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(makeSuccessEvent({ message: 'ok' }))
    );

    trackSuccessEvent({ message: 'ok', element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(2);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(makeSuccessEvent({ message: 'ok' }))
    );
  });

  it('should track an FailureEvent', () => {
    trackFailureEvent({ message: 'ko' });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(1);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining(makeFailureEvent({ message: 'ko' }))
    );

    trackFailureEvent({ message: 'ko', element: testElement });

    expect(getTracker().trackEvent).toHaveBeenCalledTimes(2);
    expect(getTracker().trackEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining(makeFailureEvent({ message: 'ko' }))
    );
  });
});

describe('trackEvent', () => {
  const testElement = document.createElement('div');

  getTrackerRepository().trackersMap = new Map();
  getTrackerRepository().defaultTracker = undefined;

  it('should console.error if a Tracker instance cannot be retrieved and was not provided either', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const parameters = { event: makePressEvent(), element: testElement };
    trackEvent(parameters);

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenNthCalledWith(1, '｢objectiv:TrackerRepository｣ There are no Trackers.');
    expect(console.error).toHaveBeenNthCalledWith(
      2,
      new Error('No Tracker found. Please create one via `makeTracker`.'),
      parameters
    );

    trackEvent({ ...parameters, onError: console.error });
    expect(console.error).toHaveBeenCalledTimes(4);
    expect(console.error).toHaveBeenNthCalledWith(
      4,
      new Error('No Tracker found. Please create one via `makeTracker`.')
    );
  });
});
