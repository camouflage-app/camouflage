# @camouflage/http

**@camouflage/grpc** is a lightweight **gRPC mock server** built for simulating service-to-service RPC interactions in development and testing environments.

- ✅ File-based routing for gRPC methods
- ✅ Dynamic response generation with Handlebars templates
- ✅ Streaming and unary mocks
- ✅ TLS/SSL support
- ✅ Prometheus monitoring endpoint

[👉 Full Documentation](https://camouflage-app.github.io/camouflage/)

## Installation

Install with jsr.io:

```bash
npx jsr add @camouflage/grpc
```

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

```bash
npm install @grpc/proto-loader @grpc/grpc-js
```

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

### Test gRPC with `grpcurl`:

```bash
grpcurl \
  -plaintext \
  -import-path ./ \
  -proto todo.proto \
  -d '{}' \
  localhost:8082 \
  foo.todoPackage.TodoService.readTodo
```
