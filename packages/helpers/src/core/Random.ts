
import { v4 as uuidv4 } from "uuid";
import Handlebars from "handlebars";
/**
 * Registers randomValue helper
 * - If length of randomValue is not specified, set default length to 16
 * - If type of randomValue is not specified, set default type to ALPHANUMERIC
 * - If uppercase is specified, and is of ALPHABETICAL or ALPHANUMERIC type, add _UPPER to the type
 * - If type is UUID, return UUID, else generate a random value with specified type and length
 * @returns {void}
*/
export const random = () => {
    Handlebars.registerHelper("random", (context: any) => {
        const length = typeof context.hash.length === "undefined" ? 16 : context.hash.length;
        let type = typeof context.hash.type === "undefined" ? "ALPHANUMERIC" : context.hash.type;
        if (context.hash.uppercase && type.includes("ALPHA")) {
            type = type + "_UPPER";
        }
        if (type === "UUID") {
            return uuidv4();
        } else {
            return randomString(length, genCharArray(type));
        }
    });
}
/**
 * Generates a random string of defined length from the character array provided.
 * @returns {void}
*/
const randomString = (length: number, chars: string): string => {
    let result = "";
    if (typeof chars === "undefined") {
        randomFixedInteger(length);
    } else {
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};
/**
 * Generates a random number of defined length
 * @returns {void}
*/
const randomFixedInteger = (length: number): number => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
};
/**
 * Generates character arrays depending on the types, i.e. alphanumeric, alphabetic, uppercase, numberic etc
 * @returns {void}
*/
const genCharArray = (type: string): string => {
    let alphabet;
    /**
     * Create a numbers array of [0...9]
     */
    const numbers = [...Array(10)].map((x, i) => i);
    switch (type) {
        case "ALPHANUMERIC":
            /**
             * If type is ALPHANUMERIC, return a string with characters [a-z][A-Z][0-9]
             * */
            alphabet = [...Array(26)].map((x, i) => String.fromCharCode(i + 97) + String.fromCharCode(i + 65));
            return alphabet.join("") + numbers.join("");
        case "ALPHANUMERIC_UPPER":
            /**
             * If type is ALPHANUMERIC_UPPER, return a string with characters [A-Z][0-9]
             */
            alphabet = [...Array(26)].map((x, i) => String.fromCharCode(i + 65));
            return alphabet.join("") + numbers.join("");
        case "ALPHABETIC":
            /**
             * If type is ALPHABETIC, return a string with characters [a-z][A-Z]
             */
            alphabet = [...Array(26)].map((x, i) => String.fromCharCode(i + 97) + String.fromCharCode(i + 65));
            return alphabet.join("");
        case "ALPHABETIC_UPPER":
            /**
             * If type is ALPHABETIC_UPPER, return a string with characters [A-Z]
             */
            alphabet = [...Array(26)].map((x, i) => String.fromCharCode(i + 65));
            return alphabet.join("");
        case "NUMERIC":
            /**
             * If type is NUMERIC, return a string with characters [0-9]
             */
            return numbers.join("");
        default:
            return ""
            break;
    }
};