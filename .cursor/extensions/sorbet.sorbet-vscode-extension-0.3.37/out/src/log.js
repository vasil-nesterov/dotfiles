"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputChannelLog = exports.getLogLevelFromString = exports.getLogLevelFromEnvironment = exports.VSCODE_SORBETEXT_LOG_LEVEL = exports.LogLevel = void 0;
const vscode_1 = require("vscode");
/**
 * The severity level of a log message.
 * Based on $/src/vs/vscode.proposed.d.ts
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 1] = "Trace";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Info"] = 3] = "Info";
    LogLevel[LogLevel["Warning"] = 4] = "Warning";
    LogLevel[LogLevel["Error"] = 5] = "Error";
    LogLevel[LogLevel["Critical"] = 6] = "Critical";
    LogLevel[LogLevel["Off"] = 7] = "Off";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Environment variable defining log level.
 */
exports.VSCODE_SORBETEXT_LOG_LEVEL = "VSCODE_SORBETEXT_LOG_LEVEL";
/**
 * Get log-level as defined in env, otherwise returns `defaultLevel`.
 * @param name Environment variable name.
 * @param defaultLevel Default value if environment does not define a valid one.
 */
function getLogLevelFromEnvironment(name = exports.VSCODE_SORBETEXT_LOG_LEVEL, defaultLevel = LogLevel.Info) {
    var _a;
    let logLevel = defaultLevel;
    const envLogLevel = (_a = process.env[name]) === null || _a === void 0 ? void 0 : _a.trim();
    if (envLogLevel) {
        const parsedLogLevel = getLogLevelFromString(envLogLevel);
        if (parsedLogLevel !== undefined) {
            logLevel = parsedLogLevel;
        }
    }
    return logLevel;
}
exports.getLogLevelFromEnvironment = getLogLevelFromEnvironment;
/**
 * Get `LogLevel` from name, case-insensitively.
 * @param name Log level name.
 */
function getLogLevelFromString(name) {
    const upcaseLevel = name.toUpperCase();
    const entry = Object.entries(LogLevel).find((e) => e[0].toUpperCase() === upcaseLevel);
    return entry && entry[1];
}
exports.getLogLevelFromString = getLogLevelFromString;
/**
 * Output Channel-based implementation of logger.
 */
class OutputChannelLog {
    constructor(name, level = LogLevel.Info) {
        this.wrappedLevel = level;
        // Future:
        // - VSCode 1.66 allows to pass-in a `language` to support syntax coloring.
        // - VSCode 1.75 allows to create a `LogOutputChannel`.
        this.outputChannel = vscode_1.window.createOutputChannel(name);
    }
    appendLine(level, message) {
        const formattedMessage = `${new Date().toISOString()} [${level.toLowerCase()}] ${message}`.trim();
        this.outputChannel.appendLine(formattedMessage);
    }
    /**
     * Appends a new debug message to the log.
     * @param message Log message.
     */
    debug(message) {
        if (this.level <= LogLevel.Debug) {
            this.appendLine("Debug", message);
        }
    }
    /**
     * Dispose and free associated resources.
     */
    dispose() {
        this.outputChannel.dispose();
    }
    /**
     * Appends a new error message to the log.
     * @param errorOrMessage Error or log message.
     * @param error Error (only used when `errorOrMessage` is not a `string`).
     */
    error(errorOrMessage, error) {
        if (this.level <= LogLevel.Error) {
            let message;
            if (typeof errorOrMessage === "string") {
                message = errorOrMessage;
                if (error) {
                    message += ` Error: ${err2Str(error)}`;
                }
            }
            else {
                message = err2Str(errorOrMessage);
            }
            this.appendLine("Error", message);
        }
        function err2Str(err) {
            return err.message || err.name || `\n${err.stack || ""}`;
        }
    }
    /**
     * Appends a new information message to the log.
     * @param message Log message.
     */
    info(message) {
        if (this.level <= LogLevel.Info) {
            this.appendLine("Info", message);
        }
    }
    /**
     * Log level.
     */
    get level() {
        return this.wrappedLevel;
    }
    set level(level) {
        if (this.wrappedLevel !== level) {
            this.wrappedLevel = level;
            this.outputChannel.appendLine(`Log level changed to: ${LogLevel[level]}`);
        }
    }
    /**
     * Appends a new trace message to the log.
     * @param message Log message.
     */
    trace(message) {
        if (this.level <= LogLevel.Trace) {
            this.appendLine("Trace", message);
        }
    }
    /**
     * Appends a new warning message to the log.
     * @param message Log message.
     */
    warning(message) {
        if (this.level <= LogLevel.Warning) {
            this.appendLine("Warning", message);
        }
    }
}
exports.OutputChannelLog = OutputChannelLog;
//# sourceMappingURL=log.js.map