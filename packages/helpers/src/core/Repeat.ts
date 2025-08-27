import bunyan from "bunyan";
import Handlebars from "handlebars";
import { DateTime } from 'luxon';
/**
 * Registers repeat helper
 * - Run specified n number of times
 * @returns {void}
*/
export const repeat = (log: bunyan) => {
    Handlebars.registerHelper("repeat", (times: any, options: any) => {
        const count = times
        if (!count) {
            log.error("loop count not specified")
            return ""
        }
        const n = parseInt(count, 10);

        if (isNaN(n)) {
            throw new Error(`Invalid parameter: "${count}" is not a number.`);
        }

        if (n < 0) {
            throw new Error(`Invalid parameter: loop count cannot be negative (${n}).`);
        }

        // Optional safeguard (to prevent abuse if N is huge)
        const MAX = 10000;
        if (n > MAX) {
            throw new Error(`Loop count too large: maximum allowed is ${MAX}.`);
        }
        let result = "";

        for (let i = 0; i < n; i++) {
            // Pass index as the context if needed
            result += options.fn(this, { data: { index: i, first: i === 0, last: i === n - 1 } });
        }

        return result;
    });
}