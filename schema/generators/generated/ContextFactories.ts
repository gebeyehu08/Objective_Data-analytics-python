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
  cookie_id: string,
  id: string,
}): CookieIdContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  cookie_id: props.cookie_id,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.CookieIdContext
  ],
  id: props.id,
  _type: GlobalContextName.CookieIdContext,
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
  referrer: string,
  user_agent: string,
  remote_address?: string,
  id: string,
}): HttpContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  referrer: props.referrer,
  user_agent: props.user_agent,
  remote_address: props.remote_address ?? null,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.HttpContext
  ],
  id: props.id,
  _type: GlobalContextName.HttpContext,
});

/**
* A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be
* present.
* The `id` field is used to specify the scope of identification e.g. backend, md5(email),
* supplier_cookie, etc.
* The `value` field should contain the unique identifier within that scope.
*/
export const makeIdentityContext = (props: {
  value: string,
  id: string,
}): IdentityContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  value: props.value,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.IdentityContext
  ],
  id: props.id,
  _type: GlobalContextName.IdentityContext,
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
  value: string,
  id: string,
}): InputValueContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  value: props.value,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.InputValueContext
  ],
  id: props.id,
  _type: GlobalContextName.InputValueContext,
});

/**
* A PressableContext that contains a destination (href).
*/
export const makeLinkContext = (props: {
  href: string,
  id: string,
}): LinkContext => ({
  __instance_id: generateGUID(),
  __pressable_context: true,
  __location_context: true,
  href: props.href,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractLocationContext,
    LocationContextName.PressableContext,
    LocationContextName.LinkContext
  ],
  id: props.id,
  _type: LocationContextName.LinkContext,
});

/**
* A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).
*/
export const makeLocaleContext = (props: {
  language_code?: string,
  country_code?: string,
  id: string,
}): LocaleContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  language_code: props.language_code ?? null,
  country_code: props.country_code ?? null,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.LocaleContext
  ],
  id: props.id,
  _type: GlobalContextName.LocaleContext,
});

/**
* a context that captures marketing channel info, so users can do attribution, campaign 
* effectiveness and other models.
*/
export const makeMarketingContext = (props: {
  source: string,
  medium: string,
  campaign: string,
  term?: string,
  content?: string,
  source_platform?: string,
  creative_format?: string,
  marketing_tactic?: string,
  id: string,
}): MarketingContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  source: props.source,
  medium: props.medium,
  campaign: props.campaign,
  term: props.term ?? null,
  content: props.content ?? null,
  source_platform: props.source_platform ?? null,
  creative_format: props.creative_format ?? null,
  marketing_tactic: props.marketing_tactic ?? null,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.MarketingContext
  ],
  id: props.id,
  _type: GlobalContextName.MarketingContext,
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
  hit_number: number,
  id: string,
}): SessionContext => ({
  __instance_id: generateGUID(),
  __global_context: true,
  hit_number: props.hit_number,
  _types: [
    AbstractContextName.AbstractContext,
    AbstractContextName.AbstractGlobalContext,
    GlobalContextName.SessionContext
  ],
  id: props.id,
  _type: GlobalContextName.SessionContext,
});

