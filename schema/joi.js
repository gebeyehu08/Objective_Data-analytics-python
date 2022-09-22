/*
 * Copyright 2022 Objectiv B.V.
 */

const crypto = require('crypto');
const Joi = require('joi');

const CommonContextAttributes = Joi.object().keys({
  id: Joi.string().required(),
})

const ContentContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('ContentContext').required(),
});

const ExpandableContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('ExpandableContext').required(),
});

const InputContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('InputContext').required(),
});

const LinkContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('LinkContext').required(),
  href: Joi.string().uri({ allowRelative: true }).required(),
});

const MediaPlayerContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('MediaPlayerContext').required(),
});

const NavigationContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('NavigationContext').required(),
});

const OverlayContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('OverlayContext').required(),
});

const PressableContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('PressableContext').required(),
});

const RootLocationContext = CommonContextAttributes.keys({
  _type: Joi.string().valid('RootLocationContext').required(),
});

const NonRootLocationContexts = [
  ContentContext,
  ExpandableContext,
  InputContext,
  LinkContext,
  MediaPlayerContext,
  NavigationContext,
  OverlayContext,
  PressableContext,
]

// Events

const CommonEventAttributes = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  time: Joi.date().timestamp().required(),
})

const CommonInteractiveEventAttributes = CommonEventAttributes.keys({
  location_stack: Joi.array()
    // RootLocationContext must be the first item and it's required
    .ordered(RootLocationContext.required())
    // All other items can be LocationContexts
    .items(...NonRootLocationContexts)
    // Items in the LocationStack must have unique _type+id combinations
    .unique((a, b) => a._type === b._type && a.id === b.id)
    // Interactive events must have a Location Stack
    .required()
})

const CommonNonInteractiveEventAttributes = CommonEventAttributes.keys({
  location_stack: Joi.array()
    // RootLocationContext must be the first
    .ordered(RootLocationContext)
    // All other items can be LocationContexts
    .items(...NonRootLocationContexts)
    // Items in the LocationStack must have unique _type+id combinations
    .unique((a, b) => a._type === b._type && a.id === b.id)
})




const PressEvent = CommonInteractiveEventAttributes.keys({
  _type: Joi.string().valid('PressEvent').required()
})

const InputChangeEvent = CommonInteractiveEventAttributes.keys({
  _type: Joi.string().valid('InputChangeEvent').required()
})

const SuccessEvent = CommonNonInteractiveEventAttributes.keys({
  _type: Joi.string().valid('SuccessEvent').required(),
  message: Joi.string().required()
})

const Event = Joi.alternatives(
  PressEvent,
  InputChangeEvent,
  SuccessEvent
)




// TEST
console.log('Event validation:', Event.validate({
  _type: "PressEvent",
  id: crypto.randomUUID(),
  time: Date.now(),
  location_stack: [
    {
      _type: 'RootLocationContext',
      id: 'home'
    },
    {
      _type: 'ContentContext',
      id: 'main'
    },
    {
      _type: 'LinkContext',
      id: 'link',
      href: '/test'
    }
  ]
}).error ?? 'valid')





console.log('Context validation:', RootLocationContext.validate({
  _type: "RootLocationContext",
  id: 'test'
}).error ?? 'valid')

