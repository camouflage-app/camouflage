import Handlebars from "handlebars";

/**
 * Registers inject helper
 * - Evaluate the response of the function passed in and return the resulting response
 * @returns {void}
*/
export const inject = (): void => {
    Handlebars.registerHelper("inject", (context: any) => {
        const result = eval(context.fn(this));
        return result;
    });
}
/**
 * Unregisters inject helper
 * @returns {void}
*/
export const unregisterInject = (): void => {
    Handlebars.unregisterHelper("inject")
}