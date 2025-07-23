import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import CamouflageHttp from '@camouflage/http';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'camouflage',
      configureServer(server) {
        const camouflageHttp = new CamouflageHttp();
        camouflageHttp.loadConfigFromJson("/Users/shubhendumadhukar/Documents/camouflage/apps/with-svelte/config.json");
        camouflageHttp.start();
        server.httpServer?.on('close', () => camouflageHttp.stop())
      }
    }
  ],
})
