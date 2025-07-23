import { ZodError, z } from "zod"
import { log } from "./logger.js"
import fs from 'fs'
import path from 'path'
import * as grpc from '@grpc/grpc-js';
import { CamouflageGrpcResponse } from "../utils/handlers.js"
import { bunyan, LogLevel } from "@camouflage/logger";

export type CamouflageGrpcHook = (req: grpc.ServerUnaryCall<any, any> | grpc.ServerWritableStream<any, any> | grpc.ServerReadableStream<any, any>, data?: any, res?: CamouflageGrpcResponse) => void;
export type HookEvent = "onRequest" | "beforeResponse" | "afterResponse";
export interface Hooks {
    [route: string]: {
        [event in HookEvent]?: CamouflageGrpcHook[];
    };
}
export interface CamouflageGrpcConfig {
    log: LogConfig
    host: string
    port: number
    ssl: SSLConfig
    mocksDir: string
    monitoring: MonitoringConfig
}
interface MonitoringConfig {
    enable: boolean,
    port: number
}
interface SSLConfig {
    enable: boolean
    cert: string
    key: string
    rootCert?: string
}
interface LogConfig {
    enable: boolean
    level: LogLevel
}

const logSchema = z.object({
    enable: z.boolean(),
    level: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]),
});
const monitoringSchema = z.object({
    enable: z.boolean(),
    port: z.number(),
});
const sslSchema = z.object({
    enable: z.boolean(),
    cert: z.string().optional(),
    key: z.string().optional(),
    rootCert: z.string().optional(),
});

const CamouflageConfigSchema = z.object({
    log: logSchema,
    host: z.string(),
    port: z.number(),
    ssl: sslSchema,
    mocksDir: z.string(),
    monitoring: monitoringSchema.optional()
}).refine((data) => {
    return fs.existsSync(path.resolve(data.mocksDir))
}, { message: `Mocks Directory does not exist` })
    .refine((data) => {
        if (data.ssl.enable) {
            if (!data.ssl.cert || !data.ssl.key) {
                return false
            }
        }
        return true
    }, { message: "ssl.cert and ssl.key required with ssl.enable=true" })
    .refine(data => {
        if (data.log.enable) {
            log.level(data.log.level)
        }
        return true
    }, {})
    .refine(data => {
        if (data.monitoring?.enable && data.monitoring.port == data.port) {
            return false
        }
        return true
    }, { message: "Provide different ports for monitoring and the grpc server" })

export const isConfigValid = (config: CamouflageGrpcConfig): boolean => {
    try {
        CamouflageConfigSchema.parse(config);
        return true;
    } catch (error) {
        if (error instanceof ZodError) {
            error.issues.forEach(issue => {
                log.error(`${issue.code} - ${issue.path.join(",")} ${issue.message}`)
            })
        } else {
            log.error(error)
        }
        return false
    }
}