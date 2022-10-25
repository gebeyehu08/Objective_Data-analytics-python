'use strict';
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.makeContext =
  exports.makeSessionContext =
  exports.makeRootLocationContext =
  exports.makePressableContext =
  exports.makePathContext =
  exports.makeOverlayContext =
  exports.makeNavigationContext =
  exports.makeMediaPlayerContext =
  exports.makeMarketingContext =
  exports.makeLocaleContext =
  exports.makeLinkContext =
  exports.makeInputValueContext =
  exports.makeInputContext =
  exports.makeIdentityContext =
  exports.makeHttpContext =
  exports.makeExpandableContext =
  exports.makeCookieIdContext =
  exports.makeContentContext =
  exports.makeApplicationContext =
    void 0;
const schema_1 = require('@objectiv/schema');
const ContextNames_1 = require('./ContextNames');
const helpers_1 = require('../helpers');
exports.makeApplicationContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __global_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractGlobalContext,
    ContextNames_1.GlobalContextName.ApplicationContext,
  ],
  id: props.id,
  _type: ContextNames_1.GlobalContextName.ApplicationContext,
});
exports.makeContentContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.ContentContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.ContentContext,
});
exports.makeCookieIdContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __global_context: true,
  cookie_id: props.cookie_id,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractGlobalContext,
    ContextNames_1.GlobalContextName.CookieIdContext,
  ],
  id: props.id,
  _type: ContextNames_1.GlobalContextName.CookieIdContext,
});
exports.makeExpandableContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.ExpandableContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.ExpandableContext,
});
exports.makeHttpContext = (props) => {
  var _a;
  return {
    __instance_id: helpers_1.generateGUID(),
    __global_context: true,
    referrer: props.referrer,
    user_agent: props.user_agent,
    remote_address: (_a = props.remote_address) !== null && _a !== void 0 ? _a : null,
    _types: [
      ContextNames_1.AbstractContextName.AbstractContext,
      ContextNames_1.AbstractContextName.AbstractGlobalContext,
      ContextNames_1.GlobalContextName.HttpContext,
    ],
    id: props.id,
    _type: ContextNames_1.GlobalContextName.HttpContext,
  };
};
exports.makeIdentityContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __global_context: true,
  value: props.value,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractGlobalContext,
    ContextNames_1.GlobalContextName.IdentityContext,
  ],
  id: props.id,
  _type: ContextNames_1.GlobalContextName.IdentityContext,
});
exports.makeInputContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.InputContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.InputContext,
});
exports.makeInputValueContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __global_context: true,
  value: props.value,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractGlobalContext,
    ContextNames_1.GlobalContextName.InputValueContext,
  ],
  id: props.id,
  _type: ContextNames_1.GlobalContextName.InputValueContext,
});
exports.makeLinkContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __pressable_context: true,
  __location_context: true,
  href: props.href,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.PressableContext,
    ContextNames_1.LocationContextName.LinkContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.LinkContext,
});
exports.makeLocaleContext = (props) => {
  var _a, _b;
  return {
    __instance_id: helpers_1.generateGUID(),
    __global_context: true,
    language_code: (_a = props.language_code) !== null && _a !== void 0 ? _a : null,
    country_code: (_b = props.country_code) !== null && _b !== void 0 ? _b : null,
    _types: [
      ContextNames_1.AbstractContextName.AbstractContext,
      ContextNames_1.AbstractContextName.AbstractGlobalContext,
      ContextNames_1.GlobalContextName.LocaleContext,
    ],
    id: props.id,
    _type: ContextNames_1.GlobalContextName.LocaleContext,
  };
};
exports.makeMarketingContext = (props) => {
  var _a, _b, _c, _d, _e;
  return {
    __instance_id: helpers_1.generateGUID(),
    __global_context: true,
    source: props.source,
    medium: props.medium,
    campaign: props.campaign,
    term: (_a = props.term) !== null && _a !== void 0 ? _a : null,
    content: (_b = props.content) !== null && _b !== void 0 ? _b : null,
    source_platform: (_c = props.source_platform) !== null && _c !== void 0 ? _c : null,
    creative_format: (_d = props.creative_format) !== null && _d !== void 0 ? _d : null,
    marketing_tactic: (_e = props.marketing_tactic) !== null && _e !== void 0 ? _e : null,
    _types: [
      ContextNames_1.AbstractContextName.AbstractContext,
      ContextNames_1.AbstractContextName.AbstractGlobalContext,
      ContextNames_1.GlobalContextName.MarketingContext,
    ],
    id: props.id,
    _type: ContextNames_1.GlobalContextName.MarketingContext,
  };
};
exports.makeMediaPlayerContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.MediaPlayerContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.MediaPlayerContext,
});
exports.makeNavigationContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.NavigationContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.NavigationContext,
});
exports.makeOverlayContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.OverlayContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.OverlayContext,
});
exports.makePathContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __global_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractGlobalContext,
    ContextNames_1.GlobalContextName.PathContext,
  ],
  id: props.id,
  _type: ContextNames_1.GlobalContextName.PathContext,
});
exports.makePressableContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __pressable_context: true,
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.PressableContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.PressableContext,
});
exports.makeRootLocationContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __location_context: true,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractLocationContext,
    ContextNames_1.LocationContextName.RootLocationContext,
  ],
  id: props.id,
  _type: ContextNames_1.LocationContextName.RootLocationContext,
});
exports.makeSessionContext = (props) => ({
  __instance_id: helpers_1.generateGUID(),
  __global_context: true,
  hit_number: props.hit_number,
  _types: [
    ContextNames_1.AbstractContextName.AbstractContext,
    ContextNames_1.AbstractContextName.AbstractGlobalContext,
    ContextNames_1.GlobalContextName.SessionContext,
  ],
  id: props.id,
  _type: ContextNames_1.GlobalContextName.SessionContext,
});
function makeContext(_a) {
  var { _type } = _a,
    contextProps = __rest(_a, ['_type']);
  switch (_type) {
    case schema_1.ApplicationContext:
      return exports.makeApplicationContext(contextProps);
    case schema_1.ContentContext:
      return exports.makeContentContext(contextProps);
    case schema_1.CookieIdContext:
      return exports.makeCookieIdContext(contextProps);
    case schema_1.ExpandableContext:
      return exports.makeExpandableContext(contextProps);
    case schema_1.HttpContext:
      return exports.makeHttpContext(contextProps);
    case schema_1.IdentityContext:
      return exports.makeIdentityContext(contextProps);
    case schema_1.InputContext:
      return exports.makeInputContext(contextProps);
    case schema_1.InputValueContext:
      return exports.makeInputValueContext(contextProps);
    case schema_1.LinkContext:
      return exports.makeLinkContext(contextProps);
    case schema_1.LocaleContext:
      return exports.makeLocaleContext(contextProps);
    case schema_1.MarketingContext:
      return exports.makeMarketingContext(contextProps);
    case schema_1.MediaPlayerContext:
      return exports.makeMediaPlayerContext(contextProps);
    case schema_1.NavigationContext:
      return exports.makeNavigationContext(contextProps);
    case schema_1.OverlayContext:
      return exports.makeOverlayContext(contextProps);
    case schema_1.PathContext:
      return exports.makePathContext(contextProps);
    case schema_1.PressableContext:
      return exports.makePressableContext(contextProps);
    case schema_1.RootLocationContext:
      return exports.makeRootLocationContext(contextProps);
    case schema_1.SessionContext:
      return exports.makeSessionContext(contextProps);
  }
}
exports.makeContext = makeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dEZhY3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnRleHRGYWN0b3JpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFJQSw2Q0FtQjBCO0FBQzFCLGlEQUE2RjtBQUM3Rix3Q0FBMEM7QUFLN0IsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLEtBRXRDLEVBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLGFBQWEsRUFBRSxzQkFBWSxFQUFFO0lBQzdCLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsTUFBTSxFQUFFO1FBQ04sa0NBQW1CLENBQUMsZUFBZTtRQUNuQyxrQ0FBbUIsQ0FBQyxxQkFBcUI7UUFDekMsZ0NBQWlCLENBQUMsa0JBQWtCO0tBQ3JDO0lBQ0QsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO0lBQ1osS0FBSyxFQUFFLGdDQUFpQixDQUFDLGtCQUFrQjtDQUM1QyxDQUFDLENBQUM7QUFNVSxRQUFBLGtCQUFrQixHQUFHLENBQUMsS0FFbEMsRUFBa0IsRUFBRSxDQUFDLENBQUM7SUFDckIsYUFBYSxFQUFFLHNCQUFZLEVBQUU7SUFDN0Isa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixNQUFNLEVBQUU7UUFDTixrQ0FBbUIsQ0FBQyxlQUFlO1FBQ25DLGtDQUFtQixDQUFDLHVCQUF1QjtRQUMzQyxrQ0FBbUIsQ0FBQyxjQUFjO0tBQ25DO0lBQ0QsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO0lBQ1osS0FBSyxFQUFFLGtDQUFtQixDQUFDLGNBQWM7Q0FDMUMsQ0FBQyxDQUFDO0FBS1UsUUFBQSxtQkFBbUIsR0FBRyxDQUFDLEtBR25DLEVBQW1CLEVBQUUsQ0FBQyxDQUFDO0lBQ3RCLGFBQWEsRUFBRSxzQkFBWSxFQUFFO0lBQzdCLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO0lBQzFCLE1BQU0sRUFBRTtRQUNOLGtDQUFtQixDQUFDLGVBQWU7UUFDbkMs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
