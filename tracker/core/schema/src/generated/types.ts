/*
 * Copyright 2022 Objectiv B.V.
 */

import { AbstractLocationContext, AbstractGlobalContext } from './abstracts';

/**
 * The LocationStack is an ordered list (a stack) containing a hierarchy of LocationContexts, which
 * deterministically describes where in the UI of an application an Event took place.
 */
export type LocationStack = Array<AbstractLocationContext>;

/**
 * GlobalContexts add global/general information about the state in which an Event happened, such as a
 * user's identity and marketing information. They do not carry information related to where the Event
 * originated (location), which instead is captured by the LocationStack.
 */
export type GlobalContexts = Array<AbstractGlobalContext>;
