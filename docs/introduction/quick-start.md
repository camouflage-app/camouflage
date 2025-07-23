# Quick Start

## Installation

You can install Camouflage via **npm** or **yarn**.

:::tabs key:installation
== npm

```bash
# For HTTP mocking
npx jsr add @camouflage/http
# For gRPC mocking
npx jsr add @camouflage/grpc
# Optional helpers (already included by default)
npx jsr add @camouflage/helpers
```

== yarn

```bash
# For HTTP mocking
yarn add jsr:@camouflage/http
# For gRPC mocking
yarn add jsr:@camouflage/grpc
# Optional helpers (already included by default)
yarn add jsr:@camouflage/helpers
```

:::

### Requirements

- Node.js **18+**
- `npm` or `yarn`

## Quick Start - HTTP

Let’s set up a **minimal HTTP mock server** in under 5 minutes.

### Folder Structure

```text
project/
  mocks/
    users/
      GET.mock
      POST.mock
  config.json
  index.js
  package.json
```

### Minimal HTTP Config (`config.json`)

```json
{
  "mode": "development",
  "log": {
    "enable": true,
    "level": "info"
  },
  "http": {
    "enable": true,
    "port": 3000
  },
  "mocksDir": "./mocks"
}
```

### Example Mock Files

`mocks/users/GET.mock`

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
```

`mocks/users/POST.mock`

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "message": "User created successfully" }

```

### Start the HTTP Server

```js
import CamouflageHttp from "@camouflage/http";

const server = new CamouflageHttp();
server.loadConfigFromJson("./config.json");
server.start();
```

Run it:

```bash
node index.js
```

Your mock API is now running on **[http://localhost:3000](http://localhost:3000)**

- `GET /users` → returns a JSON list of users
- `POST /users` → returns a success message

---

## Quick Start - gRPC

Start with your proto file

`todo.proto`

```protobuf
syntax = "proto3";

package foo.todoPackage;

import "./todoEnum.proto";

service TodoService{
    rpc readTodo(Empty) returns (Todos);
    rpc readTodoStream(Empty) returns (stream Todo);
    rpc createTodoStream(stream Todo) returns (Todos);
    rpc createTodoBidiStream(stream Todo) returns (stream Todo);
}
```

`todoEnum.proto`

```protobuf
syntax = "proto3";

package foo.todoPackage;

message Todo {
    string id = 1;
    string text = 2;
}

message Todos {
    repeated Todo todos = 1;
}

message Empty {}

service TodoEmumService{
    rpc createTodo(Todo) returns (Todo);
}
```

For gRPC, your folder structure might look like:

```text
project/
  grpcMocks/
    foo/
      todoPackage/
        TodoService/
          readTodo.mock
          readTodoStream.mock
          createTodoStream.mock
          createTodoBidiStream.mock
  config.json
  index.js
  todo.proto
  todoEnum.proto
  package.json
```

Create the mock file `./grpcMocks/foo/todoPackage/TodoService/readTodo.mock`

```json
{
  "todos": [
    {
      "id": "1",
      "text": "Lorem Ipsum"
    }
  ],
  "delay": 500
}
```

Minimal gRPC config (`config.json`):

```json
{
  "log": {
    "enable": true,
    "level": "info"
  },
  "host": "0.0.0.0",
  "port": 8082,
  "ssl": { "enable": false },
  "mocksDir": "./grpcMocks",
  "monitoring": { "enable": true, "port": 9100 }
}
```

Install additional packages
:::tabs key:installation
== npm

```bash
npm install @grpc/proto-loader @grpc/grpc-js
```

== yarn

```bash
yarn add @grpc/proto-loader @grpc/grpc-js
```

:::

Start gRPC server:

```ts
import CamouflageGrpc, { CamouflageGrpcConfig } from "@camouflage/grpc";
import * as protoloader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";

const camouflageGrpc = new CamouflageGrpc(config);
const handlers = camouflageGrpc.getHandlers();

const todoPackageDef = protoloader.loadSync("./todo.proto", {});
const todoGrpcObject = grpc.loadPackageDefinition(todoPackageDef);
//@ts-ignore
const todoPackage = todoGrpcObject.foo.todoPackage;

if (handlers) {
  // @ts-ignore
  camouflageGrpc.addService(todoPackage.TodoService.service, {
    readTodo: handlers.unaryHandler,
  });
}

camouflageGrpc.start();
```

Run `node index.js` and your gRPC service is now available on `localhost:8082`!

---

## Testing the Mock

- Test HTTP with `curl`:

```bash
curl http://localhost:3000/users
```

- Test gRPC with `grpcurl`:

```bash
grpcurl \
  -plaintext \
  -import-path ./ \
  -proto todo.proto \
  -d '{}' \
  localhost:8082 \
  foo.todoPackage.TodoService.readTodo
```
