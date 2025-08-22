

import Handlebars from "handlebars";
import fs from 'fs'
import path from 'path'
import os from 'os'
import bunyan from "bunyan";
/**
 * Registers csv helper
 * - Fetch the file path, key, value, random and all variables from the context hash
 * - Throw error if file path not defined log and return appropriate error
 * - if random is true, return one random row from csv file as a stringified json array
 * - if all is true, return all row from csv file as a stringified json array
 * - if neither is true, send all rows from csv file as a stringified json array matching a search pattern using specified key and value
 * @returns {void}
*/
export const csvCamouflageHelper = (log: bunyan) => {
    Handlebars.registerHelper("csv", (context: any) => {
        const src = context.hash.src;
        const key = context.hash.key;
        const value = context.hash.value;
        const random = context.hash.random;
        const all = context.hash.all;
        const delimiter = context.hash.delimiter;
        log.debug({ src, key, value, random, all })
        if (!src) {
            log.error("'src' is a required parameter and has not been set.");
            return "'src' is a required parameter and has not been set.";
        }
        if (!delimiter) {
            log.warn("'delimiter' is missing, using default delimiter, i.e. comma. If your csv file contains a different delimiter, results might be unexpected.")
        }
        const file = path.resolve(src);
        if (!fs.existsSync(file)) {
            log.error("CSV file not found");
            return "CSV file not found";
        }
        const json: Record<any, any>[] = []
        const fileContents = fs.readFileSync(file, "utf-8")
        const rows = fileContents.split(os.EOL)
        const headerRow = rows[0];
        const keys = headerRow.split(delimiter || ",")
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(delimiter || ",");
            const jsonObject: Record<any, any> = {};
            for (let j = 0; j < keys.length; j++) {
                jsonObject[keys[j]] = row[j];
            }
            json.push(jsonObject)
        }

        if (all) {
            return JSON.stringify(json)
        }
        if (random) {
            return JSON.stringify(json[Math.floor(Math.random() * json.length)]);
        }
        if (!key || !value) {
            log.error("If random is false, 'key' & 'value' are required parameters");
            return "{}";
        }
        return JSON.stringify(json.filter((el: any) => el[key] === value));
    });
}