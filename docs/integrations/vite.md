---
layout: doc
aside: false
---

# Using Camouflage with Vite based projects

You can use camouflage with any vite based projects by simply creating a plugin and configuring the server to start and stop camouflage with the vite server. Refer to the following example and make necessary changes to your `vite.config.ts`. We are using a vite template for svelte, but similar examples would work for any vite based app.

In the example below, you can access the mock APIs via proxy http://localhost:5173/api/hello. (Assuming you have a mock API at http://localhost:3000/hello)

```ts
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import CamouflageHttp from "@camouflage/http";
let camouflage: CamouflageHttp | null;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: "camouflage",
      async configureServer(server) {
        if (!camouflage) {
          camouflage = new CamouflageHttp();
          camouflage.loadConfigFromJson("./config.json");
          await camouflage.start();
        }
        server.httpServer?.on("close", async () => {
          if (camouflage) {
            await camouflage?.stop();
            camouflage = null;
          }
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Port as configured in camouflage config.json
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```
