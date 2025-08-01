import Handlebars from "handlebars"
import { array, assign, concat, csvCamouflageHelper, fakerHelper, importMock, inject, is, now, numBetween, random } from "./core/index.js";
import { log } from "./logger.js";
import { LogLevel } from "bunyan";
/**
 * Helpers
 *
 * A collection of built-in Handlebars helpers for generating dynamic mock responses.
 *
 * Used internally by Camouflage to enhance `.mock` files with:
 * - Fake data generation
 * - Dynamic timestamps
 * - Randomization
 * - Request data extraction
 * - File imports (JSON/CSV)
 * - State persistence
 *
 * Can also be used standalone in any Handlebars setup.
 *
 * @example
 * ```ts
 * import Handlebars from "handlebars";
 * import Helpers from "@camouflage/helpers";
 *
 * const helpers = new Helpers();
 * helpers.register(Handlebars);
 *
 * const template = Handlebars.compile("{{faker 'name.firstName'}}");
 * console.log(template({})); // => "Alice"
 * ```
 */
export default class Helpers {
    private injectionAllowed: boolean = false
    private log: any = null;
    constructor(injectionAllowed?: boolean, loglevel: LogLevel = "info") {
        this.log = log
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