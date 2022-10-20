# SessionContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the current session.

### Parent
AbstractGlobalContext

### All Parents
AbstractContext > AbstractGlobalContext

### Own Properties
`integer` hit_number: Hit counter relative to the current session, this event originated in.

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`integer` hit_number: Hit counter relative to the current session, this event originated in.

:::info setting of properties
The tracker will automatically set all the properties and assign a `hit_number`.
:::
