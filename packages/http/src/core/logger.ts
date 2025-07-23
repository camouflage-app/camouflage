import { bunyan, createLogger } from "@camouflage/logger";

export const log: bunyan = createLogger("camouflage-http", "info")