/*
 * Copyright 2022 Objectiv B.V.
 */

import { MockConsoleImplementation, LogTransport } from '@objectiv/testing-tools';
import { GlobalContextName, LocationContextName } from '@objectiv/tracker-core';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ObjectivProvider, ReactTracker, TrackedDiv, TrackedRadio, TrackedRootLocationContext } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('TrackedRadio', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.objectiv.TrackerRepository.trackersMap.clear();
    globalThis.objectiv.TrackerRepository.defaultTracker = undefined;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should wrap the given Component in an InputContext', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRadio id={'input-id'} data-testid={'test-radio'} value={'value'} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-radio'), { target: { value: 'value1' } });

    expect(logTransport.handle).toHaveBeenCalledTimes(1);
    expect(logTransport.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'input-id',
          }),
        ]),
        global_contexts: expect.not.arrayContaining([
          expect.objectContaining({
            _type: GlobalContextName.InputValueContext,
          }),
        ]),
      })
    );
  });

  it('should allow tracking values as InputValueContexts', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRadio id={'input-id'} data-testid={'test-radio'} value={'value'} trackValue={true} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-radio'));

    expect(logTransport.handle).toHaveBeenCalledTimes(1);
    expect(logTransport.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'input-id',
          }),
        ]),
        global_contexts: expect.arrayContaining([
          expect.objectContaining({
            _type: GlobalContextName.ApplicationContext,
          }),
          expect.objectContaining({
            _type: GlobalContextName.PathContext,
          }),
          expect.objectContaining({
            _type: GlobalContextName.HttpContext,
          }),
          expect.objectContaining({
            _type: GlobalContextName.InputValueContext,
            id: 'input-id',
            value: 'value',
          }),
        ]),
      })
    );
  });

  it('should allow tracking on onBlur', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRadio id={'input-id'} data-testid={'test-radio'} value={'value'} eventHandler={'onBlur'} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.blur(screen.getByTestId('test-radio'));

    expect(logTransport.handle).toHaveBeenCalledTimes(1);
    expect(logTransport.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'input-id',
          }),
        ]),
      })
    );
  });

  it('should allow disabling id normalization', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRadio id={'Input id 1'} data-testid={'test-radio-1'} value={'text'} />
        <TrackedRadio id={'Input id 2'} normalizeId={false} data-testid={'test-radio-2'} value={'text'} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-radio-1'));
    fireEvent.click(screen.getByTestId('test-radio-2'));

    expect(logTransport.handle).toHaveBeenCalledTimes(2);
    expect(logTransport.handle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'input-id-1',
          }),
        ]),
      })
    );
    expect(logTransport.handle).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'Input id 2',
          }),
        ]),
      })
    );
  });

  it('should console.error if an id cannot be automatically generated', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: new LogTransport() });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRootLocationContext Component={'div'} id={'root'}>
          <TrackedDiv id={'content'}>
            <TrackedRadio id={'☹️'} />
          </TrackedDiv>
        </TrackedRootLocationContext>
      </ObjectivProvider>
    );

    expect(MockConsoleImplementation.error).toHaveBeenCalledTimes(1);
    expect(MockConsoleImplementation.error).toHaveBeenCalledWith(
      '｢objectiv｣ Could not generate a valid id for InputContext @ RootLocation:root / Content:content. Please provide the `id` property.'
    );
  });

  it('should track as many times as interacted, regardless of its value being the same', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRadio id={'input-id'} data-testid={'test-radio'} value={'value'} trackValue={true} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-radio'));
    fireEvent.click(screen.getByTestId('test-radio'));
    fireEvent.click(screen.getByTestId('test-radio'));

    expect(logTransport.handle).toHaveBeenCalledTimes(3);
    const expectedEventPayload = {
      _type: 'InputChangeEvent',
      location_stack: expect.arrayContaining([
        expect.objectContaining({
          _type: LocationContextName.InputContext,
          id: 'input-id',
        }),
      ]),
      global_contexts: expect.arrayContaining([
        expect.objectContaining({
          _type: GlobalContextName.InputValueContext,
          id: 'input-id',
          value: 'value',
        }),
      ]),
    };
    expect(logTransport.handle).toHaveBeenNthCalledWith(1, expect.objectContaining(expectedEventPayload));
    expect(logTransport.handle).toHaveBeenNthCalledWith(2, expect.objectContaining(expectedEventPayload));
    expect(logTransport.handle).toHaveBeenNthCalledWith(3, expect.objectContaining(expectedEventPayload));
  });
});
