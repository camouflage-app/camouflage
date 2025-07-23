import { CamouflageHttpHook, CamouflageHttpConfig, Hooks, isConfigValid } from "./config.js";
import fs from 'fs';
import path from 'path';
import { log } from "./logger.js";
import { setupExpressServer } from "../server/router.js";
import http, { Server } from "http";
import https from "https";
import express from "express";
import type apicache from "apicache";
import type cors from "cors";
import type { ParamsDictionary } from 'express-serve-static-core'
import type { ParsedQs } from 'qs'
import type { Request } from "express";
import Helpers from '@camouflage/helpers'
import { registerCustomHelpers } from '../helpers/index.js'
import spdy from 'spdy';
import { CompressionOptions } from "compression";
import * as chokidar from "chokidar";
import { debounce } from "../utils/debouce.js";

export default class CamouflageHttp {
    private watcher: chokidar.FSWatcher | null = null;
    private config: CamouflageHttpConfig | null = null;
    private cacheOptions: apicache.Options | null = null
    private corsOptions: cors.CorsOptions | cors.CorsOptionsDelegate<Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>> | null = null
    private app: express.Application | null = null
    private httpServer: Server | null = null
    private httpsServer: Server | null = null
    private http2Server: Server | null = null
    private httpServerOptions: http.ServerOptions | null = null
    private httpsServerOptions: https.ServerOptions | null = null
    private http2ServerOptions: spdy.server.ServerOptions | null = null
    private helpers: Helpers;
    private hooks: Hooks = {};
    private validationOpts: any | null = null
    private compressionOpts: CompressionOptions | null = null

