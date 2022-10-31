---
slug: /taxonomy/global-contexts/
---

# AbstractGlobalContext

[Global Contexts](/taxonomy/reference/global-contexts/overview.md) capture general data about the state in which an [Event](/taxonomy/reference/events/overview.md) happened, such as a user's [identity](/taxonomy/reference/global-contexts/IdentityContext.md) & [marketing information](/taxonomy/reference/global-contexts/MarketingContext.md).

import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
      AbstractContext["AbstractContext<span class='properties'>id: string<br /></span>"] -->       AbstractGlobalContext;
      AbstractGlobalContext --> ApplicationContext;
      AbstractGlobalContext --> CookieIdContext["CookieIdContext<span class='properties'>cookie_id: string<br /></span>"];
      AbstractGlobalContext --> HttpContext["HttpContext<span class='properties'>referrer: string<br />user_agent: string<br />remote_address?: string<br /></span>"];
      AbstractGlobalContext --> IdentityContext["IdentityContext<span class='properties'>value: string<br /></span>"];
      AbstractGlobalContext --> InputValueContext["InputValueContext<span class='properties'>value: string<br /></span>"];
      AbstractGlobalContext --> LocaleContext["LocaleContext<span class='properties'>language_code?: string<br />country_code?: string<br /></span>"];
      AbstractGlobalContext --> MarketingContext["MarketingContext<span class='properties'>source: string<br />medium: string<br />campaign: string<br />term?: string<br />content?: string<br />source_platform?: string<br />creative_format?: string<br />marketing_tactic?: string<br /></span>"];
      AbstractGlobalContext --> PathContext;
      AbstractGlobalContext --> SessionContext["SessionContext<span class='properties'>hit_number: integer<br /></span>"];
    class AbstractGlobalContext diagramActive
  `}
  caption="Diagram: AbstractGlobalContext inheritance"
  baseColor="blue"
  links={[
{ name: 'ApplicationContext', to: '/taxonomy/reference/global-contexts/ApplicationContext' }, { name: 'CookieIdContext', to: '/taxonomy/reference/global-contexts/CookieIdContext' }, { name: 'HttpContext', to: '/taxonomy/reference/global-contexts/HttpContext' }, { name: 'IdentityContext', to: '/taxonomy/reference/global-contexts/IdentityContext' }, { name: 'InputValueContext', to: '/taxonomy/reference/global-contexts/InputValueContext' }, { name: 'LocaleContext', to: '/taxonomy/reference/global-contexts/LocaleContext' }, { name: 'MarketingContext', to: '/taxonomy/reference/global-contexts/MarketingContext' }, { name: 'PathContext', to: '/taxonomy/reference/global-contexts/PathContext' }, { name: 'SessionContext', to: '/taxonomy/reference/global-contexts/SessionContext' },   ]}
/>

### Inherited Properties

|        | type   | description                                                                                                |
|:-------|:-------|:-----------------------------------------------------------------------------------------------------------|
| **id** | string | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |


