# Advanced Camouflage Configuration

## Server Configuration

- `setServerOptionsHttp(options: http.ServerOptions): void`

  Depending on your use case, you might want to set additional options. Use setServerOptionsHttp to pass those options to Camouflage server. Read more about the available options in the official [documentation](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener)

- `setServerOptionsHttps(options: https.ServerOptions): void`

  In case you are creating an https server, you would need to use setServerOptionsHttps to provide the necessary credentials. You can use it to add other [available options](https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener) as well to your https servers.

- `setServerOptionsHttp2(options: spdy.server.ServerOptions): void`

  In case you are creating an http2 server, you would need to use setServerOptionsHttp2 to provide the necessary credentials. You can use it to add other [available options](https://www.npmjs.com/package/spdy#options) as well to your http2 servers.

## CORS Configuration

Camouflage uses `cors` middleware to configure cors for your mocks. By default, cors is enabled for all origins and methods, however you can control this by providing Camouflage a corsOptions before you start the server.

```ts
import type cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,POST",
};
camouflageHttp.setupCorsWithOptions(corsOptions);
camouflageHttp.start();
```

Read more about available options on [cors documentation](https://www.npmjs.com/package/cors#configuration-options).

## Cache Configuration

Camouflage HTTP uses, `apicache` to configure a cache middleware for your mocks. By default, the cache is saved in memory and you can provide a ttl in seconds via config. However in case you want more control over the options, you can fine tune the settings using `setupCacheWithOptions`.

Following example shows how you can cache with redis instead of in memory.

Install Redis

```bash
npm i redis
```

Configure cache with redis

```ts
import redis from "redis";
import type apicache from "apicache";

let cacheOptions = {
  redisClient: redis.createClient(),
  respectCacheControl: true,
  statusCodes: {
    exclude: [401, 403, 404],
    include: [200],
  },
  // more options
};

camouflageHttp.setupCacheWithOptions(cacheOptions);
camouflageHttp.start();
```

You can refer to [apicache documentation](https://www.npmjs.com/package/apicache) for more details on the available options and how to configure them.

## Open API Validation

You can use `camouflage.setupValidationWithOptions(opts)` to configure validations using an Open API 3 specification. Camouflage uses `express-openapi-validator` to enable you to validate your requests/responses against a provided OpenAPI 3 schema.
Read more on the usage in the [express-openapi-validator documentation](https://cdimascio.github.io/express-openapi-validator-documentation/).

Enable it via config

```json
{
  // Other Camouflage options
  "validation": {
    "enable": true
  }
}
```

And then configure rest of the options as you wish

```ts
camouflageHttp.setupValidationWithOptions({
  apiSpec: "./openapi.yaml",
  validateRequests: true,
  validateResponses: true,
  // Other options
});
```

## Compression

You can optionally enable the compression options via `config.json`. Once enabled, compression is applied on all the routes, however you can restrict this behaviour using the `setupCompressionWithOptions` method and [available options](https://www.npmjs.com/package/compression#options)

Enable compression in `config.json`

```json
{
  // Other Camouflage options
  "compression": true
}
```

Then provide required options

```ts
function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
camouflageHttp.setupCompressionWithOptions({ filter: shouldCompress });
```
