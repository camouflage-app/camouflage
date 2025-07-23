# HTTP Configuration

When using the **HTTP mocking server** (`@camouflage/http`), your config file controls:

- **Server modes**
- **Logging**
- **CORS & caching**
- **Request validation**
- **File watching in development mode**

Here’s a breakdown:

## Server Modes

You can enable **one or more protocols**:

- **http** → standard HTTP 1.1 server
- **https** → HTTP over TLS
- **http2** → HTTP/2

Each mode has its own port, and **ports must not overlap**.

```json
"http": {
  "enable": true,
  "port": 3000
},
"https": {
  "enable": false,
  "port": 3443
},
"http2": {
  "enable": false,
  "port": 4000
}
```

> [!TIP]
> If you enable multiple servers HTTP & HTTPS, they all must use **different ports**.

#### ✅ Logging

Camouflage uses Bunyan for structured logs.

```json
"log": {
  "enable": true,
  "level": "info",
  "disableRequestLogs": false
}
```

- `enable` → enables or disables the logs entirely
- `level` → if enable=true, sets the log level. Available options are `trace`, `debug`, `info`, `warn`, `error`, `fatal`
- `disableRequestLogs` → if not disabled, each incoming request will be logged.

## CORS, Caching, Compression & Validation

- **CORS**

  ```json
  "enableCors": true
  ```

  Enables CORS middleware (default: allow all).

- **Caching**

  ```json
  "cache": {
    "enable": true,
    "timeInSeconds": 60
  }
  ```

  Adds a memory cache layer for repeated responses.

- **Compression**

```json
"compression": true
```

- **OpenAPI Validation**

  ```json
  "validation": {
    "enable": true,
    "apiSpec": "./openapi.yaml",
    "validateRequests": true,
    "validateResponses": false
  }
  ```

  Automatically validate incoming requests & responses against an OpenAPI spec.

> [!TIP]
> While you can configure a basic setup for each of these features using the `config.json`, Camouflage allows you a full control over the underlying packages and how to configure them. Refer to [Advanced Configuration](/configuration/advanced) for more details.

## File Watching (Development Mode)

When `mode` is `development`, Camouflage **watches your `mocksDir`** and auto-restarts when mock files change.

```json
"mode": "development"
```

In `production`, file watching is disabled for performance.

## Mocks Directory

You can specify the location of the folder that contains the necessary files/folder structure to define your mock APIs using the `mocksDir` option.

```json
"mocksDir": "./mocks"
```

## Example Full Config

```json
{
  "log": {
    "enable": true, // enables or disables the logs entirely
    "level": "trace", // if enable=true, sets the log level. Available options are "fatal", "error", "warn", "info", "debug", "trace"
    "disableRequestLogs": true // if not disabled, each incoming request will be logged.
  },
  "http": {
    "enable": true, // enables or disables http server
    "port": 8080 // port on which http server would be available
  },
  "https": {
    "enable": false, // enables or disables https server
    "port": 8443 // port on which https server would be available
  },
  "http2": {
    "enable": false, // enables or disables http2 server
    "port": 9443 // port on which http2 server would be available
  },
  "monitoring": true, // if enabled, provides a /monitoring endpoint with some dashboards for monitoring
  "cache": {
    "enable": true, // enables or disables cache
    "timeInSeconds": 5 // if enabled, sets cache ttl to 5 seconds
  },
  "enableCors": true, // enables or disables cors
  "mocksDir": "./mocks" // location of the directory where your mocks live.
}
```
