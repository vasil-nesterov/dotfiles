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
const showSorbetActions_1 = require("../../commands/showSorbetActions");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("getAvailableActions", () => {
        assert.deepStrictEqual((0, showSorbetActions_1.getAvailableActions)(0 /* ServerStatus.DISABLED */), [
            "View Output" /* Action.ViewOutput */,
            "Enable Sorbet" /* Action.EnableSorbet */,
            "Configure Sorbet" /* Action.ConfigureSorbet */,
        ]);
        assert.deepStrictEqual((0, showSorbetActions_1.getAvailableActions)(4 /* ServerStatus.ERROR */), [
            "View Output" /* Action.ViewOutput */,
            "Restart Sorbet" /* Action.RestartSorbet */,
            "Configure Sorbet" /* Action.ConfigureSorbet */,
        ]);
        assert.deepStrictEqual((0, showSorbetActions_1.getAvailableActions)(2 /* ServerStatus.INITIALIZING */), [
            "View Output" /* Action.ViewOutput */,
            "Restart Sorbet" /* Action.RestartSorbet */,
            "Disable Sorbet" /* Action.DisableSorbet */,
            "Configure Sorbet" /* Action.ConfigureSorbet */,
        ]);
        assert.deepStrictEqual((0, showSorbetActions_1.getAvailableActions)(1 /* ServerStatus.RESTARTING */), [
            "View Output" /* Action.ViewOutput */,
            "Restart Sorbet" /* Action.RestartSorbet */,
            "Disable Sorbet" /* Action.DisableSorbet */,
            "Configure Sorbet" /* Action.ConfigureSorbet */,
        ]);
        assert.deepStrictEqual((0, showSorbetActions_1.getAvailableActions)(3 /* ServerStatus.RUNNING */), [
            "View Output" /* Action.ViewOutput */,
            "Restart Sorbet" /* Action.RestartSorbet */,
            "Disable Sorbet" /* Action.DisableSorbet */,
            "Configure Sorbet" /* Action.ConfigureSorbet */,
        ]);
    });
    test("showSorbetActions: Shows dropdown (no-selection)", () => __awaiter(void 0, void 0, void 0, function* () {
        const showQuickPickSingleStub = sinon
            .stub(vscode.window, "showQuickPick")
            .resolves(undefined); // User canceled
        testRestorables.push(showQuickPickSingleStub);
        const log = (0, testUtils_1.createLogStub)();
        const statusProvider = {
            serverStatus: 3 /* ServerStatus.RUNNING */,
        };
        const context = { log, statusProvider };
        yield assert.doesNotReject((0, showSorbetActions_1.showSorbetActions)(context));
        sinon.assert.calledOnce(showQuickPickSingleStub);
        assert.deepStrictEqual(showQuickPickSingleStub.firstCall.args[0], [
            "View Output" /* Action.ViewOutput */,
            "Restart Sorbet" /* Action.RestartSorbet */,
            "Disable Sorbet" /* Action.DisableSorbet */,
            "Configure Sorbet" /* Action.ConfigureSorbet */,
        ]);
        assert.deepStrictEqual(showQuickPickSingleStub.firstCall.args[1], {
            placeHolder: "Select an action",
        });
    }));
});
//# sourceMappingURL=showSorbetActions.test.js.map