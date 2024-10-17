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
const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const sinon = require("sinon");
const testUtils_1 = require("../testUtils");
const setLogLevel_1 = require("../../commands/setLogLevel");
const log_1 = require("../../log");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("setLogLevel: Shows dropdown when target-level argument is NOT provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedLogLevel = log_1.LogLevel.Warning;
        const showQuickPickSingleStub = sinon
            .stub(vscode.window, "showQuickPick")
            .resolves({
            label: log_1.LogLevel[expectedLogLevel],
            level: expectedLogLevel,
        });
        testRestorables.push(showQuickPickSingleStub);
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
        };
        assert.ok(context.log.level !== expectedLogLevel);
        yield assert.doesNotReject((0, setLogLevel_1.setLogLevel)(context));
        assert.strictEqual(context.log.level, expectedLogLevel);
        sinon.assert.calledWithExactly(showQuickPickSingleStub, [
            {
                level: log_1.LogLevel.Trace,
                label: "Trace",
            },
            {
                level: log_1.LogLevel.Debug,
                label: "Debug",
            },
            {
                level: log_1.LogLevel.Info,
                label: "• Info",
            },
            {
                level: log_1.LogLevel.Warning,
                label: "Warning",
            },
            {
                level: log_1.LogLevel.Error,
                label: "Error",
            },
            {
                level: log_1.LogLevel.Critical,
                label: "Critical",
            },
            {
                level: log_1.LogLevel.Off,
                label: "Off",
            },
        ], {
            placeHolder: "Select log level",
        });
    }));
    test("setLogLevel: Shows no-dropdown when target-level argument is provided ", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedLogLevel = log_1.LogLevel.Warning;
        const showQuickPickSingleStub = sinon.stub(vscode.window, "showQuickPick");
        testRestorables.push(showQuickPickSingleStub);
        const log = (0, testUtils_1.createLogStub)();
        const context = { log };
        yield assert.doesNotReject((0, setLogLevel_1.setLogLevel)(context, expectedLogLevel));
        assert.strictEqual(log.level, expectedLogLevel);
        sinon.assert.notCalled(showQuickPickSingleStub);
    }));
});
//# sourceMappingURL=setLogLevel.test.js.map