/*
 * Copyright 2022 Objectiv B.V.
 */

import { LogTransport, MockConsoleImplementation } from '@objectiv/testing-tools';
import { GlobalContextName, LocationContextName } from '@objectiv/tracker-core';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { ObjectivProvider, ReactTracker, TrackedDiv, TrackedRootLocationContext, TrackedSelect } from '../src';
import userEvent from '@testing-library/user-event';

require('@objectiv/developer-tools');
globalThis.objectiv.devTools?.TrackerConsole.setImplementation(MockConsoleImplementation);

describe('TrackedSelect', () => {
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
        <TrackedSelect id={'input-id'} data-testid={'test-select'}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.change(screen.getByTestId('test-select'));

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
        <TrackedSelect id={'input-id'} data-testid={'test-select'} trackValue={true}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.change(screen.getByTestId('test-select'), { target: { value: '2' } });

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
            value: '2',
          }),
        ]),
      })
    );
  });

  it('should allow tracking multiple values as InputValueContexts', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedSelect id={'input-id'} data-testid={'test-select'} multiple trackValue={true} defaultValue={['2', '4']}>
          <option value={1}>A</option>
          <option value={2}>B</option>
          <option value={3}>C</option>
          <option value={4}>D</option>
          <option value={5}>E</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    expect((screen.getByText('A') as HTMLOptionElement).selected).toBe(false);
    expect((screen.getByText('B') as HTMLOptionElement).selected).toBe(true);
    expect((screen.getByText('C') as HTMLOptionElement).selected).toBe(false);
    expect((screen.getByText('D') as HTMLOptionElement).selected).toBe(true);
    expect((screen.getByText('E') as HTMLOptionElement).selected).toBe(false);

    userEvent.selectOptions(screen.getByTestId('test-select'), '5');

    expect((screen.getByText('A') as HTMLOptionElement).selected).toBe(false);
    expect((screen.getByText('B') as HTMLOptionElement).selected).toBe(true);
    expect((screen.getByText('C') as HTMLOptionElement).selected).toBe(false);
    expect((screen.getByText('D') as HTMLOptionElement).selected).toBe(true);
    expect((screen.getByText('E') as HTMLOptionElement).selected).toBe(true);

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
            value: '2',
          }),
          expect.objectContaining({
            _type: GlobalContextName.InputValueContext,
            id: 'input-id',
            value: '4',
          }),
          expect.objectContaining({
            _type: GlobalContextName.InputValueContext,
            id: 'input-id',
            value: '5',
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
        <TrackedSelect id={'input-id'} data-testid={'test-select'} eventHandler={'onBlur'}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.blur(screen.getByTestId('test-select'));

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

  it('should allow tracking on onClick', async () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedSelect id={'input-id'} data-testid={'test-select'} eventHandler={'onClick'} defaultValue={'2'}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-select'), { target: { value: '1' } });

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
        <TrackedSelect id={'Input id 1'} data-testid={'test-select-1'} value={2} onChange={jest.fn}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
        <TrackedSelect id={'Input id 2'} normalizeId={false} data-testid={'test-select-2'}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.change(screen.getByTestId('test-select-1'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('test-select-2'));

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
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: new LogTransport() });

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedRootLocationContext Component={'div'} id={'root'}>
          <TrackedDiv id={'content'}>
            <TrackedSelect id={'☹️'}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </TrackedSelect>
          </TrackedDiv>
        </TrackedRootLocationContext>
      </ObjectivProvider>
    );

    expect(MockConsoleImplementation.error).toHaveBeenCalledTimes(1);
    expect(MockConsoleImplementation.error).toHaveBeenCalledWith(
      '｢objectiv｣ Could not generate a valid id for InputContext:select @ RootLocation:root / Content:content. Please provide the `id` property.'
    );
  });

  it('should allow forwarding refs', () => {
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: new LogTransport() });
    const ref = createRef<HTMLSelectElement>();

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedSelect id={'test-id'} ref={ref}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    expect(ref.current).toMatchInlineSnapshot(`
      <select>
        <option>
          1
        </option>
        <option>
          2
        </option>
        <option>
          3
        </option>
      </select>
    `);
  });

  it('should allow tracking onBlur instead of onChange', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    const onBlurSpy = jest.fn();

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedSelect
          id={'test-id'}
          defaultValue={'1'}
          data-testid={'test-select'}
          eventHandler={'onBlur'}
          onBlur={onBlurSpy}
          onChange={jest.fn}
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.blur(screen.getByTestId('test-select'), { target: { value: '2' } });

    expect(logTransport.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'test-id',
          }),
        ]),
      })
    );
    expect(onBlurSpy).toHaveBeenCalled();
  });

  it('should allow tracking onClick instead of onChange', () => {
    const logTransport = new LogTransport();
    jest.spyOn(logTransport, 'handle');
    const tracker = new ReactTracker({ applicationId: 'app-id', transport: logTransport });

    const onClickSpy = jest.fn();

    render(
      <ObjectivProvider tracker={tracker}>
        <TrackedSelect
          id={'test-id'}
          defaultValue={'1'}
          data-testid={'test-select'}
          eventHandler={'onClick'}
          onClick={onClickSpy}
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </TrackedSelect>
      </ObjectivProvider>
    );

    jest.resetAllMocks();

    fireEvent.click(screen.getByTestId('test-select'), { target: { value: '2' } });

    expect(logTransport.handle).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: 'InputChangeEvent',
        location_stack: expect.arrayContaining([
          expect.objectContaining({
            _type: LocationContextName.InputContext,
            id: 'test-id',
          }),
        ]),
      })
    );
    expect(onClickSpy).toHaveBeenCalled();
  });
});
