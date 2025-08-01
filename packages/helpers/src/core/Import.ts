import Handlebars from "handlebars";
import fs from 'fs'
import path from 'path'
import bunyan from "bunyan";
/**
 * Registers import helper
 * - Fetch the file path from the context hash
 * - Throw error if file path not defined log appropriate error and return
 * - evaluate the provided template and return the resulting string output
 * @returns {void}
*/
export const importMock = (log: bunyan) => {
    Handlebars.registerHelper("import", (context: any) => {
        log.debug(`importing: ${context.hash.path}`)
        if (!context.hash.path) {
            log.error("No paths specified")
            return
        }
        const filepath = path.resolve(context.hash.path)
        const contents = new Handlebars.SafeString(fs.readFileSync(filepath, "utf-8"))
        const template = Handlebars.compile(contents.toString())
        return template({})
    });
}