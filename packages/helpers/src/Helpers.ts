import { createLogger, type LogLevel } from "@camouflage/logger"
import Handlebars from "handlebars"
import { array, assign, concat, csvCamouflageHelper, fakerHelper, importMock, inject, is, now, numBetween, random } from "./core/index.js";

export default class Helpers {
    private injectionAllowed: boolean = false
    private log: any = null;
    constructor(injectionAllowed?: boolean, loglevel: LogLevel = "info") {
        this.log = createLogger("camouflage-helpers", loglevel)
        if (injectionAllowed) this.injectionAllowed = injectionAllowed
        this.registerDefaultHelpers()
    }

    private registerDefaultHelpers = (): void => {
        array(this.log)
        assign(this.log)
        concat(this.log)
        csvCamouflageHelper(this.log)
        importMock(this.log)
        is(this.log)
        now(this.log)
        numBetween(this.log)
        random()
        fakerHelper(this.log)
        if (this.injectionAllowed) {
            inject()
        }
    }
    public addHelper = (name: string, fn: Handlebars.HelperDelegate): void => {
        Handlebars.registerHelper(name, fn)
    }
    public removeHelper = (name: string): void => {
        Handlebars.unregisterHelper(name)
    }
    public parse = (content: string, contextVariables: Record<any, any> = {}): string => {
        const template = Handlebars.compile(content)
        return template(contextVariables).trim()
    }
    // public setInjectionAllowed = (allowed: boolean): void => {
    //     this.injectionAllowed = allowed
    //     if (this.injectionAllowed) {
    //         inject()
    //     } else {
    //         unregisterInject()
    //     }
    // }
}