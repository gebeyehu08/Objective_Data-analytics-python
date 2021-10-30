import { TaggedElement } from '../definitions/elements';
import { isTaggedElement } from '../definitions/guards';
import { TaggingAttribute } from '../definitions/TaggingAttribute';
import { BrowserTracker } from '../internal/BrowserTracker';
import { trackInputChange } from '../trackEventHelpers';

/**
 * A factory to make the event handler to attach to new TaggedElements with the `trackBlurs` attributes set
 */
export const makeBlurEventHandler = (element: TaggedElement, tracker?: BrowserTracker) => (event: Event) => {
  if (
    // Either the Event's target is the TaggedElement itself
    event.target === element ||
    // Or the Event's currentTarget is am Element tagged to track Clicks (eg: the Event bubbled up to from a child)
    (isTaggedElement(event.currentTarget) && event.currentTarget.hasAttribute(TaggingAttribute.trackBlurs))
  ) {
    trackInputChange({ element, tracker });
  }
};
