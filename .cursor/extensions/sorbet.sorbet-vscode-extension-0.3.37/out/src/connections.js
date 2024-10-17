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
exports.stopProcess = void 0;
/**
 * Attempts to stop the given child process. Tries a SIGINT, then a SIGTERM, then a SIGKILL.
 */
function stopProcess(p, log) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => {
            let hasExited = false;
            log.debug(`Stopping process ${p.pid}`);
            function onExit() {
                if (!hasExited) {
                    hasExited = true;
                    res();
                }
            }
            p.on("exit", onExit);
            p.on("error", onExit);
            p.kill("SIGINT");
            setTimeout(() => {
                if (!hasExited) {
                    log.debug("Process did not respond to SIGINT. Sending a SIGTERM.");
                }
                p.kill("SIGTERM");
                setTimeout(() => {
                    if (!hasExited) {
                        log.debug("Process did not respond to SIGTERM. Sending a SIGKILL.");
                        p.kill("SIGKILL");
                        setTimeout(res, 100);
                    }
                }, 1000);
            }, 1000);
        });
    });
}
exports.stopProcess = stopProcess;
//# sourceMappingURL=connections.js.map