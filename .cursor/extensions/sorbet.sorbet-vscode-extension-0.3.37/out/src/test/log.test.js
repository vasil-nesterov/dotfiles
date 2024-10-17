"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const sinon = require("sinon");
const log_1 = require("../log");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("getLogLevelFromEnvironment", () => {
        const restorableValue = process.env[log_1.VSCODE_SORBETEXT_LOG_LEVEL];
        const restoreProcessEnv = {
            restore: () => {
                if (restorableValue !== undefined) {
                    process.env[log_1.VSCODE_SORBETEXT_LOG_LEVEL] = restorableValue;
                }
                else {
                    delete process.env.VSCODE_PAYEXT_LOG_LEVEL;
                }
            },
        };
        testRestorables.push(restoreProcessEnv);
        assert.strictEqual(log_1.LogLevel.Info, (0, log_1.getLogLevelFromEnvironment)(), "Defaults to LogLevel.Info when undefined");
        process.env[log_1.VSCODE_SORBETEXT_LOG_LEVEL] = "Debug";
        assert.strictEqual(log_1.LogLevel.Debug, (0, log_1.getLogLevelFromEnvironment)(log_1.VSCODE_SORBETEXT_LOG_LEVEL, log_1.LogLevel.Debug), "Defaults to provided default when undefined");
        process.env[log_1.VSCODE_SORBETEXT_LOG_LEVEL] = "Not a LogLevel";
        assert.strictEqual(log_1.LogLevel.Info, (0, log_1.getLogLevelFromEnvironment)(), "Defaults to LogLevel.Info when invalid");
        process.env[log_1.VSCODE_SORBETEXT_LOG_LEVEL] = "Error";
        assert.strictEqual(log_1.LogLevel.Error, (0, log_1.getLogLevelFromEnvironment)(), "Defaults to LogLevel.Error when invalid");
    });
    test("getLogLevelFromString", () => {
        // Literal conversion
        assert.strictEqual(log_1.LogLevel.Critical, (0, log_1.getLogLevelFromString)("Critical"));
        assert.strictEqual(log_1.LogLevel.Debug, (0, log_1.getLogLevelFromString)("Debug"));
        assert.strictEqual(log_1.LogLevel.Error, (0, log_1.getLogLevelFromString)("Error"));
        assert.strictEqual(log_1.LogLevel.Info, (0, log_1.getLogLevelFromString)("Info"));
        assert.strictEqual(log_1.LogLevel.Off, (0, log_1.getLogLevelFromString)("Off"));
        assert.strictEqual(log_1.LogLevel.Trace, (0, log_1.getLogLevelFromString)("Trace"));
        assert.strictEqual(log_1.LogLevel.Warning, (0, log_1.getLogLevelFromString)("Warning"));
        // Case insensitive
        assert.strictEqual(log_1.LogLevel.Critical, (0, log_1.getLogLevelFromString)("CRITICAL"));
        assert.strictEqual(log_1.LogLevel.Critical, (0, log_1.getLogLevelFromString)("critical"));
        assert.strictEqual(log_1.LogLevel.Critical, (0, log_1.getLogLevelFromString)("cRiTiCal"));
        // Invalid string
        assert.strictEqual(undefined, (0, log_1.getLogLevelFromString)("Random Value"));
        assert.strictEqual(undefined, (0, log_1.getLogLevelFromString)("  Critical  "));
    });
    test("OutputChannel is initialized correctly", () => {
        const expectedName = "Test";
        const createOutputChannelStub = sinon
            .stub(vscode.window, "createOutputChannel")
            .returns({
            appendLine(_value) { },
        });
        testRestorables.push(createOutputChannelStub);
        const log = new log_1.OutputChannelLog(expectedName);
        assert.doesNotThrow(() => log.info("test message"));
        sinon.assert.calledWithExactly(createOutputChannelStub, expectedName);
    });
    test("OutputChannel.logLevel can be updated", () => {
        const expectedLogLevel = log_1.LogLevel.Warning;
        const createOutputChannelStub = sinon
            .stub(vscode.window, "createOutputChannel")
            .returns({
            appendLine(_value) { },
        });
        testRestorables.push(createOutputChannelStub);
        const log = new log_1.OutputChannelLog("Test", log_1.LogLevel.Info);
        assert.strictEqual(log.level, log_1.LogLevel.Info, "Expected default state");
        log.level = expectedLogLevel;
        assert.strictEqual(log.level, expectedLogLevel, "Expected new state");
        sinon.assert.calledOnce(createOutputChannelStub);
    });
    test("All log methods write", () => {
        const logMessage = "Test log entry";
        let callCount = 0;
        const createOutputChannelStub = sinon
            .stub(vscode.window, "createOutputChannel")
            .returns({
            appendLine(value) {
                assert.ok(value.endsWith(logMessage), `Found: ${value}`);
                callCount++;
            },
        });
        testRestorables.push(createOutputChannelStub);
        const log = new log_1.OutputChannelLog("Test", log_1.LogLevel.Trace);
        log.error(logMessage);
        assert.strictEqual(1, callCount);
        log.info(logMessage);
        assert.strictEqual(2, callCount);
        log.warning(logMessage);
        assert.strictEqual(3, callCount);
        log.debug(logMessage);
        assert.strictEqual(4, callCount);
        log.trace(logMessage);
        assert.strictEqual(5, callCount);
        sinon.assert.calledOnce(createOutputChannelStub);
    });
    test("Only log methods of appropriate level write", () => {
        const logMessage = "Test log entry";
        let callCount = 0;
        const createOutputChannelStub = sinon
            .stub(vscode.window, "createOutputChannel")
            .returns({
            appendLine(value) {
                assert.ok(value.endsWith(logMessage), `Found: ${value}`);
                callCount++;
            },
        });
        testRestorables.push(createOutputChannelStub);
        const log = new log_1.OutputChannelLog("Test", log_1.LogLevel.Info);
        log.debug(logMessage);
        log.trace(logMessage);
        assert.strictEqual(0, callCount, "No calls to OutputChannel.appendLine expected below LogLevel.Info");
        log.info(logMessage);
        assert.strictEqual(1, callCount);
        sinon.assert.calledOnce(createOutputChannelStub);
    });
    test("Log.error handles message and error", () => {
        const logMessage = "TestError";
        const logError = new Error("Test log entry");
        let callCount = 0;
        const createOutputChannelStub = sinon
            .stub(vscode.window, "createOutputChannel")
            .returns({
            appendLine(value) {
                assert.ok(value.endsWith(`${logMessage} Error: ${logError.message}`), `Found: ${value}`);
                callCount++;
            },
        });
        testRestorables.push(createOutputChannelStub);
        const log = new log_1.OutputChannelLog("Test", log_1.LogLevel.Info);
        log.error(logMessage, logError);
        assert.strictEqual(1, callCount);
        sinon.assert.calledOnce(createOutputChannelStub);
    });
});
//# sourceMappingURL=log.test.js.map