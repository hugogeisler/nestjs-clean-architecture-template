import { ILogger } from '@domain/logger/logger.interface';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger implements ILogger {
    /**
     * Log a debug message
     */
    debug(context: string, message: string) {
        if (process.env.NODE_ENV !== 'production') {
            super.debug(`[DEBUG] ${message}`, context);
        }
    }

    /**
     * Log an info message
     */
    log(context: string, message: string) {
        super.log(`[INFO] ${message}`, context);
    }

    /**
     * Log an error message
     */
    error(context: string, message: string, trace?: string) {
        super.error(`[ERROR] ${message}`, trace, context);
    }

    /**
     * Log a warning message
     */
    warn(context: string, message: string) {
        super.warn(`[WARN] ${message}`, context);
    }

    /**
     * Log a verbose message
     */
    verbose(context: string, message: string) {
        if (process.env.NODE_ENV !== 'production') {
            super.verbose(`[VERBOSE] ${message}`, context);
        }
    }
}
