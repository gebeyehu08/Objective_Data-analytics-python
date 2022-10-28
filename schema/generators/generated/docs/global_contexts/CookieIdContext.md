# CookieIdContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing information needed to reconstruct a user session.

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
cookie_id: `string` - Unique identifier from the session cookie.

:::info setting of properties
The collector will automatically set all the properties and assign a `cookie_id`.
:::
