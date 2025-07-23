import inquirer from "inquirer";
import { DotNotationAnswers, expandDotNotation } from "./expandDotNotation.js";
import type { CamouflageGrpcConfig } from "@camouflage/grpc";

export async function promptGrpcConfig(): Promise<CamouflageGrpcConfig> {
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
            type: "input",
            name: "host",
            message: "gRPC server host?",
            default: "0.0.0.0",
        },
        {
            type: "number",
            name: "port",
            message: "gRPC server port?",
            default: 8082,
        },
        {
            type: "confirm",
            name: "ssl.enable",
            message: "Enable SSL?",
            default: false,
        },
        {
            type: "input",
            name: "ssl.cert",
            message: "Path to server cert?",
            default: "location/to/server.cert",
            when: (a) => a["ssl.enable"],
        },
        {
            type: "input",
            name: "ssl.key",
            message: "Path to server key?",
            default: "location/to/server/key",
            when: (a) => a["ssl.enable"],
        },
        {
            type: "input",
            name: "ssl.rootCert",
            message: "Path to root cert? (Optional)",
            default: "location/to/rootCert",
            when: (a) => a["ssl.enable"],
        },
        {
            type: "input",
            name: "mocksDir",
            message: "Path to mocks directory?",
            default: "./grpcMocks",
        },
        {
            type: "confirm",
            name: "monitoring.enable",
            message: "Enable monitoring server?",
            default: true,
        },
        {
            type: "number",
            name: "monitoring.port",
            message: "Monitoring server port?",
            default: 40000,
            when: (a) => a["monitoring.enable"],
        },
    ]);

    return expandDotNotation<CamouflageGrpcConfig>(answers);
}