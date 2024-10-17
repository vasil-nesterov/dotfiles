"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const sorbetLspConfig_1 = require("../sorbetLspConfig");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    const config1 = new sorbetLspConfig_1.SorbetLspConfig("test_id", "test_name", "test_description", "test_cwd", {}, ["test_command", "test_arg_1"]);
    const config2 = new sorbetLspConfig_1.SorbetLspConfig("test_id", "test_name", "test_description", "test_cwd", {}, ["test_command", "test_arg_1"]);
    const differentConfigs = [
        new sorbetLspConfig_1.SorbetLspConfig("different_test_id", "test_name", "test_description", "test_cwd", {}, ["test_command", "test_arg_1"]),
        new sorbetLspConfig_1.SorbetLspConfig("test_id", "different_test_name", "test_description", "test_cwd", {}, ["test_command", "test_arg_1"]),
        new sorbetLspConfig_1.SorbetLspConfig("test_id", "test_name", "different_test_description", "test_cwd", {}, ["test_command", "test_arg_1"]),
        new sorbetLspConfig_1.SorbetLspConfig("test_id", "test_name", "test_description", "different_test_cwd", {}, ["test_command", "test_arg_1"]),
        new sorbetLspConfig_1.SorbetLspConfig("test_id", "test_name", "test_description", "test_cwd", {}, ["different_test_command", "test_arg_1"]),
        new sorbetLspConfig_1.SorbetLspConfig("test_id", "test_name", "test_description", "test_cwd", {
            different_env_key: "different_env_value",
        }, ["test_command", "test_arg_1"]),
        undefined,
        null,
    ];
    test("isEqualTo(other)", () => {
        assert.ok(config1.isEqualTo(config2));
        differentConfigs.forEach((c) => assert.ok(!config1.isEqualTo(c), `Should not equal: ${c}`));
    });
    test("toString", () => {
        assert.strictEqual(config1.toString(), 'test_name: test_description [cmd: "test_command test_arg_1"]');
    });
});
//# sourceMappingURL=sorbetLspConfig.test.js.map