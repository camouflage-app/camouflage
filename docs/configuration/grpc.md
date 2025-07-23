# gRPC Configuration

When using the **gRPC mocking server** (`@camouflage/grpc`), the config controls:

- **Host & port**
- **SSL/TLS credentials**
- **Monitoring & Prometheus metrics**

## Basic gRPC Config

```json
"host": "0.0.0.0",
"port": 50051
```

This tells Camouflage where to bind the gRPC server.

## SSL Setup

Camouflage supports both **insecure** and **SSL-enabled** gRPC servers.

```json
"ssl": {
  "enable": true,
  "cert": "./certs/server.crt",
  "key": "./certs/server.key",
  "rootCert": "./certs/ca.crt"
}
```

- If `enable=false`, it starts an **insecure** gRPC server.
- If `enable=true`, you **must** provide `cert` and `key`.
- `rootCert` is optional; if provided, Camouflage enforces **client authentication**.

## Monitoring & Prometheus Metrics

Camouflage can expose **Prometheus-compatible metrics** (like request latency, error codes, etc.) on a separate HTTP endpoint.

```json
"monitoring": {
  "enable": true,
  "port": 9100
}
```

- Metrics are available at `http://localhost:9100/metrics`
- `monitoring.port` **must not** equal `grpc.port`

## Full Example Config

```json
{
  "log": {
    "enable": true, // enables or disables the logs
    "level": "trace" // // if enable=true, sets the log level. Available options are "fatal", "error", "warn", "info", "debug", "trace"
  },
  "host": "0.0.0.0", // host part of the address on which you'd want grpc server to listen on
  "port": 8082, // port part of the address on which you'd want grpc server to listen on
  "ssl": {
    "enable": false, // enables or disabled ssl, if disabled credentials will be created using grpc.ServerCredentials.createInsecure()
    "cert": "location/to/server.cert", // if enable=true, required config for .cert file
    "key": "location/to/server/key", // if enable=true, required config for .key file
    "rootCert": "location/to/rootCert" // Optionally, provide location to root cert
  },
  "mocksDir": "./grpcMocks", // location of the mocks folder
  "monitoring": {
    "enable": true, // enables or disables monitoring
    "port": 40000 // required port for monitoring server
  }
}
```
