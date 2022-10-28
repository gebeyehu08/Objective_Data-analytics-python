# HttpContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the agent that sent the event.

### Parent
AbstractGlobalContext

### All Parents
AbstractContext > AbstractGlobalContext

### Inherited Properties
id: `string` - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### Properties
id: `string` [inherited] - A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
referrer: `string` - Full URL to HTTP referrer of the current page.
user_agent: `string` - User-agent of the agent that sent the event.
remote_address: `string` [nullable] - (public) IP address of the agent that sent the event.

:::info setting of properties
The tracker will automatically set the `_type`, `referrer` and `user_agent` properties, while the collector will automatically set the `remote_address`.
:::
