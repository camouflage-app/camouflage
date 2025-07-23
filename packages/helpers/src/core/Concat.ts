import { bunyan } from "@camouflage/logger";
import Handlebars from "handlebars";
/**
 * Registers concat helper
 * - concat all strings to form one string
 * - Potentially can by concatenated by a delimiter
 * @returns {void}
*/
export const concat = (log: bunyan) => {
    Handlebars.registerHelper("concat", (...args: any[]) => {
        const context = args.pop();
        let concatenatedString = args.join("")
        if (context.hash.delimiter) {
            concatenatedString = args.join(context.hash.delimiter)
        }
        log.debug(`Concatenated String: ${concatenatedString} `)
        return concatenatedString;
    });
}