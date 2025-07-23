# Integrating Camouflage With Sveltekit

While Camouflage can be run as a standalone project, it can just as seamlessly be integrated into a **SvelteKit** project allowing you to maintain a single project and start up Camouflage alongside your Sveltekit app.

### Create a new SvelteKit project

If you don’t already have a SvelteKit project, create one:

```bash
npx sv create my-app
cd my-app
npm install
npm run dev
```

### Install the Node adapter

Since Camouflage runs on Node.js, you’ll need the SvelteKit **adapter-node**:

```bash
npm install @sveltejs/adapter-node
```

The update the svelte.config.js

```js
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
};

export default config;
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

### Integrate Camouflage into SvelteKit hooks

Now we’ll start Camouflage alongside SvelteKit by using the server **init hook**.

Create a `src/hooks.server.ts` file and add:

```ts
import type { ServerInit } from "@sveltejs/kit";
import CamouflageHttp from "@camouflage/http";

export const init: ServerInit = () => {
  const server = new CamouflageHttp();
  server.loadConfigFromJson("./config.json");
  server.start(); // Starts the mock server on port 3001
};
```

This ensures that when your SvelteKit server boots, it also spins up a Camouflage mock server on the defined port (3001).

### Run the project

```bash
npm run dev
```

You’ll see two servers running:

- SvelteKit → e.g. http://localhost:5173
- Camouflage Mock API → http://localhost:3001
