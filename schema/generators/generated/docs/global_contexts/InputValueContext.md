# InputValueContext
A [GlobalContext](/taxonomy/reference/global-contexts/overview.md) containing the value of a single input element. Multiple InputValueContexts may be present in Global Contexts at the same time.

### Properties
`string` value: The value of the input element.
`array` _types: An ordered list of the parents of this Context, itself included as the last element.
`string` id: A unique string identifier to be combined with the Context Type (`_type`) 
for Context instance uniqueness.
`discriminator` _type: A string literal used during serialization. Should always match the Context interface name.

:::info setting of properties
The tracker will automatically set all properties when using Tracked Components or Taggers. On manual creation `id` and `value` must be provided.
:::
