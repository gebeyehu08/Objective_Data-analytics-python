# Objectiv Snowplow Transport for Web

Allows sending events directly via Snowplow's JavaScript Tracker without the need of the Objectiv Collector. 

---
## Package Installation
To install the most recent stable version:

```sh
yarn add @objectiv/transport-snowplow
```

### or
```sh
npm install @objectiv/transport-snowplow
```

# Usage
To enable SnowplowTransport, and stop using Objectiv's Collector, simply:
1. Remove the Objectiv's Collector `endpoint` configuration option. 
2. Add the `transport` configuration option, set to a new instance of `SnowplowTransport`.

### Browser SDK example
```ts
import { makeTracker } from "@objectiv/tracker-browser";
import { SnowplowTransport } from "@objectiv/transport-snowplow";

makeTracker({
  applicationId: 'app-id',
  transport: new SnowplowTransport()
});
```

### React SDK example
```ts
import { ReactTracker } from '@objectiv/tracker-react';
import { SnowplowTransport } from "@objectiv/transport-snowplow";

const tracker = new ReactTracker({
  applicationId: 'app-id',
  transport: new SnowplowTransport()
})
```

### Angular SDK example
```ts
import { ObjectivTrackerModule } from '@objectiv/tracker-angular';
import { SnowplowTransport } from "@objectiv/transport-snowplow";

...

@NgModule({
  ...
  imports: [
    ...
    ObjectivTrackerModule.forRoot({
      applicationId: 'app-id',
      transport: new SnowplowTransport()
    })
  ],
  ...
})

export class AppModule {
  ...
}
```


# Copyright and license
Licensed and distributed under the Apache 2.0 License (An OSI Approved License).

Copyright (c) 2022 Objectiv B.V.

All rights reserved.
