import { CamouflageHttpConfig, Hooks } from "../core/config.js";
import express, { Request, Response, Application } from 'express';
import { setUpMiddlewares } from "../core/middleware.js";
import { Options } from "apicache";
import type cors from "cors";
import type { ParamsDictionary } from 'express-serve-static-core'
import type { ParsedQs } from 'qs'
import { registerRoutes } from "../utils/loadRoutes.js";
import { CompressionOptions } from "compression";
import Helpers from "@camouflage/helpers";
import fs from "fs";
import path from "path";

export const setupExpressServer = async (
    config: CamouflageHttpConfig,
    cacheOptions: Options | null = null,
    corsOptions: cors.CorsOptions | cors.CorsOptionsDelegate<Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>> | null = null,
    helpers: Helpers,
    hooks: Hooks,
    validationOpts: any | null,
    compressionOpts: CompressionOptions | null
): Promise<Application | null> => {
    const app: Application = express()
    await setUpMiddlewares(app, config, cacheOptions, corsOptions, validationOpts, compressionOpts);
    app.get("/health", (_req: Request, res: Response) => {
        (res as any).json({
            status: "up",
            uptime: process.uptime()
        })
    })
    registerRoutes(app, config.mocksDir, helpers, config, hooks)
    if (config.validation && config.validation.enable) {
        app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
    }
    return app;
}