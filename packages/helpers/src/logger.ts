import bunyan from 'bunyan'
import bformat from 'bunyan-format'
const formatOut = bformat({ outputMode: 'short' })
/**
 * Defines logger
 * @returns {void}
*/
export const log = bunyan.createLogger({
    name: "camouflage-helpers",
    stream: formatOut
})