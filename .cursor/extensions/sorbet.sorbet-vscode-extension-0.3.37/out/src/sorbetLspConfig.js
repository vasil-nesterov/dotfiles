"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorbetLspConfig = void 0;
const utils_1 = require("./utils");
/**
 * Sorbet LSP configuration.
 */
class SorbetLspConfig {
    constructor(idOrData, name = "", description = "", cwd = "", env = {}, command = []) {
        if (typeof idOrData === "string") {
            this.id = idOrData;
            this.name = name;
            this.description = description;
            this.cwd = cwd;
            this.env = Object.assign({}, env);
            this.command = command;
        }
        else {
            this.id = idOrData.id;
            this.name = idOrData.name;
            this.description = idOrData.description;
            this.cwd = idOrData.cwd;
            this.env = Object.assign({}, idOrData.env);
            this.command = [...idOrData.command];
        }
    }
    toString() {
        return `${this.name}: ${this.description} [cmd: "${this.command.join(" ")}"]`;
    }
    /**
     * Deep equality.
     */
    isEqualTo(other) {
        if (this === other)
            return true;
        if (!(other instanceof SorbetLspConfig))
            return false;
        return (this.id === other.id &&
            this.name === other.name &&
            this.description === other.description &&
            this.cwd === other.cwd &&
            (0, utils_1.deepEqualEnv)(this.env, other.env) &&
            (0, utils_1.deepEqual)(this.command, other.command));
    }
    /**
     * Deep equality, suitable for use when left and/or right may be null or undefined.
     */
    static areEqual(left, right) {
        return left ? left.isEqualTo(right) : left === right;
    }
}
exports.SorbetLspConfig = SorbetLspConfig;
//# sourceMappingURL=sorbetLspConfig.js.map