    constructor(
        config?: CamouflageHttpConfig,
        httpOptions?: http.ServerOptions,
        httpsOptions?: https.ServerOptions,
        cacheOptions?: apicache.Options,
        corsOptions?: cors.CorsOptions | cors.CorsOptionsDelegate<Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>>,
    ) {
        if (config) {
            const isValid: boolean = isConfigValid(config)
            if (isValid) {
                this.config = config
                log.debug(this.config)
            } else {
                log.error('Invalid config file!');
                process.exit(1)
            }
        }
        if (httpOptions) this.httpServerOptions = httpOptions;
        if (httpsOptions) this.httpsServerOptions = httpsOptions;
        if (cacheOptions) this.cacheOptions = cacheOptions;
        if (corsOptions) this.corsOptions = corsOptions;
        this.helpers = new Helpers()
        registerCustomHelpers(this.helpers)
    }
    public getHelpers = (): Helpers => {
        return this.helpers
    }
    public loadConfigFromJson = (configFilePath: string): void => {
        if (this.config) log.warn("Config was already loaded. This action will overwrite existing config.")
        const absolutePath = path.resolve(configFilePath)
        if (fs.existsSync(absolutePath)) {
            const configData = JSON.parse(fs.readFileSync(absolutePath, 'utf-8')) as CamouflageHttpConfig;
            const isValid: boolean = isConfigValid(configData)
            if (isValid) {
                this.config = configData
                this.config.mocksDir = path.resolve(this.config.mocksDir)
                log.debug(this.config)
            } else {
                log.error('Invalid config file!');
                process.exit(1)
            }
        } else {
            log.error("File not found", path.resolve(absolutePath))
            process.exit(1)
        }
    }
    public setServerOptionsHttp = (options: http.ServerOptions): void => {
        this.httpServerOptions = options
    }
    public setServerOptionsHttps = (options: https.ServerOptions): void => {
        this.httpsServerOptions = options
    }
    public setServerOptionsHttp2 = (options: spdy.server.ServerOptions): void => {
        this.http2ServerOptions = options
    }
    public setupCacheWithOptions = (options: apicache.Options): void => {
        this.cacheOptions = options
    }
    public setupCorsWithOptions = (corsOptions: cors.CorsOptions | cors.CorsOptionsDelegate<Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>>): void => {
        this.corsOptions = corsOptions
    }
    public setupValidationWithOptions = (validationOpts: any): void => {
        this.validationOpts = validationOpts
    }
    public setupCompressionWithOptions = (compressionOpts: CompressionOptions): void => {
        this.compressionOpts = compressionOpts
    }
    public addHook = (route: string, event: "onRequest" | "beforeResponse" | "afterResponse", fn: CamouflageHttpHook): void => {
        if (!this.hooks[route]) {
            this.hooks[route] = {};
        }
        if (!this.hooks[route][event]) {
            this.hooks[route][event] = [];
        }
        this.hooks[route][event]?.push(fn);
    }
    public async start(): Promise<void> {
        if (!this.config) {
            log.fatal("Error: Config file MIA. Oh well, can't do much without it. Buh-bye")
            process.exit(1)
        }
        this.app = await setupExpressServer(this.config, this.cacheOptions, this.corsOptions, this.helpers, this.hooks, this.validationOpts, this.compressionOpts)
        if (this.config.http && this.config.http.enable && this.app) {
            if (this.httpServerOptions) {
                this.httpServer = http.createServer(this.httpServerOptions, this.app).listen(this.config.http?.port, () => {
                    log.info(`Ask and ye shall recieve a camouflage-http server with options at [:${this.config?.http?.port}]`)
                })
            } else {
                this.httpServer = http.createServer(this.app).listen(this.config.http?.port, () => {
                    log.info(`Ask and ye shall recieve a camouflage-http server at [:${this.config?.http?.port}]`)
                })
            }
        }
        if (this.config.https && this.config.https.enable && this.app && this.httpsServerOptions) {
            this.httpsServer = https.createServer(this.httpsServerOptions, this.app).listen(this.config.https?.port, () => {
                log.info(`Ask and ye shall recieve a camouflage-https server at [:${this.config?.https?.port}]`)
            })
        }
        if (this.config.http2 && this.config.http2.enable && this.app && this.http2ServerOptions) {
            this.http2Server = spdy.createServer(this.http2ServerOptions, this.app).listen(this.config.http2?.port, () => {
                log.info(`Ask and ye shall recieve a camouflage-http2 server at [:${this.config?.http2?.port}]`)
            })
        }
        if (this.config.https && this.config.https.enable && !this.httpsServerOptions) {
            log.error(`Oops! https server needs its SSL suit. Hint: camouflage.setServerOptionsHttps()`)
        }
        if (this.config.http2 && this.config.http2.enable && !this.http2ServerOptions) {
            log.error(`Oops! http2 server needs its SSL suit. Hint: camouflage.setServerOptionsHttp2()`)
        }
        if (this.config.mode === "development") {
            this.watchMocksDir();
        }
    }
    public async stop(): Promise<void> {
        if (this.httpServer) this.httpServer.close()
        if (this.httpsServer) this.httpsServer.close()
        if (this.http2Server) this.http2Server.close()
    }
    public async restart(): Promise<void> {
        let runningServers = this.getRunningServers()

        if (this.watcher) {
            await this.watcher.close();
            this.watcher = null;
        }

        if (this.httpServer) this.httpServer.close(() => {
            if (runningServers <= 1) {
                this.start()
            }
        })
        if (this.httpsServer) this.httpsServer.close(() => {
            if (runningServers <= 2) {
                this.start()
            }
        })
        if (this.http2Server) this.http2Server.close(() => {
            if (runningServers <= 3) {
                this.start()
            }
        })
    }
    private getRunningServers = (): number => {
        let count = 0;
        if (this.httpServer) count++
        if (this.httpsServer) count++
        if (this.http2Server) count++
        return count
    }
    private watchMocksDir = () => {
        if (!this.config) return;
        const dir = this.config.mocksDir;

        this.watcher = chokidar.watch(dir, {
            persistent: true,
            ignoreInitial: true,
            depth: 10, // watch nested dirs
        });

        log.info(`Watching for changes in ${dir}...`);

        const restartDebounced = debounce(() => {
            log.info("Mock files changed. Restarting server...");
            this.restart();
        }, 500);

        this.watcher
            .on("add", restartDebounced)
            .on("change", restartDebounced)
            .on("unlink", restartDebounced)
            .on("addDir", restartDebounced)
            .on("unlinkDir", restartDebounced);
    };
}