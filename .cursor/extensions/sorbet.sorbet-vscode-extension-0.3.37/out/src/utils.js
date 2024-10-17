"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepEqualEnv = exports.deepEqual = void 0;
/**
 * Compare two `string` arrays for deep, in-order equality.
 */
function deepEqual(a, b) {
    return a.length === b.length && a.every((itemA, index) => itemA === b[index]);
}
exports.deepEqual = deepEqual;
function deepEqualEnv(a, b) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return (keysA.length === keysB.length &&
        keysA.every((key) => a[key] === b[key]) &&
        keysB.every((key) => a[key] === b[key]));
}
exports.deepEqualEnv = deepEqualEnv;
//# sourceMappingURL=utils.js.map