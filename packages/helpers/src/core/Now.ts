
import { bunyan } from "@camouflage/logger";
import Handlebars from "handlebars";
import { DateTime } from 'luxon';
/**
 * Registers now helper
 * - If now helper is called without a format, set a default format as YYYY-MM-DD hh:mm:ss else use the format provided
 * - Set default offset to be used if offset is not specified. Default offset is 0s i.e. no offset
 * - If offset is defined the value will be stored in context.hash.offset, eg X days.
 * - Split value by a space, first element will be the amount of offset i.e. X, second element will be unit of offset, i.e. days
 * - Return a value with specified format and added offset
 * @returns {void}
*/
export const now = (log: bunyan) => {
    Handlebars.registerHelper("now", (context: any) => {
        log.debug(`format: ${context.hash.format}`)
        log.debug(`offset: ${context.hash.offset}`)
        const format = context.hash.format ? context.hash.format : "yyyy-MM-dd hh:mm:ss"
        let offsetUnit: string = "seconds";
        let offsetValue = 0;
        if (context.hash.offset) {
            const offsetString = context.hash.offset.split(" ");
            const [value, unit] = offsetString.split(' ');
            offsetValue = parseFloat(value);
            offsetUnit = unit;
        }
        const offsetObject = { [offsetUnit]: offsetValue }
        switch (format) {
            case "epoch":
                return DateTime.now().plus({ ...offsetObject }).toMillis();
            case "unix":
                return DateTime.now().plus({ ...offsetObject }).toSeconds();
            default:
                return DateTime.now().plus({ ...offsetObject }).toFormat(format);
        }
    });
}