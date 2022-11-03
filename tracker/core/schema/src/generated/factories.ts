/*
 * Copyright 2022 Objectiv B.V.
 */

import {
  ApplicationContext,
  ContentContext,
  CookieIdContext,
  ExpandableContext,
  HttpContext,
  IdentityContext,
  InputContext,
  InputValueContext,
  LinkContext,
  LocaleContext,
  MarketingContext,
  MediaPlayerContext,
  NavigationContext,
  OverlayContext,
  PathContext,
  PressableContext,
  RootLocationContext,
  SessionContext,
} from './contexts';
import {
  ApplicationLoadedEvent,
  FailureEvent,
  HiddenEvent,
  InputChangeEvent,
  InteractiveEvent,
  MediaEvent,
  MediaLoadEvent,
  MediaPauseEvent,
  MediaStartEvent,
  MediaStopEvent,
  NonInteractiveEvent,
  PressEvent,
  SuccessEvent,
  VisibleEvent,
} from './events';
import { GlobalContexts, LocationStack } from './types';
import { AbstractContextName, AbstractEventName, EventName, GlobalContextName, LocationContextName } from './names';
import { uuidv4 } from '../uuidv4';

/**
 * A GlobalContext describing in which app the event happens, like a website or iOS app.
 */
export const makeApplicationContext = (props: { id: string }): ApplicationContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.ApplicationContext,
  ],
  id: props.id,
  _type: GlobalContextName.ApplicationContext,
});

/**
 * A Location Context that describes a logical section of the UI that contains other Location Contexts.
 * Enabling Data Science to analyze this section specifically.
 */
export const makeContentContext = (props: { id: string }): ContentContext => ({
  __instance_id: uuidv4(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.ContentContext,
  ],
  id: props.id,
  _type: LocationContextName.ContentContext,
});

/**
 * Global context with information needed to reconstruct a user session.
 */
export const makeCookieIdContext = (props: { id: string; cookie_id: string }): CookieIdContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.CookieIdContext,
  ],
  id: props.id,
  _type: GlobalContextName.CookieIdContext,
  cookie_id: props.cookie_id,
});

/**
 * A Location Context that describes a section of the UI that can expand & collapse.
 */
export const makeExpandableContext = (props: { id: string }): ExpandableContext => ({
  __instance_id: uuidv4(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.ExpandableContext,
  ],
  id: props.id,
  _type: LocationContextName.ExpandableContext,
});

/**
 * A GlobalContext describing meta information about the agent that sent the event.
 */
export const makeHttpContext = (props: {
  id: string;
  referrer: string;
  user_agent: string;
  remote_address?: string | null;
}): HttpContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.HttpContext,
  ],
  id: props.id,
  _type: GlobalContextName.HttpContext,
  referrer: props.referrer,
  user_agent: props.user_agent,
  remote_address: props.remote_address ?? null,
});

/**
 * A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be
 * present.
 * The `id` field is used to specify the scope of identification e.g. backend, md5(email),
 * supplier_cookie, etc.
 * The `value` field should contain the unique identifier within that scope.
 */
export const makeIdentityContext = (props: { id: string; value: string }): IdentityContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.IdentityContext,
  ],
  id: props.id,
  _type: GlobalContextName.IdentityContext,
  value: props.value,
});

/**
 * A Location Context that describes an element that accepts user input, i.e. a form field.
 */
export const makeInputContext = (props: { id: string }): InputContext => ({
  __instance_id: uuidv4(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.InputContext,
  ],
  id: props.id,
  _type: LocationContextName.InputContext,
});

/**
 * A GlobalContext containing the value of a single input element. Multiple can be present.
 */
export const makeInputValueContext = (props: { id: string; value: string }): InputValueContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.InputValueContext,
  ],
  id: props.id,
  _type: GlobalContextName.InputValueContext,
  value: props.value,
});

/**
 * A PressableContext that contains a destination (href).
 */
export const makeLinkContext = (props: { id: string; href: string }): LinkContext => ({
  __instance_id: uuidv4(),
  __pressable_context: true,
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.PressableContext,
    LocationContextName.LinkContext,
  ],
  id: props.id,
  _type: LocationContextName.LinkContext,
  href: props.href,
});

/**
 * A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).
 */
