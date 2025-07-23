
import { bunyan } from "@camouflage/logger";
import Handlebars from "handlebars";
/**
 * Registers array helper
 * - If source or delimiter is not included in the defined handlebar, log an error.
 * - Split the source string with specified delimiter
 * @returns {void}
*/
export const array = (log: bunyan) => {
    Handlebars.registerHelper("array", (context: any) => {
        log.debug(`source: ${context.hash.source}`)
        log.debug(`delimiter: ${context.hash.delimiter}`)
        if (!context.hash.source && !context.hash.delimiter) {
            log.error("Source / Delimiter not specified.");
            return []
        } else {
            const source: string = context.hash.source
            const delimiter: string = context.hash.delimiter
            log.debug(source.split(delimiter))
            return source.split(delimiter);
        }
    });
}