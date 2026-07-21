/**
 * Simple Logger Utility
 * Production-safe logging with timestamps
 */

class Logger {
    log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const log = {
            timestamp,
            level,
            message,
            data
        };
        console.log(JSON.stringify(log));
    }

    info(message, data = {}) {
        this.log('INFO', message, data);
    }

    error(message, error = {}) {
        this.log('ERROR', message, error);
    }

    warn(message, data = {}) {
        this.log('WARN', message, data);
    }

    debug(message, data = {}) {
        if (process.env.DEBUG) {
            this.log('DEBUG', message, data);
        }
    }
}

module.exports = new Logger();
