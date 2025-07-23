import type { ServerInit } from "@sveltejs/kit";
import CamouflageHttp from "@camouflage/http";
export const init: ServerInit = () => {
    const server = new CamouflageHttp();
    server.loadConfigFromJson("/Users/shubhendumadhukar/Documents/camouflage/apps/with-sveltekit/config.json");
    server.start();
}