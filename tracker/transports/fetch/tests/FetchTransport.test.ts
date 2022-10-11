/*
 * Copyright 2021-2022 Objectiv B.V.
 */

import { MockConsoleImplementation } from '@objectiv/testing-tools';
import {
  generateGUID,
  isTransportSendError,
  makeTransportSendError,
  Tracker,
  TrackerEvent,
} from '@objectiv/tracker-core';
import fetchMock from 'jest-fetch-mock';
import { defaultFetchFunction, defaultFetchOptions, FetchTransport } from '../src';

const MOCK_ENDPOINT = 'http://test-endpoint';

const testEvent = new TrackerEvent({
  _type: 'test-event',
  id: generateGUID(),
  time: Date.now(),
});

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('FetchTransport', () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const testTracker = new Tracker({ applicationId: 'test', endpoint: MOCK_ENDPOINT });

  it('should send using `fetch` API with the default fetch function', async () => {
    const testTransport = new FetchTransport();
    testTransport.initialize(testTracker);
    expect(testTransport.isUsable()).toBe(true);
    await testTransport.handle(testEvent);
    expect(fetch).toHaveBeenCalledWith(MOCK_ENDPOINT, {
      body: JSON.stringify({
        events: [testEvent],
        client_session_id: globalThis.objectiv.clientSessionId,
        transport_time: Date.now(),
      }),
      ...defaultFetchOptions,
    });
  });

  it('should send to endpoint/anonymous when the tracker is in anonymous mode', async () => {
    const testTransport = new FetchTransport();
    const testTracker = new Tracker({
      applicationId: 'test',
      endpoint: MOCK_ENDPOINT,
      anonymous: true,
      transport: testTransport,
    });

    expect(testTracker.endpoint).toBe(MOCK_ENDPOINT + '/anonymous');
    expect(testTransport.endpoint).toBe(MOCK_ENDPOINT + '/anonymous');
    await testTracker.trackEvent(testEvent);
    expect(fetch).toHaveBeenCalledWith(MOCK_ENDPOINT + '/anonymous', expect.objectContaining(defaultFetchOptions));

    testTracker.setAnonymous(false);
    expect(testTracker.endpoint).toBe(MOCK_ENDPOINT);
    expect(testTransport.endpoint).toBe(MOCK_ENDPOINT);
    await testTracker.trackEvent(testEvent);
    expect(fetch).toHaveBeenCalledWith(MOCK_ENDPOINT, expect.objectContaining(defaultFetchOptions));

    testTracker.setAnonymous(true);
    expect(testTracker.endpoint).toBe(MOCK_ENDPOINT + '/anonymous');
    expect(testTransport.endpoint).toBe(MOCK_ENDPOINT + '/anonymous');
    await testTracker.trackEvent(testEvent);
    expect(fetch).toHaveBeenCalledWith(MOCK_ENDPOINT + '/anonymous', expect.objectContaining(defaultFetchOptions));
  });

  it('should send using `fetch` API with the provided customized fetch function', async () => {
    const customOptions: RequestInit = {
      ...defaultFetchOptions,
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const testTransport = new FetchTransport();
    testTransport.fetchFunction = ({ endpoint, events }) =>
      defaultFetchFunction({ endpoint, events, options: customOptions });
    testTransport.initialize(testTracker);
    await testTransport.handle(testEvent);
    expect(fetch).toHaveBeenCalledWith(MOCK_ENDPOINT, {
      body: JSON.stringify({
        events: [testEvent],
        client_session_id: globalThis.objectiv.clientSessionId,
        transport_time: Date.now(),
      }),
      ...customOptions,
    });
  });

  it('should be safe to call with an empty array of Events for devs without TS', async () => {
    // Create our Fetch Transport Instance
    const testTransport = new FetchTransport();
    testTransport.initialize(testTracker);

    // @ts-ignore purposely disable TS and call the handle method anyway
    await testTransport.handle();

    // Fetch should not have been called
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should reject with TransportSendError on http status !== 200', async () => {
    // Create our Fetch Transport Instance
    const testTransport = new FetchTransport();
    testTransport.initialize(testTracker);

    fetchMock.mockResponse('oops', { status: 500 });

    try {
      await testTransport.handle(testEvent);
    } catch (error) {
      expect(isTransportSendError(error as Error)).toBe(true);
    }

    await expect(testTransport.handle(testEvent)).rejects.toStrictEqual(makeTransportSendError());
  });

  it('should reject with TransportSendError on network failures', async () => {
    // Create our Fetch Transport Instance
    const testTransport = new FetchTransport();
    testTransport.initialize(testTracker);

    fetchMock.mockReject();

    try {
      await testTransport.handle(testEvent);
    } catch (error) {
      expect(error).toStrictEqual(makeTransportSendError());
    }

    await expect(testTransport.handle(testEvent)).rejects.toStrictEqual(makeTransportSendError());
  });
});
