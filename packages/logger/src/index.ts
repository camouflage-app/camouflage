import bunyan, { LogLevel } from 'bunyan';
import bformat from 'bunyan-format';

const formatOut = bformat({ outputMode: 'short' });

/**
 * Creates a logger instance with the provided name.
 * @param name The name of the service/module
 * @returns {bunyan} Logger instance
 */
export const createLogger = (name: string, level: LogLevel) =>
    bunyan.createLogger({
        name,
        stream: formatOut,
        level, // or configurable
    });

export { bunyan, LogLevel };