export const makeLocaleContext = (props: {
  id: string;
  language_code?: string | null;
  country_code?: string | null;
}): LocaleContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.LocaleContext,
  ],
  id: props.id,
  _type: GlobalContextName.LocaleContext,
  language_code: props.language_code ?? null,
  country_code: props.country_code ?? null,
});

/**
 * a context that captures marketing channel info, so users can do attribution, campaign
 * effectiveness and other models.
 */
export const makeMarketingContext = (props: {
  id: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string | null;
  content?: string | null;
  source_platform?: string | null;
  creative_format?: string | null;
  marketing_tactic?: string | null;
}): MarketingContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.MarketingContext,
  ],
  id: props.id,
  _type: GlobalContextName.MarketingContext,
  source: props.source,
  medium: props.medium,
  campaign: props.campaign,
  term: props.term ?? null,
  content: props.content ?? null,
  source_platform: props.source_platform ?? null,
  creative_format: props.creative_format ?? null,
  marketing_tactic: props.marketing_tactic ?? null,
});

/**
 * A Location Context that describes a section of the UI containing a media player.
 */
export const makeMediaPlayerContext = (props: { id: string }): MediaPlayerContext => ({
  __instance_id: uuidv4(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.MediaPlayerContext,
  ],
  id: props.id,
  _type: LocationContextName.MediaPlayerContext,
});

/**
 * A Location Context that describes a section of the UI containing navigational elements, for example
 * a menu.
 */
export const makeNavigationContext = (props: { id: string }): NavigationContext => ({
  __instance_id: uuidv4(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.NavigationContext,
  ],
  id: props.id,
  _type: LocationContextName.NavigationContext,
});

/**
 * A Location Context that describes a section of the UI that represents an overlay, i.e. a Modal.
 */
export const makeOverlayContext = (props: { id: string }): OverlayContext => ({
  __instance_id: uuidv4(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.OverlayContext,
  ],
  id: props.id,
  _type: LocationContextName.OverlayContext,
});

/**
 * A GlobalContext describing the path where the user is when an event is sent.
 */
export const makePathContext = (props: { id: string }): PathContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.PathContext,
  ],
  id: props.id,
  _type: GlobalContextName.PathContext,
});

/**
 * A Location Context that describes an interactive element (like a link, button, icon),
 * that the user can press and will trigger an Interactive Event.
 */
export const makePressableContext = (props: { id: string }): PressableContext => ({
  __instance_id: uuidv4(),
  __pressable_context: true,
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.PressableContext,
  ],
  id: props.id,
  _type: LocationContextName.PressableContext,
});

/**
 * A Location Context that uniquely represents the top-level UI location of the user.
 */
export const makeRootLocationContext = (props: { id: string }): RootLocationContext => ({
  __instance_id: uuidv4(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.RootLocationContext,
  ],
  id: props.id,
  _type: LocationContextName.RootLocationContext,
});

/**
 * A GlobalContext describing meta information about the current session.
 */
export const makeSessionContext = (props: { id: string; hit_number: number }): SessionContext => ({
  __instance_id: uuidv4(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.SessionContext,
  ],
  id: props.id,
  _type: GlobalContextName.SessionContext,
  hit_number: props.hit_number,
});

/**
 * A factory to generate any Context.
 */
export function makeContext(props: { _type: 'ApplicationContext'; id: string }): ApplicationContext;

export function makeContext(props: { _type: 'ContentContext'; id: string }): ContentContext;

export function makeContext(props: { _type: 'CookieIdContext'; id: string; cookie_id: string }): CookieIdContext;

export function makeContext(props: { _type: 'ExpandableContext'; id: string }): ExpandableContext;

export function makeContext(props: {
  _type: 'HttpContext';
  id: string;
  referrer: string;
  user_agent: string;
  remote_address?: string | null;
}): HttpContext;

export function makeContext(props: { _type: 'IdentityContext'; id: string; value: string }): IdentityContext;

export function makeContext(props: { _type: 'InputContext'; id: string }): InputContext;

export function makeContext(props: { _type: 'InputValueContext'; id: string; value: string }): InputValueContext;

export function makeContext(props: { _type: 'LinkContext'; id: string; href: string }): LinkContext;

export function makeContext(props: {
  _type: 'LocaleContext';
  id: string;
  language_code?: string | null;
  country_code?: string | null;
}): LocaleContext;

