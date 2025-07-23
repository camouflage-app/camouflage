import inquirer from "inquirer";
import { DotNotationAnswers, expandDotNotation } from "./expandDotNotation.js";
import type { CamouflageHttpConfig } from '@camouflage/http';

export async function promptHttpConfig(): Promise<CamouflageHttpConfig> {
    const answers: DotNotationAnswers = await inquirer.prompt([
        {
            type: "confirm",
            name: "log.enable",
            message: "Enable logs?",
            default: true,
        },
        {
            type: "list",
            name: "log.level",
            message: "Log level?",
            choices: ["fatal", "error", "warn", "info", "debug", "trace"],
            default: "trace",
            when: (a) => a["log.enable"],
        },
        {
            type: "confirm",
            name: "log.disableRequestLogs",
            message: "Disable request logs?",
            default: true,
        },
        {
            type: "confirm",
            name: "http.enable",
            message: "Enable HTTP server?",
            default: true,
        },
        {
            type: "number",
            name: "http.port",
            message: "HTTP port?",
            default: 8080,
        },
        {
            type: "confirm",
            name: "https.enable",
            message: "Enable HTTPS server?",
            default: false,
        },
        {
            type: "number",
            name: "https.port",
            message: "HTTPS port?",
            default: 8443,
        },
        {
            type: "confirm",
            name: "http2.enable",
            message: "Enable HTTP/2 server?",
            default: false,
        },
        {
            type: "number",
            name: "http2.port",
            message: "HTTP/2 port?",
            default: 9443,
        },
        {
            type: "confirm",
            name: "monitoring",
            message: "Enable monitoring endpoint (/monitoring)?",
            default: true,
        },
        {
            type: "confirm",
            name: "cache.enable",
            message: "Enable cache?",
            default: true,
        },
        {
            type: "number",
            name: "cache.timeInSeconds",
            message: "Cache TTL (in seconds)?",
            default: 5,
            when: (a) => a["cache.enable"],
        },
        {
            type: "confirm",
            name: "enableCors",
            message: "Enable CORS?",
            default: true,
        },
        {
            type: "input",
            name: "mocksDir",
            message: "Path to mocks directory?",
            default: "./mocks",
        },
    ]);

    return expandDotNotation<CamouflageHttpConfig>(answers);
}