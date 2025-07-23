import inquirer from "inquirer";
import { promptHttpConfig } from "./httpConfig.js";
import { promptGrpcConfig } from "./grpcConfig.js";
import type { CamouflageHttpConfig } from "@camouflage/http";
import type { CamouflageGrpcConfig } from "@camouflage/grpc";

async function main(): Promise<void> {
    const { type }: { type: "http" | "grpc" } = await inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: "Which type of mock project do you want to initialize?",
            choices: ["http", "grpc"],
        },
    ]);

    if (type === "http") {
        const config: CamouflageHttpConfig = await promptHttpConfig();
        console.log(JSON.stringify(config, null, 2));
    } else {
        const config: CamouflageGrpcConfig = await promptGrpcConfig();
        console.log(JSON.stringify(config, null, 2));
    }
}

main()