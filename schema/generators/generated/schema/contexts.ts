/*
 * Copyright 2022 Objectiv B.V.
 */

import { AbstractGlobalContext, AbstractLocationContext } from './abstracts';
/**
* A GlobalContext describing in which app the event happens, like a website or iOS app.
*/
export interface ApplicationContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'ApplicationContext';
}

/**
* A Location Context that describes a logical section of the UI that contains other Location Contexts.
* Enabling Data Science to analyze this section specifically.
*/
export interface ContentContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'ContentContext';
}

/**
* Global context with information needed to reconstruct a user session.
*/
export interface CookieIdContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'CookieIdContext';
  /**
  * Unique identifier from the session cookie.
  */
  cookie_id: string;
}

/**
* A Location Context that describes a section of the UI that can expand & collapse.
*/
export interface ExpandableContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'ExpandableContext';
}

/**
* A GlobalContext describing meta information about the agent that sent the event.
*/
export interface HttpContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'HttpContext';
  /**
  * Full URL to HTTP referrer of the current page.
  */
  referrer: string;
  /**
  * User-agent of the agent that sent the event.
  */
  user_agent: string;
  /**
  * (public) IP address of the agent that sent the event.
  */
  remote_address: string;
}

/**
* A Global Context to track the identity of users across sessions, platforms, devices. Multiple can be
* present.
* The `id` field is used to specify the scope of identification e.g. backend, md5(email),
* supplier_cookie, etc.
* The `value` field should contain the unique identifier within that scope.
*/
export interface IdentityContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'IdentityContext';
  /**
  * The unique identifier for this user/group/entity within the scope defined by `id`.
  */
  value: string;
}

/**
* A Location Context that describes an element that accepts user input, i.e. a form field.
*/
export interface InputContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'InputContext';
}

/**
* A GlobalContext containing the value of a single input element. Multiple can be present.
*/
export interface InputValueContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'InputValueContext';
  /**
  * The value of the input element.
  */
  value: string;
}

/**
* A PressableContext that contains a destination (href).
*/
export interface LinkContext extends PressableContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'LinkContext';
  /**
  * URL (href) the link points to.
  */
  href: string;
}

/**
* A GlobalContext describing the users' language (ISO 639-1) and country (ISO 3166-1 alpha-2).
*/
export interface LocaleContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'LocaleContext';
  /**
  * Case sensitive ISO 639-1 language code. E.g. en, nl, fr, de, it, etc.
  */
  language_code: string;
  /**
  * Case sensitive ISO 3166-1 alpha-2 country code. E.g. US, NL, FR, DE, IT, etc.
  */
  country_code: string;
}

/**
* a context that captures marketing channel info, so users can do attribution, campaign 
* effectiveness and other models.
*/
export interface MarketingContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'MarketingContext';
  /**
  * The advertiser, site, publication, etc.
  */
  source: string;
  /**
  * Advertising or marketing medium: cpc, banner, email newsletter, etc.
  */
  medium: string;
  /**
  * Campaign name, slogan, promo code, etc.
  */
  campaign: string;
  /**
  * Search keywords.
  */
  term: string;
  /**
  * To differentiate similar content, or links within the same ad.
  */
  content: string;
  /**
  * Identifies the platform where the marketing activity was undertaken.
  */
  source_platform: string;
  /**
  * Identifies the creative used (e.g., skyscraper, banner, etc).
  */
  creative_format: string;
  /**
  * Identifies the marketing tactic used (e.g., onboarding, retention, acquisition etc).
  */
  marketing_tactic: string;
}

/**
* A Location Context that describes a section of the UI containing a media player.
*/
export interface MediaPlayerContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'MediaPlayerContext';
}

/**
* A Location Context that describes a section of the UI containing navigational elements, for example
* a menu.
*/
export interface NavigationContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'NavigationContext';
}

/**
* A Location Context that describes a section of the UI that represents an overlay, i.e. a Modal.
*/
export interface OverlayContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'OverlayContext';
}

/**
* A GlobalContext describing the path where the user is when an event is sent.
*/
export interface PathContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'PathContext';
}

/**
* A Location Context that describes an interactive element (like a link, button, icon), 
* that the user can press and will trigger an Interactive Event.
*/
export interface PressableContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 
    | 'PressableContext'
    | 'LinkContext';
  /**
  * An internal discriminator relating entities of the same hierarchical branch.
  */
  __pressable_context: true;
}

/**
* A Location Context that uniquely represents the top-level UI location of the user.
*/
export interface RootLocationContext extends AbstractLocationContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'RootLocationContext';
}

/**
* A GlobalContext describing meta information about the current session.
*/
export interface SessionContext extends AbstractGlobalContext {
  /**
  * A string literal used during serialization. Hardcoded to the Context name.
  */
  _type: 'SessionContext';
  /**
  * Hit counter relative to the current session, this event originated in.
  */
  hit_number: number;
}

