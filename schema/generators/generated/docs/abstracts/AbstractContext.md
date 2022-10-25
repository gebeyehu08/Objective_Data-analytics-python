# AbstractContext



import Mermaid from '@theme/Mermaid'

<Mermaid chart={`
    graph LR
            AbstractContext["AbstractContext<span class='properties'>_types: array<br />id: string<br />_type: discriminator<br /></span>"];
      AbstractContext --> AbstractGlobalContext;
      AbstractContext --> AbstractLocationContext;
      AbstractGlobalContext --> ApplicationContext;
      AbstractGlobalContext --> CookieIdContext["CookieIdContext<span class='properties'>cookie_id: string<br /></span>"];
      AbstractGlobalContext --> HttpContext["HttpContext<span class='properties'>referrer: string<br />user_agent: string<br />remote_address?: string<br /></span>"];
      AbstractGlobalContext --> IdentityContext["IdentityContext<span class='properties'>value: string<br /></span>"];
      AbstractGlobalContext --> InputValueContext["InputValueContext<span class='properties'>value: string<br /></span>"];
      AbstractGlobalContext --> LocaleContext["LocaleContext<span class='properties'>language_code?: string<br />country_code?: string<br /></span>"];
      AbstractGlobalContext --> MarketingContext["MarketingContext<span class='properties'>source: string<br />medium: string<br />campaign: string<br />term?: string<br />content?: string<br />source_platform?: string<br />creative_format?: string<br />marketing_tactic?: string<br /></span>"];
      AbstractGlobalContext --> PathContext;
      AbstractGlobalContext --> SessionContext["SessionContext<span class='properties'>hit_number: integer<br /></span>"];
      AbstractLocationContext --> ContentContext;
      AbstractLocationContext --> ExpandableContext;
      AbstractLocationContext --> InputContext;
      AbstractLocationContext --> MediaPlayerContext;
      AbstractLocationContext --> NavigationContext;
      AbstractLocationContext --> OverlayContext;
      AbstractLocationContext --> PressableContext;
      AbstractLocationContext --> RootLocationContext;
      PressableContext --> LinkContext["LinkContext<span class='properties'>href: string<br /></span>"];
    class AbstractContext diagramActive
  `}
  caption="Diagram: AbstractContext inheritance"
  baseColor="blue"
  links={[
{ name: 'AbstractGlobalContext', to: '/taxonomy/reference/abstracts/AbstractGlobalContext' },{ name: 'AbstractLocationContext', to: '/taxonomy/reference/abstracts/AbstractLocationContext' },{ name: 'ApplicationContext', to: '/taxonomy/reference/ApplicationContext' },{ name: 'CookieIdContext', to: '/taxonomy/reference/CookieIdContext' },{ name: 'HttpContext', to: '/taxonomy/reference/HttpContext' },{ name: 'IdentityContext', to: '/taxonomy/reference/IdentityContext' },{ name: 'InputValueContext', to: '/taxonomy/reference/InputValueContext' },{ name: 'LocaleContext', to: '/taxonomy/reference/LocaleContext' },{ name: 'MarketingContext', to: '/taxonomy/reference/MarketingContext' },{ name: 'PathContext', to: '/taxonomy/reference/PathContext' },{ name: 'SessionContext', to: '/taxonomy/reference/SessionContext' },{ name: 'ContentContext', to: '/taxonomy/reference/ContentContext' },{ name: 'ExpandableContext', to: '/taxonomy/reference/ExpandableContext' },{ name: 'InputContext', to: '/taxonomy/reference/InputContext' },{ name: 'MediaPlayerContext', to: '/taxonomy/reference/MediaPlayerContext' },{ name: 'NavigationContext', to: '/taxonomy/reference/NavigationContext' },{ name: 'OverlayContext', to: '/taxonomy/reference/OverlayContext' },{ name: 'PressableContext', to: '/taxonomy/reference/PressableContext' },{ name: 'RootLocationContext', to: '/taxonomy/reference/RootLocationContext' },{ name: 'LinkContext', to: '/taxonomy/reference/LinkContext' },  ]}
/>

### Properties

|             | type          | description                                                                                                | contains                          |
|:------------|:--------------|:-----------------------------------------------------------------------------------------------------------|:----------------------------------|
| **\_types** | array         | An ordered list of the parents of this Context, itself included as the last element.                       | string                            |
| **id**      | string        | A unique string identifier to be combined with the Context Type (`_type`) for Context instance uniqueness. |                                   |
| **\_type**  | discriminator | A string literal used during serialization. Hardcoded to the Context name.                                 | ContextTypes.enum.AbstractContext |
### Inherited Properties

|  | type | description | contains |
|:-|:-----|:------------|:---------|


