import {AbstractNonInteractiveEvent,AbstractVideoEvent,AbstractInteractiveEvent} from './abstracts';
export interface NonInteractiveEvent extends AbstractNonInteractiveEvent {
	readonly event: 'NonInteractiveEvent';
}
export interface DocumentLoadedEvent extends AbstractNonInteractiveEvent {
	readonly event: 'DocumentLoadedEvent';
}
export interface URLChangeEvent extends AbstractNonInteractiveEvent {
	readonly event: 'URLChangeEvent';
}
export interface ApplicationLoadedEvent extends AbstractNonInteractiveEvent {
	readonly event: 'ApplicationLoadedEvent';
}
export interface SectionVisibleEvent extends AbstractNonInteractiveEvent {
	readonly event: 'SectionVisibleEvent';
}
export interface SectionHiddenEvent extends AbstractNonInteractiveEvent {
	readonly event: 'SectionHiddenEvent';
}
export interface VideoEvent extends AbstractVideoEvent {
	readonly event: 'VideoEvent';
}
export interface VideoLoadEvent extends AbstractVideoEvent {
	readonly event: 'VideoLoadEvent';
}
export interface VideoStartEvent extends AbstractVideoEvent {
	readonly event: 'VideoStartEvent';
}
export interface VideoStopEvent extends AbstractVideoEvent {
	readonly event: 'VideoStopEvent';
}
export interface VideoPauseEvent extends AbstractVideoEvent {
	readonly event: 'VideoPauseEvent';
}
export interface InteractiveEvent extends AbstractInteractiveEvent {
	readonly event: 'InteractiveEvent';
}
export interface ClickEvent extends AbstractInteractiveEvent {
	readonly event: 'ClickEvent';
}
export interface InputChangeEvent extends AbstractInteractiveEvent {
	readonly event: 'InputChangeEvent';
}