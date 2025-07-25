import { Application } from "express";
import swStats from "swagger-stats";
import { CamouflageHttpConfig } from "./config.js";
import { log } from "./logger.js";
import express from 'express';
import { queryParser } from "express-query-parser";
import cookieParser from "cookie-parser";
import apicache, { Options } from 'apicache'
import cors from "cors";
import bformat from 'bunyan-format'
import reqLogger from 'express-bunyan-logger';
import * as OpenApiValidator from 'express-openapi-validator';
import path from 'path';
import fs from 'fs';
import compression, { CompressionOptions } from 'compression'

const formatOut = bformat({ outputMode: 'short' })

export const setUpMiddlewares = (
    app: Application,
    config: CamouflageHttpConfig,
    cacheOptions: Options | null = null,
    corsOptions: cors.CorsOptions | any | null = null,
    validationOpts: any | null,
    compressionOpts: CompressionOptions | null
) => {
    app.use(express.urlencoded({ extended: true }))
    app.use(express.text())
    app.use(express.json({}))
    app.use(cookieParser());
    app.use(
        queryParser({
            parseNull: true,
            parseUndefined: true,
            parseBoolean: true,
            parseNumber: true
        })
    )
    if (!config.log.disableRequestLogs) {
        app.use(reqLogger({
            streams: [{
                level: log.level(),
                stream: formatOut
            }]
        }));
    }
    if (config.monitoring) {
        app.use(
            swStats.getMiddleware({
                name: "camouflage",
                uriPath: "/monitoring",
            })
        );
        log.info(`Keep an eye on your requests @ http://localhost:${config.http?.port}/monitoring`)
    }
    if (config.cache && config.cache.enable) {
        const cache = cacheOptions ? apicache.options(cacheOptions).middleware : apicache.middleware;
        app.use(cache(`${config.cache.timeInSeconds || 60} seconds`))
        log.info(`Cache enabled with duration ${config.cache.timeInSeconds || 60} seconds`)
    }
    if (config.enableCors) {
        if (corsOptions) {
            log.debug("CORS enabled with options")
            app.use(cors(corsOptions))
        } else {
            log.warn("CORS enabled without options")
            app.use(cors())
        }
    }
    if (config.validation && config.validation.enable) {
        if (validationOpts) {
            app.use(OpenApiValidator.middleware(validationOpts));
        } else {
            if (config.validation.apiSpec) {
                const apiSpecPath = path.resolve(config.validation.apiSpec)
                if (fs.existsSync(apiSpecPath)) {
                    app.use(OpenApiValidator.middleware({
                        apiSpec: apiSpecPath,
                        validateRequests: config.validation.validateRequests,
                        validateResponses: config.validation.validateResponses,
                    }));
                } else {
                    log.error('apiSpec not found at the provided path. Skipping validation middleware setup...')
                    return
                }
            }
        }
    }
    if (config.compression) {
        app.use(compression(compressionOpts || {}))
    }
}