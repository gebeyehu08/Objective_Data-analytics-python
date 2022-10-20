# InputValueContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) containing the value of a single input element. Multiple InputValueContexts may be present in Global Contexts at the same time.

### Parent
AbstractGlobalContext

### All Parents
AbstractContext > AbstractGlobalContext

### Own Properties
`string` value: The value of the input element.

### Inherited Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.

### All Properties
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`string` value: The value of the input element.

:::info setting of properties
The tracker will automatically set all properties when using Tracked Components or Taggers. On manual creation `id` and `value` must be provided.
:::
