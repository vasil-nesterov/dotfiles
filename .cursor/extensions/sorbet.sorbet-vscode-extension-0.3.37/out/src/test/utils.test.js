"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const utils_1 = require("../utils");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    test("deepEqual", () => {
        assert.ok((0, utils_1.deepEqual)([], []), "Empty");
        assert.ok((0, utils_1.deepEqual)(["a", "b", "c"], ["a", "b", "c"]), "Simple");
        assert.ok(!(0, utils_1.deepEqual)(["a", "b", "c"], []), "Prefix");
        assert.ok(!(0, utils_1.deepEqual)(["a", "b", "c"], ["a", "b"]), "Prefix");
        assert.ok(!(0, utils_1.deepEqual)(["a", "b", "c"], ["c", "b", "a"]), "Out-of-order");
    });
});
//# sourceMappingURL=utils.test.js.map