export function makeContext(props: {
  _type: 'MarketingContext';
  id: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string | null;
  content?: string | null;
  source_platform?: string | null;
  creative_format?: string | null;
  marketing_tactic?: string | null;
}): MarketingContext;

export function makeContext(props: { _type: 'MediaPlayerContext'; id: string }): MediaPlayerContext;

export function makeContext(props: { _type: 'NavigationContext'; id: string }): NavigationContext;

export function makeContext(props: { _type: 'OverlayContext'; id: string }): OverlayContext;

export function makeContext(props: { _type: 'PathContext'; id: string }): PathContext;

export function makeContext(props: { _type: 'PressableContext'; id: string }): PressableContext;

export function makeContext(props: { _type: 'RootLocationContext'; id: string }): RootLocationContext;

export function makeContext(props: { _type: 'SessionContext'; id: string; hit_number: number }): SessionContext;

export function makeContext({ _type, ...props }: any) {
  switch (_type) {
    case 'ApplicationContext':
      return makeApplicationContext(props);
    case 'ContentContext':
      return makeContentContext(props);
    case 'CookieIdContext':
      return makeCookieIdContext(props);
    case 'ExpandableContext':
      return makeExpandableContext(props);
    case 'HttpContext':
      return makeHttpContext(props);
    case 'IdentityContext':
      return makeIdentityContext(props);
    case 'InputContext':
      return makeInputContext(props);
    case 'InputValueContext':
      return makeInputValueContext(props);
    case 'LinkContext':
      return makeLinkContext(props);
    case 'LocaleContext':
      return makeLocaleContext(props);
    case 'MarketingContext':
      return makeMarketingContext(props);
    case 'MediaPlayerContext':
      return makeMediaPlayerContext(props);
    case 'NavigationContext':
      return makeNavigationContext(props);
    case 'OverlayContext':
      return makeOverlayContext(props);
    case 'PathContext':
      return makePathContext(props);
    case 'PressableContext':
      return makePressableContext(props);
    case 'RootLocationContext':
      return makeRootLocationContext(props);
    case 'SessionContext':
      return makeSessionContext(props);
    default:
      throw new Error(`Unknown entity ${_type}`);
  }
}

/**
 * A NonInteractive event that is emitted after an application (e.g. SPA) has finished loading.
 */
export const makeApplicationLoadedEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): ApplicationLoadedEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.ApplicationLoadedEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.ApplicationLoadedEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * A NonInteractiveEvent that is sent when a user action results in an error,
 * like an invalid email when sending a form.
 */
export const makeFailureEvent = (props: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
  message: string;
}): FailureEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.FailureEvent],
  location_stack: props.location_stack ?? [],
  global_contexts: props.global_contexts ?? [],
  _type: EventName.FailureEvent,
  id: props.id ?? uuidv4(),
  time: props.time ?? Date.now(),
  message: props.message,
});

/**
 * A NonInteractiveEvent that's emitted after a LocationContext has become invisible.
 */
export const makeHiddenEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): HiddenEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.HiddenEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.HiddenEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * Event triggered when user input is modified.
 */
export const makeInputChangeEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): InputChangeEvent => ({
  __instance_id: uuidv4(),
  __interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent, EventName.InputChangeEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.InputChangeEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * The parent of Events that are the direct result of a user interaction, e.g. a button click.
 */
export const makeInteractiveEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): InteractiveEvent => ({
  __instance_id: uuidv4(),
  __interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.InteractiveEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * The parent of non-interactive events that are triggered by a media player.
 * It requires a MediaPlayerContext to detail the origin of the event.
 */
export const makeMediaEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaEvent => ({
  __instance_id: uuidv4(),
  __media_event: true,
  __non_interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.MediaEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.MediaEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * A MediaEvent that's emitted after a media item completes loading.
 */
export const makeMediaLoadEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaLoadEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0',
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaLoadEvent,
  ],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.MediaLoadEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * A MediaEvent that's emitted after a media item pauses playback.
 */
export const makeMediaPauseEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaPauseEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0',
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaPauseEvent,
  ],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.MediaPauseEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * A MediaEvent that's emitted after a media item starts playback.
 */
export const makeMediaStartEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaStartEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0',
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaStartEvent,
  ],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.MediaStartEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * A MediaEvent that's emitted after a media item stops playback.
 */
export const makeMediaStopEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaStopEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  __media_event: true,
  _schema_version: '1.0.0',
  _types: [
    AbstractEventName.AbstractEvent,
    EventName.NonInteractiveEvent,
    EventName.MediaEvent,
    EventName.MediaStopEvent,
  ],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.MediaStopEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * The parent of Events that are not directly triggered by a user action.
 */
export const makeNonInteractiveEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): NonInteractiveEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.NonInteractiveEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * An InteractiveEvent that is sent when a user presses on a pressable element
 * (like a link, button, icon).
 */
export const makePressEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): PressEvent => ({
  __instance_id: uuidv4(),
  __interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.InteractiveEvent, EventName.PressEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.PressEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * A NonInteractiveEvent that is sent when a user action is successfully completed,
 * like sending an email form.
 */
export const makeSuccessEvent = (props: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
  message: string;
}): SuccessEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.SuccessEvent],
  location_stack: props.location_stack ?? [],
  global_contexts: props.global_contexts ?? [],
  _type: EventName.SuccessEvent,
  id: props.id ?? uuidv4(),
  time: props.time ?? Date.now(),
  message: props.message,
});

