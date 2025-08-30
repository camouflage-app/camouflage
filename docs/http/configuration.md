---
layout: doc
aside: false
---

# HTTP - Configuration

Camouflage allows you to control various aspects of your server using two ways:

- For basic configuration, you can control your server using the `config.json` file.
- For a more advanced configuration, you can use several methods available in `CamouflageHttp` class.

Let's go over each of them in detail.

## Using `config.json`

In the quick start section, we used a very minimal configuration to get up and running quickly. However there are more options you can configure using json config. Following json includes all the available configurations:

```json
{
  "mode": "development",
  "log": {
    "enable": true,
    "level": "trace",
    "disableRequestLogs": true
  },
  "http": {
    "enable": true,
    "port": 8080
  },
  "https": {
    "enable": false,
    "port": 8443
  },
  "http2": {
    "enable": false,
    "port": 9443
  },
  "monitoring": true,
  "cache": {
    "enable": true,
    "timeInSeconds": 5
  },
  "validation": {
    "enable": true,
    "apiSpec": "./apiSpec.yaml",
    "validateRequests": true,
    "validateResponses": true
  },
  "compression": false,
  "enableCors": true,
  "mocksDir": "./mocks"
}
```

### Configuration Details

| config | values | description | required |
| :--- | :--- | :--- | :--- |
| `mode` | `development`,`production` | When using "development" mode, hot reload is available. To disable it, use mode: "production". | Yes |
| `log.enable` | `true`,`false` | Enable or disable logs. | Yes |
| `log.level` | `trace`, `debug`, `info`, `warn`, `error`, `fatal` | Sets the required log level as supported by `bunyan` logger logs. | Required if `log.enable` is `true` |
| `log.disableRequestLogs` | `true`, `false` | Disables the request logging middleware | No |
| `http.enable` | `true`, `false` | Enables or disables http server | No |
| `http.port` | number (eg: 8080) | Port on which http server would be available | No |
| `https.enable` | `true`, `false` | Enables or disables https server | No |
| `https.port` | number (eg: 8443) | Port on which https server would be available | No |
| `http2.enable` | `true`, `false` | Enables or disables http2 server | No |
| `http2.port` | number (eg: 9443) | Port on which http2 server would be available | No |
| `monitoring` | `true`, `false` | if enabled, provides a /monitoring endpoint with some dashboards for monitoring | No |
| `cache.enable` | `true`, `false` | Enables or disables cache | No |
| `cache.timeInSeconds` | number | If cache is enabled, sets cache ttl to specified seconds | No |
| `enableCors` | `true`/`false` | Enables or disables cors | No |
| `validation.enable` | `true`/`false` | Enables or disables validation | No |
| `validation.apiSpec` | string | Specifies the path to an OpenAPI 3 specification or a JSON object representing the OpenAPI 3 specification | No |
| `validation.validateRequests` | `true`/`false` | Determines whether the validator should validate requests. | No |
| `validation.validateResponses` | `true`/`false` | Determines whether the validator should validate responses | No |
| `compression` | `true`/`false` | Enables or disables compression | No |
| `mocksDir` | string | Location of the directory where your mocks live. | Yes |

## Advanced Configuration

While most configurations that you would ideally need to run a camouflage server can be controlled via the json config, sometimes you'd need a more granular control over the configuration and need access to the underlying middlewares or servers.

Camouflage allows such configuration via several methods on the `CamouflageHttp` class.

### _setServerOptionsHttp(options: http.ServerOptions): void_

Depending on your use case, you might want to set additional options. Use `setServerOptionsHttp` to pass those options to Camouflage server. Read more about the available options in the official [documentation](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener)

### _setServerOptionsHttps(options: https.ServerOptions): void_

In case you are creating an https server, you would need to use `setServerOptionsHttps` to provide the necessary credentials. You can use it to add other [available options](https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener) as well to your https servers.

### _setServerOptionsHttp2(options: spdy.server.ServerOptions): void_

In case you are creating an http2 server, you would need to use `setServerOptionsHttp2` to provide the necessary credentials. You can use it to add other [available options](https://www.npmjs.com/package/spdy#options) as well to your http2 servers.

### _setupCacheWithOptions(options: apicache.Options): void_

Camouflage HTTP uses, `apicache` to configure a cache middleware for your mocks. By default, the cache is saved in memory and you can provide a ttl in seconds via config. However in case you want more control over the options, you can fine tune the settings using `setupCacheWithOptions`.

Following example shows how you can cache with redis instead of in memory.

```bash
npm i redis
```

```js
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

You can refer to [apicache documentation](https://www.npmjs.com/package/apicache#available-options-first-value-is-default) for more details on the available options and how to configure them.

### _setupCorsWithOptions(corsOptions: cors.CorsOptions): void_

Camouflage uses `cors` middleware to configure cors for your mocks. By default, cors is enabled for all origins and methods, however you can control this by providing Camouflage a corsOptions before you start the server.

```js
import type cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3000", "http://instrukti.com/"],
  methods: "GET,POST",
};
camouflageHttp.setupCorsWithOptions(corsOptions);
camouflageHttp.start();
```

Read more about available options on [cors documentation](https://www.npmjs.com/package/cors#configuration-options).

### _setupValidationWithOptions = (validationOpts: OpenApiValidatorOpts): void_

Allows you to setup validations using an Open API 3 specification. Read more on the usage in the [OpenAPI Validation](/http/validation) section.

### _setupCompressionWithOptions = (compressionOpts: CompressionOptions): void_

Allows you to setup [compression options](https://www.npmjs.com/package/compression#options) provided by `compression` middleware. Read more on usage in the [compression](/http/compression) section.

> [!NOTE]
> There are more available methods exposed by `CamouflageHttp` which aren't related to configuration. Read more on the [next page](/http/available-methods).

## Configuration via `CamouflageHttp` Options

Alternatively, you can initialize your `CamouflageHttp` class by passing the required options. While doing so, you don't need to use `loadConfigFromJson` and use a `config.json` file. This is helpful in case you want to programmatically control your configuration options.

Options you can pass are:

- **config?: CamouflageHttpConfig**
- **httpOptions?: http.ServerOptions**
- **httpsOptions?: https.ServerOptions**
- **cacheOptions?: apicache.Options**
- **corsOptions?: cors.CorsOptions | cors.CorsOptionsDelegate<Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>>**
