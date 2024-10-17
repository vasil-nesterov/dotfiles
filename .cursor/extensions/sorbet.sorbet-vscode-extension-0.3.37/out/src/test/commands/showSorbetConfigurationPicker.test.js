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
const showSorbetConfigurationPicker_1 = require("../../commands/showSorbetConfigurationPicker");
const sorbetLspConfig_1 = require("../../sorbetLspConfig");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("showSorbetConfigurationPicker: Shows dropdown (no-selection)", () => __awaiter(void 0, void 0, void 0, function* () {
        const activeLspConfig = new sorbetLspConfig_1.SorbetLspConfig({
            id: "test-config-id-active",
            name: "test-config-id-active",
            description: "",
            cwd: "",
            env: {},
            command: [],
        });
        const otherLspConfig = new sorbetLspConfig_1.SorbetLspConfig({
            id: "test-config-id",
            name: "test-config-id",
            description: "",
            cwd: "",
            env: {},
            command: [],
        });
        const showQuickPickSingleStub = sinon
            .stub(vscode.window, "showQuickPick")
            .resolves(undefined); // User canceled
        testRestorables.push(showQuickPickSingleStub);
        const log = (0, testUtils_1.createLogStub)();
        const configuration = {
            activeLspConfig,
            lspConfigs: [activeLspConfig, otherLspConfig],
        };
        const context = { log, configuration };
        yield assert.doesNotReject((0, showSorbetConfigurationPicker_1.showSorbetConfigurationPicker)(context));
        sinon.assert.calledOnce(showQuickPickSingleStub);
        assert.deepStrictEqual(showQuickPickSingleStub.firstCall.args[0], [
            {
                label: `• ${activeLspConfig.name}`,
                description: activeLspConfig.description,
                detail: activeLspConfig.command.join(" "),
                lspConfig: activeLspConfig,
            },
            {
                label: otherLspConfig.name,
                description: otherLspConfig.description,
                detail: otherLspConfig.command.join(" "),
                lspConfig: otherLspConfig,
            },
            {
                label: "Disable Sorbet",
                description: "Disable the Sorbet extension",
            },
        ]);
        assert.deepStrictEqual(showQuickPickSingleStub.firstCall.args[1], {
            placeHolder: "Select a Sorbet configuration",
        });
    }));
});
//# sourceMappingURL=showSorbetConfigurationPicker.test.js.map