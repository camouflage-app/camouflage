import bunyan from 'bunyan'
import bformat from 'bunyan-format'
const formatOut: NodeJS.WritableStream = bformat({ outputMode: 'short' })
export const log: bunyan = bunyan.createLogger({
    name: "camouflage-http",
    stream: formatOut
})