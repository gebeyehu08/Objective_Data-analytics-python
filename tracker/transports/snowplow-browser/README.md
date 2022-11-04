# Objectiv Snowplow Browser Tracker Transport

Allows sending events directly via Snowplow's Browser Tracker without the need of the Objectiv Collector. 

---
## Package Installation
To install the most recent stable version:

```sh
yarn add @objectiv/transport-snowplow-browser
```

### or
```sh
npm install @objectiv/transport-snowplow-browser
```

# Usage
To enable SnowplowBrowserTransport, and stop using Objectiv's Collector, simply:
1. Remove the Objectiv's Collector `endpoint` configuration option. 
2. Add the `transport` configuration option, set to a new instance of `SnowplowBrowserTransport`.

### Browser SDK example
```ts
import { makeTracker } from "@objectiv/tracker-browser";
import { SnowplowBrowserTransport } from "@objectiv/transport-snowplow-browser";

makeTracker({
  applicationId: 'app-id',
  transport: new SnowplowBrowserTransport()
});
```

### React SDK example
```ts
import { ReactTracker } from '@objectiv/tracker-react';
import { SnowplowBrowserTransport } from "@objectiv/transport-snowplow-browser";

const tracker = new ReactTracker({
  applicationId: 'app-id',
  transport: new SnowplowBrowserTransport()
})
```

### Angular SDK example
```ts
import { ObjectivTrackerModule } from '@objectiv/tracker-angular';
import { SnowplowBrowserTransport } from "@objectiv/transport-snowplow-browser";

...

@NgModule({
  ...
  imports: [
    ...
    ObjectivTrackerModule.forRoot({
      applicationId: 'app-id',
      transport: new SnowplowBrowserTransport()
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
