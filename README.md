# What is Camouflage?

## Introduction

**Camouflage** is a powerful and flexible **API mocking library** that helps developers simulate HTTP and gRPC services with ease. It is designed for:

- **Developers** who want to quickly test frontend or backend integrations without relying on real services.
- **QA & Automation** teams who need stable, predictable mock responses for automated testing.
- **CI/CD pipelines** where real services may not always be available.

> [!WARNING]
> GRPC Mocking is currently in beta and might have breaking changes

## Key Features

- **Supports multiple protocols**: HTTP (REST), gRPC (unary & streaming)
- **File-based routing**: No extra configuration needed – your folder structure becomes your API routes
- **Dynamic templating with Handlebars**: Generate responses with fake data, randomization, conditionals, etc.
- **Rich built-in helpers**: `faker`, `now`, `csv`, `random`, and more
- **Lifecycle hooks**: Customize behavior with `onRequest`, `beforeResponse`, `afterResponse`
- **Response simulation**: Add delays, headers, metadata, random responses
- **Middleware support**: CORS, caching, compression, OpenAPI validation
- **Monitoring & Metrics**: Swagger stats for HTTP, Prometheus for gRPC
- **Development-friendly**: Hot-reload when mock files change

With Camouflage, you can mock everything from a simple REST endpoint to complex gRPC bidirectional streams—all with minimal setup.

## Prerequisites

Before installing and running Camouflage, make sure your environment meets the following requirements:

- **Node.js 18+**
  - Camouflage uses modern ES modules and requires Node.js 18 or higher for native support.
- **npm (or yarn)** for package management
- **Express 5**
  - Camouflage HTTP server is built on **Express 5**, so ensure you’re not mixing incompatible middleware versions from Express 4.

### OS Compatibility

✅ Linux / macOS  
✅ Windows (but avoid `:` in folder names for routes, use `{param}` instead)

Read more in the [documentation](https://camouflage-app.github.io/camouflage/)
