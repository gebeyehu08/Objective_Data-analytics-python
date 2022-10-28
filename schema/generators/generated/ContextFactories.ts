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
  SessionContext
} from '@objectiv/schema';
import { AbstractContextName, GlobalContextName, LocationContextName } from './ContextNames';
import { generateGUID } from '../helpers';

/**
* A GlobalContext describing in which app the event happens, like a website or iOS app.
*/
export const makeApplicationContext = (props: {
  id: string,
}): ApplicationContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.ApplicationContext
  ],
  id: props.id,
  _type: GlobalContextName.ApplicationContext,
});

/**
* A Location Context that describes a logical section of the UI that contains other Location Contexts.
* Enabling Data Science to analyze this section specifically.
*/
export const makeContentContext = (props: {
  id: string,
}): ContentContext => ({
  __instance_id: generateGUID(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.ContentContext
  ],
  id: props.id,
  _type: LocationContextName.ContentContext,
});

/**
* Global context with information needed to reconstruct a user session.
*/
export const makeCookieIdContext = (props: {
  id: string,
  cookie_id: string,
}): CookieIdContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.CookieIdContext
  ],
  id: props.id,
  _type: GlobalContextName.CookieIdContext,
  cookie_id: props.cookie_id,
});

/**
* A Location Context that describes a section of the UI that can expand & collapse.
*/
export const makeExpandableContext = (props: {
  id: string,
}): ExpandableContext => ({
  __instance_id: generateGUID(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.ExpandableContext
  ],
  id: props.id,
  _type: LocationContextName.ExpandableContext,
});

/**
* A GlobalContext describing meta information about the agent that sent the event.
*/
export const makeHttpContext = (props: {
  id: string,
  referrer: string,
  user_agent: string,
  remote_address: string,
}): HttpContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.HttpContext
  ],
  id: props.id,
  _type: GlobalContextName.HttpContext,
  referrer: props.referrer,
  user_agent: props.user_agent,
  remote_address: props.remote_address,
});

/**
* A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be
* present.
* The `id` field is used to specify the scope of identification e.g. backend, md5(email),
* supplier_cookie, etc.
* The `value` field should contain the unique identifier within that scope.
*/
export const makeIdentityContext = (props: {
  id: string,
  value: string,
}): IdentityContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.IdentityContext
  ],
  id: props.id,
  _type: GlobalContextName.IdentityContext,
  value: props.value,
});

/**
* A Location Context that describes an element that accepts user input, i.e. a form field.
*/
export const makeInputContext = (props: {
  id: string,
}): InputContext => ({
  __instance_id: generateGUID(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.InputContext
  ],
  id: props.id,
  _type: LocationContextName.InputContext,
});

/**
* A GlobalContext containing the value of a single input element. Multiple can be present.
*/
export const makeInputValueContext = (props: {
  id: string,
  value: string,
}): InputValueContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.InputValueContext
  ],
  id: props.id,
  _type: GlobalContextName.InputValueContext,
  value: props.value,
});

/**
* A PressableContext that contains a destination (href).
*/
export const makeLinkContext = (props: {
  id: string,
  href: string,
}): LinkContext => ({
  __instance_id: generateGUID(),
  __pressable_context: true,
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.PressableContext,
    LocationContextName.LinkContext
  ],
  id: props.id,
  _type: LocationContextName.LinkContext,
  href: props.href,
});

/**
* A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).
*/
export const makeLocaleContext = (props: {
  id: string,
  language_code: string,
  country_code: string,
}): LocaleContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.LocaleContext
  ],
  id: props.id,
  _type: GlobalContextName.LocaleContext,
  language_code: props.language_code,
  country_code: props.country_code,
});

/**
* a context that captures marketing channel info, so users can do attribution, campaign 
* effectiveness and other models.
*/
export const makeMarketingContext = (props: {
  id: string,
  source: string,
  medium: string,
  campaign: string,
  term: string,
  content: string,
  source_platform: string,
  creative_format: string,
  marketing_tactic: string,
}): MarketingContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.MarketingContext
  ],
  id: props.id,
  _type: GlobalContextName.MarketingContext,
  source: props.source,
  medium: props.medium,
  campaign: props.campaign,
  term: props.term,
  content: props.content,
  source_platform: props.source_platform,
  creative_format: props.creative_format,
  marketing_tactic: props.marketing_tactic,
});

