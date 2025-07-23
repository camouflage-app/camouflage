# Integrating Camouflage With Vite

While Camouflage can be run as a standalone project, it can just as seamlessly be integrated into a vite project for any supported frameworks like Svelte, React, etc.

### Create a new Vite project

> [!TIP]
> We will create a svelte project using vite, but similar steps would apply for any vite project.

```bash
npm create vite@latest my-svelte-app # Select Svelte as framework
cd my-svelte-app
npm install
```

### Install Camouflage

```bash
npx jsr add @camouflage/http
```

### Add a Camouflage configuration file

Create a minimal config.json for Camouflage:

```json
{
  "mode": "development",
  "log": {
    "enable": true,
    "level": "info"
  },
  "http": {
    "enable": true,
    "port": 3001
  },
  "mocksDir": "./mocks"
}
```

And create a simple mock file, e.g. `mocks/hello/GET.mock`:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "message": "Hello from Camouflage!" }
```

### Start Camouflage alongside Vite

Now we’ll start Camouflage alongside Vite by using the vite's **configureServer** hook.

Edit the `vite.config.ts` file:

```ts
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import CamouflageHttp from "@camouflage/http";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: "camouflage",
      configureServer(server) {
        const camouflageHttp = new CamouflageHttp();
        camouflageHttp.loadConfigFromJson("./config.json");
        camouflageHttp.start();
        server.httpServer?.on("close", () => camouflageHttp.stop());
      },
    },
  ],
});
```

This ensures that when your Vite server boots, it also spins up a Camouflage mock server on the defined port (3001).

### Run the project

```bash
npm run dev
```

You’ll see two servers running:

- SvelteKit → e.g. http://localhost:5173
- Camouflage Mock API → http://localhost:3001
