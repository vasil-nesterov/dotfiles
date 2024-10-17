"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogStub = void 0;
const log_1 = require("../log");
/**
 * Stub {@link Log} interface.
 * @param level Default log-level.
 */
function createLogStub(level = log_1.LogLevel.Critical) {
    return {
        debug: (_message) => { },
        error: (_messageOrError) => { },
        info: (_message) => { },
        trace: (_message) => { },
        warning: (_message) => { },
        level,
    };
}
exports.createLogStub = createLogStub;
//# sourceMappingURL=testUtils.js.map