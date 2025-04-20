import { LogLevel } from '../types/ILogLevel'

export class Logger {
    private from
    constructor(from: string) {
        this.from = from
    }
    public log(message: string, logLevel: LogLevel, ...args: unknown[]) {
        const timestamp = new Date().toISOString()
        console.log(
            `[${this.from}] | [${timestamp}] | [${logLevel.toUpperCase()}] | `,
            ...args
        )
    }
}

export default Logger