/**
 * A NonInteractiveEvent that's emitted after a section LocationContext has become visible.
 */
export const makeVisibleEvent = (props?: {
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): VisibleEvent => ({
  __instance_id: uuidv4(),
  __non_interactive_event: true,
  _schema_version: '1.0.0',
  _types: [AbstractEventName.AbstractEvent, EventName.NonInteractiveEvent, EventName.VisibleEvent],
  location_stack: props?.location_stack ?? [],
  global_contexts: props?.global_contexts ?? [],
  _type: EventName.VisibleEvent,
  id: props?.id ?? uuidv4(),
  time: props?.time ?? Date.now(),
});

/**
 * A factory to generate any Event.
 */
export function makeEvent(props: {
  _type: 'ApplicationLoadedEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): ApplicationLoadedEvent;

export function makeEvent(props: {
  _type: 'FailureEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
  message: string;
}): FailureEvent;

export function makeEvent(props: {
  _type: 'HiddenEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): HiddenEvent;

export function makeEvent(props: {
  _type: 'InputChangeEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): InputChangeEvent;

export function makeEvent(props: {
  _type: 'InteractiveEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): InteractiveEvent;

export function makeEvent(props: {
  _type: 'MediaEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaEvent;

export function makeEvent(props: {
  _type: 'MediaLoadEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaLoadEvent;

export function makeEvent(props: {
  _type: 'MediaPauseEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaPauseEvent;

export function makeEvent(props: {
  _type: 'MediaStartEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaStartEvent;

export function makeEvent(props: {
  _type: 'MediaStopEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): MediaStopEvent;

export function makeEvent(props: {
  _type: 'NonInteractiveEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): NonInteractiveEvent;

export function makeEvent(props: {
  _type: 'PressEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): PressEvent;

export function makeEvent(props: {
  _type: 'SuccessEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
  message: string;
}): SuccessEvent;

export function makeEvent(props: {
  _type: 'VisibleEvent';
  location_stack?: LocationStack;
  global_contexts?: GlobalContexts;
  id?: string;
  time?: number;
}): VisibleEvent;

export function makeEvent({ _type, ...props }: any) {
  switch (_type) {
    case 'ApplicationLoadedEvent':
      return makeApplicationLoadedEvent(props);
    case 'FailureEvent':
      return makeFailureEvent(props);
    case 'HiddenEvent':
      return makeHiddenEvent(props);
    case 'InputChangeEvent':
      return makeInputChangeEvent(props);
    case 'InteractiveEvent':
      return makeInteractiveEvent(props);
    case 'MediaEvent':
      return makeMediaEvent(props);
    case 'MediaLoadEvent':
      return makeMediaLoadEvent(props);
    case 'MediaPauseEvent':
      return makeMediaPauseEvent(props);
    case 'MediaStartEvent':
      return makeMediaStartEvent(props);
    case 'MediaStopEvent':
      return makeMediaStopEvent(props);
    case 'NonInteractiveEvent':
      return makeNonInteractiveEvent(props);
    case 'PressEvent':
      return makePressEvent(props);
    case 'SuccessEvent':
      return makeSuccessEvent(props);
    case 'VisibleEvent':
      return makeVisibleEvent(props);
    default:
      throw new Error(`Unknown entity ${_type}`);
  }
}
