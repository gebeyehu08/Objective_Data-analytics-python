/*
* Copyright 2022 Objectiv B.V.
*/

export enum ContextTypes {
	AbstractContext,
	AbstractGlobalContext,
	AbstractLocationContext,
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
}

export enum EventTypes {
	AbstractEvent,
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
	VisibleEvent
}

