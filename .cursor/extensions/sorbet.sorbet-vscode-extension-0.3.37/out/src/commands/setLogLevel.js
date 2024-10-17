"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = void 0;
const vscode_1 = require("vscode");
const log_1 = require("../log");
/**
 * Set logging level on associated 'Log' instance.
 * @param context Sorbet extension context.
 * @param level Log level. If not provided, user will be prompted for it.
 */
function setLogLevel(context, level) {
    return __awaiter(this, void 0, void 0, function* () {
        const newLevel = level !== null && level !== void 0 ? level : (yield getLogLevel(context.log.level));
        if (newLevel === undefined) {
            return; // User canceled
        }
        context.log.level = newLevel;
    });
}
exports.setLogLevel = setLogLevel;
function getLogLevel(currentLogLevel) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = [
            log_1.LogLevel.Trace,
            log_1.LogLevel.Debug,
            log_1.LogLevel.Info,
            log_1.LogLevel.Warning,
            log_1.LogLevel.Error,
            log_1.LogLevel.Critical,
            log_1.LogLevel.Off,
        ].map((logLevel) => {
            const item = {
                label: `${currentLogLevel === logLevel ? "• " : ""}${log_1.LogLevel[logLevel]}`,
                level: logLevel,
            };
            return item;
        });
        const selectedLevel = yield vscode_1.window.showQuickPick(items, {
            placeHolder: "Select log level",
        });
        return selectedLevel === null || selectedLevel === void 0 ? void 0 : selectedLevel.level;
    });
}
//# sourceMappingURL=setLogLevel.js.map