/**
* A Location Context that describes a section of the UI containing a media player.
*/
export const makeMediaPlayerContext = (props: {
  id: string,
}): MediaPlayerContext => ({
  __instance_id: generateGUID(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.MediaPlayerContext
  ],
  id: props.id,
  _type: LocationContextName.MediaPlayerContext,
});

/**
* A Location Context that describes a section of the UI containing navigational elements, for example
* a menu.
*/
export const makeNavigationContext = (props: {
  id: string,
}): NavigationContext => ({
  __instance_id: generateGUID(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.NavigationContext
  ],
  id: props.id,
  _type: LocationContextName.NavigationContext,
});

/**
* A Location Context that describes a section of the UI that represents an overlay, i.e. a Modal.
*/
export const makeOverlayContext = (props: {
  id: string,
}): OverlayContext => ({
  __instance_id: generateGUID(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.OverlayContext
  ],
  id: props.id,
  _type: LocationContextName.OverlayContext,
});

/**
* A GlobalContext describing the path where the user is when an event is sent.
*/
export const makePathContext = (props: {
  id: string,
}): PathContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.PathContext
  ],
  id: props.id,
  _type: GlobalContextName.PathContext,
});

/**
* A Location Context that describes an interactive element (like a link, button, icon), 
* that the user can press and will trigger an Interactive Event.
*/
export const makePressableContext = (props: {
  id: string,
}): PressableContext => ({
  __instance_id: generateGUID(),
  __pressable_context: true,
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.PressableContext
  ],
  id: props.id,
  _type: LocationContextName.PressableContext,
});

/**
* A Location Context that uniquely represents the top-level UI location of the user.
*/
export const makeRootLocationContext = (props: {
  id: string,
}): RootLocationContext => ({
  __instance_id: generateGUID(),
  __location_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.RootLocationContext
  ],
  id: props.id,
  _type: LocationContextName.RootLocationContext,
});

/**
* A GlobalContext describing meta information about the current session.
*/
export const makeSessionContext = (props: {
  id: string,
  hit_number: number,
}): SessionContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.SessionContext
  ],
  id: props.id,
  _type: GlobalContextName.SessionContext,
  hit_number: props.hit_number,
});

/**
* A factory to generate any Context.
*/
export function makeContext (props: {
  _type: 'ApplicationContext',
  id: string,
}): ApplicationContext;

export function makeContext (props: {
  _type: 'ContentContext',
  id: string,
}): ContentContext;

export function makeContext (props: {
  _type: 'CookieIdContext',
  id: string,
  cookie_id: string,
}): CookieIdContext;

export function makeContext (props: {
  _type: 'ExpandableContext',
  id: string,
}): ExpandableContext;

export function makeContext (props: {
  _type: 'HttpContext',
  id: string,
  referrer: string,
  user_agent: string,
  remote_address: string,
}): HttpContext;

export function makeContext (props: {
  _type: 'IdentityContext',
  id: string,
  value: string,
}): IdentityContext;

export function makeContext (props: {
  _type: 'InputContext',
  id: string,
}): InputContext;

export function makeContext (props: {
  _type: 'InputValueContext',
  id: string,
  value: string,
}): InputValueContext;

export function makeContext (props: {
  _type: 'LinkContext',
  id: string,
  href: string,
}): LinkContext;

export function makeContext (props: {
  _type: 'LocaleContext',
  id: string,
  language_code: string,
  country_code: string,
}): LocaleContext;

export function makeContext (props: {
  _type: 'MarketingContext',
  id: string,
  source: string,
  medium: string,
  campaign: string,
  term: string,
  content: string,
  source_platform: string,
  creative_format: string,
  marketing_tactic: string,
}): MarketingContext;

export function makeContext (props: {
  _type: 'MediaPlayerContext',
  id: string,
}): MediaPlayerContext;

export function makeContext (props: {
  _type: 'NavigationContext',
  id: string,
}): NavigationContext;

export function makeContext (props: {
  _type: 'OverlayContext',
  id: string,
}): OverlayContext;

export function makeContext (props: {
  _type: 'PathContext',
  id: string,
}): PathContext;

export function makeContext (props: {
  _type: 'PressableContext',
  id: string,
}): PressableContext;

export function makeContext (props: {
  _type: 'RootLocationContext',
  id: string,
}): RootLocationContext;

export function makeContext (props: {
  _type: 'SessionContext',
  id: string,
  hit_number: number,
}): SessionContext;

export function makeContext ({ _type, ...props }: any) {
  switch(_type) {
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
  }
}
