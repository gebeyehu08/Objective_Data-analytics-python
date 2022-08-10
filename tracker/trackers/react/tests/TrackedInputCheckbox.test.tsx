/*
 * Copyright 2022 Objectiv B.V.
 */

import { LogTransport, MockConsoleImplementation } from '@objectiv/testing-tools';
import { GlobalContextName, LocationContextName } from '@objectiv/tracker-core';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ObjectivProvider, ReactTracker, TrackedDiv, TrackedInputCheckbox, TrackedRootLocationContext } from '../src';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('TrackedInputCheckbox', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.objectiv.TrackerRepository.trackersMap.clear();
    globalThis.objectiv.TrackerRepository.defaultTracker = undefined;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not allow changing the type attribute', () => {
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: new LogTransport() });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedInputCheckbox value={'value-1'} />
        <TrackedInputCheckbox type={'checkbox'} value={'value-2'} />
        {/* @ts-ignore silence the warning on the wrong type */}
        <TrackedInputCheckbox type={'text'} id={'input-id'} value={'value-3'} />
      </ObjectivProvider>
    );

    expect(MockConsoleImplementation.warn).toHaveBeenCalledTimes(1);
    expect(MockConsoleImplementation.warn).toHaveBeenCalledWith(
      "｢objectiv｣ TrackedInputCheckbox type attribute can only be set to 'checkbox'."
    );
  });

  it('should wrap the given Component in an InputContext', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedInputCheckbox data-testid={'test-checkbox'} value={'value'} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-checkbox'), { target: { checked: false } });

    expect(logTransport.handle).toHaveBeenCalledTimes(1);
    expect(logTransport.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'value',
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
        <TrackedInputCheckbox data-testid={'test-checkbox'} value={'value'} trackValue={true} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-checkbox'));

    expect(logTransport.handle).toHaveBeenCalledTimes(1);
    expect(logTransport.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'value',
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
            id: 'value',
            value: '1',
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
        <TrackedInputCheckbox id={'input-id'} data-testid={'test-checkbox'} value={'value'} eventHandler={'onBlur'} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.blur(screen.getByTestId('test-checkbox'));

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

  it('should allow tracking on onChange', async () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    const onChangeSpy = jest.fn();

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedInputCheckbox
          id={'input-id-1'}
          data-testid={'test-checkbox-1'}
          value={'value-1'}
          eventHandler={'onChange'}
          onChange={onChangeSpy}
        />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    // NOTE: we trigger click here instead of change, because the latter doesn't actually work
    fireEvent.click(screen.getByTestId('test-checkbox-1'));

    // This spy actually confirms that onChange triggered
    expect(onChangeSpy).toHaveBeenCalledTimes(1);

    expect(logTransport.handle).toHaveBeenCalledTimes(1);
    expect(logTransport.handle).toHaveBeenCalledWith(
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
  });

  it('should allow disabling id normalization', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedInputCheckbox id={'Input id 1'} data-testid={'test-checkbox-1'} value={'test'} />
        <TrackedInputCheckbox normalizeId={false} data-testid={'test-checkbox-2'} value={'Input id 2'} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-checkbox-1'));
    fireEvent.click(screen.getByTestId('test-checkbox-2'));

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
            <TrackedInputCheckbox id={'☹️'} />
          </TrackedDiv>
        </TrackedRootLocationContext>
      </ObjectivProvider>
    );

    expect(MockConsoleImplementation.error).toHaveBeenCalledTimes(1);
    expect(MockConsoleImplementation.error).toHaveBeenCalledWith(
      '｢objectiv｣ Could not generate a valid id for InputContext @ RootLocation:root / Content:content. Please provide the `id` property.'
    );
  });

  it('should console.error if an id cannot be automatically generated from value', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: new LogTransport() });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRootLocationContext Component={'div'} id={'root'}>
          <TrackedDiv id={'content'}>
            <TrackedInputCheckbox value={''} />
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
        <TrackedInputCheckbox data-testid={'test-checkbox'} value={'value'} trackValue={true} stateless={true} />
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-checkbox'));
    fireEvent.click(screen.getByTestId('test-checkbox'));
    fireEvent.click(screen.getByTestId('test-checkbox'));

    expect(logTransport.handle).toHaveBeenCalledTimes(3);
    const expectedEventPayload = {
      _type: 'InputChangeEvent',
      location_stack: expect.arrayContaining([
        expect.objectContaining({
          _type: LocationContextName.InputContext,
          id: 'value',
        }),
      ]),
      global_contexts: expect.arrayContaining([
        expect.objectContaining({
          _type: GlobalContextName.InputValueContext,
          id: 'value',
          value: expect.stringMatching('0|1'),
        }),
      ]),
    };
    expect(logTransport.handle).toHaveBeenNthCalledWith(1, expect.objectContaining(expectedEventPayload));
    expect(logTransport.handle).toHaveBeenNthCalledWith(2, expect.objectContaining(expectedEventPayload));
    expect(logTransport.handle).toHaveBeenNthCalledWith(3, expect.objectContaining(expectedEventPayload));
  });
});
