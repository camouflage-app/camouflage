---
layout: doc
aside: false
---
# What is Camouflage?

## Introduction

**Camouflage** is a powerful and flexible **API mocking library** that helps developers simulate HTTP and gRPC services with ease. It is designed for:

- **Developers** who want to quickly test frontend or backend integrations without relying on real services.
- **QA & Automation** teams who need stable, predictable mock responses for automated testing.
- **CI/CD pipelines** where real services may not always be available.

Camouflage works on a file based endpoint configuration system, which means it allows you to create a mock endpoint by simply creating a set of directories and a mock file, using which necessary responses are generated when you call the endpoint.

> [!WARNING]
> GRPC Mocking is currently in beta and might have breaking changes

## Why Camouflage?

Most tools at the moment, require you to remember a rigid JSON schema to be able to create/manage your mocks. If not, they come with complex GUIs and some tool specific terminologies. All of this feels like an overkill for a simple mock server. Let's face it, no one wants to "learn" how to create mocks. It just something we have to do so that we can focus on what we actually want to do, which is building frontends or independent microservices even if everything isn't ready yet.

Camouflage allows you to create mocks in seconds, no learning curve, no JSON schema, no specific terminologies. Just copy and paste your expected response in a mock file, and you're good to go. And of course, if you want to enhance the mocks, Camouflage provides you intuitive ways to do that. You can use templates and helpers in your mock files, you can tap into the relevant hooks and modify the request/response or you can code your own router as you would in express.js. Technically, you could build a fully functional backend connected to a database using Camouflage.

_**We wouldn't recommend doing so! Just saying you could...if you don't want to live by the rules and enjoy chaos.**_

## Key Features

- **Supports multiple protocols**: HTTP (REST), gRPC (unary & streaming)
- **File-based routing**: No extra configuration needed – your folder structure becomes your API routes
- **Dynamic templating with Handlebars**: Generate responses with fake data, randomization, conditionals, etc.
- **Rich built-in helpers**: `faker`, `now`, `csv`, `random`, and more
- **Lifecycle hooks**: Customize behavior with `onRequest`, `beforeResponse`, `afterResponse`
- **Response simulation**: Add delays, headers, metadata, random responses
- **Middleware support**: CORS, caching, compression, OpenAPI validation
- **Monitoring & Metrics**: Swagger stats and Prometheus
- **Development-friendly**: Hot-reload when mock files change

With Camouflage, you can mock everything from a simple REST endpoint to complex gRPC bidirectional streams, all with minimal setup.

## Prerequisites

Before installing and running Camouflage, make sure your environment meets the following requirements:

- **Node.js 18+**
  - Camouflage uses modern ES modules and requires Node.js 18 or higher for native support.
- **npm (or yarn)** for package management
- **Express 5**
  - Camouflage HTTP server is built on **Express 5**, so ensure you’re not mixing incompatible middleware versions from Express 4.

> [!WARNING]
> `@camouflage/http` depends on `spdy` to enable http2 protocol. This is known to cause issues with newer versions of Node.js. It's recommended to use nvm to downgrade to a lower version of node. A relevant warning is shown when http2 is enabled.

### OS Compatibility

- ✅ Linux
- ✅ macOS
- ✅ Windows
