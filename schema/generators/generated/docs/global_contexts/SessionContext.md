# SessionContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) describing meta information about the current session.

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
hit_number: `integer` - Hit counter relative to the current session, this event originated in.

:::info setting of properties
The tracker will automatically set all the properties and assign a `hit_number`.
:::
