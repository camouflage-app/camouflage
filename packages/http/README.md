# @camouflage/http

A lightweight **HTTP mock server** for simulating REST APIs.

✅ **File-based routing** → `mocks/users/GET.mock → GET /users`  
✅ **Dynamic templating** → Use Handlebars helpers (`faker`, `now`, etc.)  
✅ **Middleware support** → CORS, caching, compression, OpenAPI validation  
✅ **Lifecycle hooks** → `onRequest`, `beforeResponse`, `afterResponse`  
✅ **Multiple protocols** → HTTP, HTTPS, HTTP/2

👉 **[Full Documentation](https://camouflage-app.github.io/camouflage/)**

---

## Installation

```bash
npx jsr add @camouflage/http
```

---

## Quick Start

1️⃣ **Create a mock config**

`config.json`

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

2️⃣ **Create a simple mock file**

`mocks/hello/GET.mock`

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "message": "Hello from Camouflage!" }
```

3️⃣ **Start the server**

```ts
import CamouflageHttp from "@camouflage/http";

const server = new CamouflageHttp();
server.loadConfigFromJson("./config.json");
server.start();
```

4️⃣ **Test it**

```bash
curl http://localhost:3000/hello
```

Response:

```json
{ "message": "Hello from Camouflage!" }
```

---

## Minimal Example

```ts
import CamouflageHttp from "@camouflage/http";

const camo = new CamouflageHttp({
  mode: "development",
  log: { enable: true, level: "info" },
  http: { enable: true, port: 3000 },
  mocksDir: "./mocks",
});

camo.start();
```

---

## More Docs

📖 **Full documentation & guides:**
👉 [Docs Site →](https://camouflage-app.github.io/camouflage/)
