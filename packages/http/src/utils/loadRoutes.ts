import fs from 'fs'
import path from 'path'
import type express from 'express';
import { log } from '../core/logger.js';
import { CamouflageHttpConfig, Hooks } from '../core/config.js';
import { responseBuilder } from './responseBuilder.js';
import { CamouflageResponse } from '../core/config.js';
import Helpers from '@camouflage/helpers';

export const registerRoutes = (
    app: express.Application,
    currentPath: string,
    helpers: Helpers,
    config: CamouflageHttpConfig,
    hooks: Hooks
) => {
    fs.readdirSync(currentPath).forEach((file) => {
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            registerRoutes(app, fullPath, helpers, config, hooks);
        } else {
            const routerURL = path.parse(fullPath);
            const supportedMethods = ["get", "post", "put", "delete", "patch", "head", "options", "trace"];
            const method = routerURL.base.replace(".mock", "").toLowerCase() as "get" | "post" | "put" | "delete" | "patch" | "head" | "options" | "trace";
            if (supportedMethods.includes(method)) {
                if (routerURL.dir.includes(":")) {
                    log.warn(`Found a route ${routerURL.dir.replace(config.mocksDir, "")}. This folder structure might work on MacOS/Linux but not on Windows. Use of {pathParam} instead of :pathParam is encouraged.`)
                }
                handler(`${routerURL.dir}`, method, app, config, helpers, hooks);
            } else {
                log.error(`Method ${method} not supported`);
            }
        }
    });
};
const handler = (
    fullPath: string,
    method: "get" | "post" | "put" | "delete" | "patch" | "head" | "options" | "trace",
    app: express.Application,
    config: CamouflageHttpConfig,
    helpers: Helpers,
    hooks: Hooks
) => {
    const url = pathToRoute(fullPath.replace(config.mocksDir, ""))
    log.info(`Loading route: ${method.toUpperCase()} - ${url}`)
    app.route(url).all(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const onRequestHooks = hooks[req.route.path]?.onRequest || [];
        const afterResponseHooks = hooks[req.route.path]?.afterResponse || [];
        if (onRequestHooks.length > 0) {
            for (let i = 0; i < onRequestHooks.length; i++) {
                if (!res.headersSent) {
                    await onRequestHooks[i](req, res)
                    if (i == onRequestHooks.length - 1) {
                        next()
                    }
                }
            }
        } else {
            next()
        }
        res.on('finish', () => {
            if (afterResponseHooks.length > 0) {
                afterResponseHooks.forEach(async (hook) => {
                    try {
                        await hook(req, res)
                    } catch (error) {
                        log.error(error)
                    }
                })
            }
        })
    })
    app.route(url)[method](async (req: express.Request, res: express.Response) => {
        const beforeResponseHooks = hooks[req.route.path]?.beforeResponse || [];
        const mockFilePath = path.resolve(`${fullPath}/${method.toUpperCase()}.mock`)
        const camouflageResponse: CamouflageResponse = responseBuilder(mockFilePath, helpers, req, res)
        if (beforeResponseHooks.length > 0) {
            for (let i = 0; i < beforeResponseHooks.length; i++) {
                if (!res.headersSent) {
                    await beforeResponseHooks[i](req, res, camouflageResponse)
                }
            }
        }
        if (!res.headersSent) {
            res.set(camouflageResponse.headers)
            await sleep(camouflageResponse.delay)
            if (camouflageResponse.isFile && camouflageResponse.filePath) {
                res.status(camouflageResponse.statusCode).sendFile(camouflageResponse.filePath)
            } else {
                res.status(camouflageResponse.statusCode).send(camouflageResponse.body)
            }
        }
    })
}
const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export const pathToRoute = (path: string): string => {
    return path.replace(/\{([^\}]+)\}/g, ':$1');
}