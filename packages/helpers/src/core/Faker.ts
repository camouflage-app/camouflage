import { bunyan } from "@camouflage/logger";
import Handlebars from "handlebars";
import { faker } from "@faker-js/faker";

export const fakerHelper = (log: bunyan) => {
    Handlebars.registerHelper("faker", (context: any) => {
        const methodPath = context.hash.method;

        if (!methodPath) {
            log.error("faker helper requires a 'method' parameter.");
            return "";
        }

        // Split the method path (e.g., "internet.email")
        const parts = methodPath.split(".");
        let fn: any = faker;

        for (const part of parts) {
            if (fn && fn[part]) {
                fn = fn[part];
            } else {
                log.error(`Invalid faker method: ${methodPath}`);
                return "";
            }
        }

        if (typeof fn !== "function") {
            log.error(`Faker method ${methodPath} is not callable.`);
            return "";
        }

        // Collect additional params (e.g. min, max)
        const { method, ...args } = context.hash;
        const argValues = Object.values(args);

        try {
            return fn(...argValues);
        } catch (err) {
            log.error(`Error calling faker.${methodPath}: ${(err as Error).message}`);
            return "";
        }
    });
};
