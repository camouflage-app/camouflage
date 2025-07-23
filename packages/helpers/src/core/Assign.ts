import { bunyan } from '@camouflage/logger';
import Handlebars from 'handlebars'
/**
 * Registers assign helper
 * - If name or value of the variable is not included in the defined handlebar, log an error.
 * - Store the name value pair in context.data.root
 * @returns {void}
*/
export const assign = (log: bunyan) => {
    Handlebars.registerHelper("assign", (context: any) => {
        log.debug(`name: ${context.hash.name}`)
        log.debug(`value: ${context.hash.value}`)
        if (!context.hash.name || !context.hash.value) {
            log.error("name or value not specified.");
            return;
        } else {
            context.data.root[context.hash.name] = context.hash.value;
            log.debug(`Assigned Value ${context.hash.value} to ${context.hash.name}`)
        }
    });
}