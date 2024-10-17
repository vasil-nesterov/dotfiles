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
const assert = require("assert");
const sinon = require("sinon");
const vscode_1 = require("vscode");
const fs = require("fs");
const config_1 = require("../config");
const sorbetLspConfig_1 = require("../sorbetLspConfig");
// Helpers
/** Imitate the WorkspaceConfiguration. */
class FakeWorkspaceConfiguration {
    constructor(properties = []) {
        this.backingStore = new Map(properties);
        this.configurationChangeEmitter = new vscode_1.EventEmitter();
        const defaultProperties = vscode_1.extensions.getExtension("sorbet.sorbet-vscode-extension").packageJSON.contributes.configuration.properties;
        const defaultValues = Object.keys(defaultProperties).map((settingName) => {
            let value = defaultProperties[settingName].default;
            if (defaultProperties[settingName].type === "boolean" &&
                value === undefined) {
                value = false;
            }
            return [settingName.replace("sorbet.", ""), value];
        });
        this.defaults = new Map(defaultValues);
    }
    dispose() { }
    get(section, defaultValue) {
        if (this.backingStore.has(section)) {
            return this.backingStore.get(section);
        }
        else if (this.defaults.has(section)) {
            return this.defaults.get(section);
        }
        else {
            return defaultValue;
        }
    }
    update(section, value, configurationTarget) {
        if (configurationTarget) {
            assert.fail(`fake does not (yet) support ConfigurationTarget, given: ${configurationTarget}`);
        }
        this.backingStore.set(section, value);
        return Promise.resolve(this.configurationChangeEmitter.fire({
            affectsConfiguration: (s, _) => {
                return section.startsWith(`${s}.`);
            },
        }));
    }
    get onDidChangeConfiguration() {
        return this.configurationChangeEmitter.event;
    }
    initializeEnabled(enabled) {
        const stateEnabled = this.backingStore.get("enabled");
        if (stateEnabled === undefined) {
            this.update("enabled", enabled);
        }
    }
}
const fooLspConfig = new sorbetLspConfig_1.SorbetLspConfig({
    id: "foo",
    name: "FooFoo",
    description: "The foo config",
    cwd: "${workspaceFolder}",
    env: {},
    command: ["foo", "on", "you"],
});
const barLspConfig = new sorbetLspConfig_1.SorbetLspConfig({
    id: "bar",
    name: "BarBar",
    description: "The bar config",
    cwd: "${workspaceFolder}/bar",
    env: {},
    command: ["I", "heart", "bar", "bee", "que"],
});
suite("SorbetLspConfig", () => {
    test("modifications to ctor arg should not modify object", () => {
        const ctorArg = {
            id: "one",
            name: "two",
            description: "three",
            cwd: "four",
            env: {},
            command: ["five", "six"],
        };
        const lspConfig = new sorbetLspConfig_1.SorbetLspConfig(ctorArg);
        ctorArg.id = "modified";
        ctorArg.name = "modified";
        ctorArg.description = "modified";
        ctorArg.cwd = "modified";
        ctorArg.command.push("modified");
        assert.strictEqual(lspConfig.id, "one", "Modifying ctor id should not affect object");
        assert.strictEqual(lspConfig.name, "two", "Modifying ctor name should not affect object");
        assert.strictEqual(lspConfig.description, "three", "Modifying ctor description should not affect object");
        assert.strictEqual(lspConfig.cwd, "four", "Modifying ctor cwd should not affect object");
        assert.deepStrictEqual(lspConfig.command, ["five", "six"], "Modifying ctor command should not affect object");
    });
    suite("equality", () => {
        const json = {
            id: "one",
            name: "two",
            description: "three",
            cwd: "four",
            env: {},
            command: ["five", "six"],
        };
        const config1 = new sorbetLspConfig_1.SorbetLspConfig(json);
        const config2 = new sorbetLspConfig_1.SorbetLspConfig(json);
        const differentConfigs = [
            new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, json), { id: "different id" })),
            new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, json), { name: "different name" })),
            new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, json), { description: "different description" })),
            new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, json), { cwd: "different cwd" })),
            new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, json), { command: ["different", "command"] })),
            new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, json), { env: { different: "value" } })),
            undefined,
        ];
        test(".isEqualTo(other)", () => {
            assert.ok(config1.isEqualTo(config2));
            differentConfigs.forEach((c) => {
                assert.ok(!config1.isEqualTo(c), `Should not equal: ${c}`);
            });
            assert.ok(!config1.isEqualTo(json), "Should not equal JSON");
            assert.ok(!config1.isEqualTo(JSON.stringify(json)), "Should not equal stringified JSON");
            assert.ok(!config1.isEqualTo(JSON.stringify(config1)), "Should not equal stringified config");
        });
        test(".areEqual(config1, config2)", () => {
            assert.ok(sorbetLspConfig_1.SorbetLspConfig.areEqual(config1, config2));
            differentConfigs.forEach((c) => {
                assert.ok(!sorbetLspConfig_1.SorbetLspConfig.areEqual(config1, c), `Should not equal: ${c}`);
            });
        });
    });
});
// Actual tests
suite("SorbetExtensionConfig", () => __awaiter(void 0, void 0, void 0, function* () {
    suite("initialization", () => __awaiter(void 0, void 0, void 0, function* () {
        suite("when no sorbet settings", () => __awaiter(void 0, void 0, void 0, function* () {
            test("sorbet is disabled", () => __awaiter(void 0, void 0, void 0, function* () {
                const workspaceConfig = new FakeWorkspaceConfiguration();
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                assert.strictEqual(sorbetConfig.enabled, false, "should not be enabled");
                assert.deepStrictEqual(sorbetConfig.selectedLspConfig, new sorbetLspConfig_1.SorbetLspConfig(workspaceConfig.defaults.get("lspConfigs")[0]), "LSP configs should have been set to first default");
                assert.strictEqual(sorbetConfig.activeLspConfig, undefined, "should not have an active LSP config");
            }));
        }));
        suite("when a sorbet/config file exists", () => __awaiter(void 0, void 0, void 0, function* () {
            test("sorbet is enabled", () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedWorkspacePath = "/fake/path/to/project";
                const existsSyncStub = sinon
                    .stub(fs, "existsSync")
                    .withArgs(`${expectedWorkspacePath}/sorbet/config`)
                    .returns(true);
                sinon
                    .stub(vscode_1.workspace, "workspaceFolders")
                    .value([{ uri: { fsPath: expectedWorkspacePath } }]);
                const workspaceConfig = new FakeWorkspaceConfiguration();
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                assert.strictEqual(sorbetConfig.enabled, true, "should be enabled");
                sinon.assert.calledOnce(existsSyncStub);
                sinon.restore();
            }));
        }));
        suite("when workspace has fully-populated sorbet settings", () => __awaiter(void 0, void 0, void 0, function* () {
            test("populates SorbetExtensionConfig", () => __awaiter(void 0, void 0, void 0, function* () {
                const workspaceConfig = new FakeWorkspaceConfiguration([
                    ["enabled", true],
                    ["lspConfigs", [fooLspConfig, barLspConfig]],
                    ["selectedLspConfigId", "bar"],
                ]);
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                assert.strictEqual(sorbetConfig.enabled, true, "extension should be enabled");
                const { lspConfigs, selectedLspConfig, activeLspConfig } = sorbetConfig;
                assert.strictEqual(lspConfigs.length, 2, "Should have two configs (foo and bar)");
                assert.strictEqual(selectedLspConfig && selectedLspConfig.id, barLspConfig.id, "selected config should be bar");
                assert.strictEqual(activeLspConfig, selectedLspConfig, "Active config should be same as selected");
            }));
        }));
        suite("when workspace has *some* sorbet settings", () => __awaiter(void 0, void 0, void 0, function* () {
            test("when `sorbet.enabled` is missing", () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedWorkspacePath = "/fake/path/to/project";
                const existsSyncStub = sinon
                    .stub(fs, "existsSync")
                    .withArgs(`${expectedWorkspacePath}/sorbet/config`)
                    .returns(false);
                sinon
                    .stub(vscode_1.workspace, "workspaceFolders")
                    .value([{ uri: { fsPath: expectedWorkspacePath } }]);
                const workspaceConfig = new FakeWorkspaceConfiguration([
                    ["lspConfigs", [fooLspConfig, barLspConfig]],
                    ["selectedLspConfigId", barLspConfig.id],
                ]);
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                assert.strictEqual(sorbetConfig.enabled, false, "should not be enabled");
                const { selectedLspConfig } = sorbetConfig;
                assert.strictEqual(selectedLspConfig && selectedLspConfig.id, barLspConfig.id, "should have a selected LSP config");
                assert.strictEqual(sorbetConfig.activeLspConfig, undefined, "but should not have an active LSP config");
                sinon.assert.calledOnce(existsSyncStub);
                sinon.restore();
            }));
            test("when `sorbet.selectedLspConfigId` is missing", () => __awaiter(void 0, void 0, void 0, function* () {
                const workspaceConfig = new FakeWorkspaceConfiguration([
                    ["enabled", true],
                    ["lspConfigs", [fooLspConfig, barLspConfig]],
                ]);
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                assert.strictEqual(sorbetConfig.enabled, true, "should be enabled");
                const { selectedLspConfig } = sorbetConfig;
                assert.strictEqual(selectedLspConfig && selectedLspConfig.id, fooLspConfig.id, "selectedLspConfig should default to first config");
                assert.strictEqual(sorbetConfig.activeLspConfig, selectedLspConfig, "activeLspConfig should also default to first config");
            }));
            [undefined, ""].forEach((configId) => {
                test(`when \`sorbet.selectedLspConfigId\` is '${configId}', picks first available configuration`, () => __awaiter(void 0, void 0, void 0, function* () {
                    const workspaceConfig = new FakeWorkspaceConfiguration([
                        ["enabled", true],
                        ["lspConfigs", [fooLspConfig, barLspConfig]],
                        ["selectedLspConfigId", configId],
                    ]);
                    const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                    assert.strictEqual(sorbetConfig.enabled, true, "should be enabled");
                    assert.strictEqual(sorbetConfig.selectedLspConfig, sorbetConfig.lspConfigs[0], "selectedLspConfig should be undefined");
                    assert.strictEqual(sorbetConfig.activeLspConfig, sorbetConfig.lspConfigs[0], "activeLspConfig should be undefined");
                }));
            });
            test("when `sorbet.selectedLspConfigId` matches none of the defined `sorbet.lspConfigs`", () => __awaiter(void 0, void 0, void 0, function* () {
                const workspaceConfig = new FakeWorkspaceConfiguration([
                    ["enabled", true],
                    ["lspConfigs", [fooLspConfig]],
                    ["selectedLspConfigId", barLspConfig.id],
                ]);
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                assert.strictEqual(sorbetConfig.enabled, true, "should be enabled");
                assert.strictEqual(sorbetConfig.selectedLspConfig, undefined, "selectedLspConfig should be undefined");
                assert.strictEqual(sorbetConfig.activeLspConfig, undefined, "activeLspConfig should be undefined");
            }));
            suite("sorbet.highlightUntyped", () => __awaiter(void 0, void 0, void 0, function* () {
                test("true instead of a string", () => __awaiter(void 0, void 0, void 0, function* () {
                    const workspaceConfig = new FakeWorkspaceConfiguration([
                        ["highlightUntyped", true],
                    ]);
                    const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                    assert.strictEqual(sorbetConfig.highlightUntyped, "everywhere");
                }));
                test("false instead of a string", () => __awaiter(void 0, void 0, void 0, function* () {
                    const workspaceConfig = new FakeWorkspaceConfiguration([
                        ["highlightUntyped", false],
                    ]);
                    const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                    assert.strictEqual(sorbetConfig.highlightUntyped, "nowhere");
                }));
                test("unrecognized string", () => __awaiter(void 0, void 0, void 0, function* () {
                    const workspaceConfig = new FakeWorkspaceConfiguration([
                        ["highlightUntyped", "nope"],
                    ]);
                    const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                    assert.strictEqual(sorbetConfig.highlightUntyped, "nowhere");
                }));
            }));
            test("multiple instances of SorbetExtensionConfig stay in sync with each other", () => __awaiter(void 0, void 0, void 0, function* () {
                const workspaceConfig = new FakeWorkspaceConfiguration([
                    ["enabled", true],
                    ["lspConfigs", [fooLspConfig, barLspConfig]],
                    ["selectedLspConfigId", fooLspConfig.id],
                ]);
                const sorbetConfig1 = new config_1.SorbetExtensionConfig(workspaceConfig);
                const sorbetConfig2 = new config_1.SorbetExtensionConfig(workspaceConfig);
                assert.ok(sorbetConfig2.activeLspConfig);
                assert.strictEqual(sorbetConfig2.activeLspConfig.id, fooLspConfig.id, "Precondition: config2 should be set to 'foo'");
                yield sorbetConfig1.setActiveLspConfigId(barLspConfig.id);
                assert.ok(sorbetConfig2.activeLspConfig);
                assert.strictEqual(sorbetConfig2.activeLspConfig.id, barLspConfig.id, "changing config1 should also change config2");
            }));
        }));
        suite("when `sorbet.userLspConfigs` is specified", () => __awaiter(void 0, void 0, void 0, function* () {
            test("when values are distinct from `lspConfigs`", () => __awaiter(void 0, void 0, void 0, function* () {
                const workspaceConfig = new FakeWorkspaceConfiguration([
                    ["lspConfigs", [fooLspConfig]],
                    ["userLspConfigs", [barLspConfig]],
                ]);
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                const { selectedLspConfig, lspConfigs } = sorbetConfig;
                assert.deepStrictEqual(lspConfigs, [barLspConfig, fooLspConfig], "items from userLspConfigs should precede items from lspConfigs");
                assert.deepStrictEqual(selectedLspConfig, barLspConfig, "First element of userLspConfigs should be the selected/default config");
            }));
            test("when values overlap with `lspConfigs`", () => __awaiter(void 0, void 0, void 0, function* () {
                const userConfig = new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, barLspConfig), { id: fooLspConfig.id }));
                assert.notDeepEqual(userConfig, fooLspConfig, "Precondition: userFoo and foo should be different configs");
                assert.strictEqual(userConfig.id, fooLspConfig.id, "Precondition: userFoo and foo should have the same id");
                const workspaceConfig = new FakeWorkspaceConfiguration([
                    ["lspConfigs", [fooLspConfig]],
                    ["userLspConfigs", [userConfig]],
                ]);
                const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
                const { selectedLspConfig, lspConfigs } = sorbetConfig;
                assert.deepStrictEqual(lspConfigs, [userConfig], "Item from userLspConfigs should override same id from lspConfigs");
                assert.deepStrictEqual(selectedLspConfig, userConfig, "Selected config should be first of userLspConfigs");
            }));
        }));
    }));
    suite(".enabled", () => __awaiter(void 0, void 0, void 0, function* () {
        test("fires onLspConfigChange event when enabling the extension", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", false],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            sorbetConfig.setEnabled(true).then(() => {
                assert.strictEqual(listener.called, true, "should have called listener onLspConfigChange");
                assert.deepStrictEqual(listener.getCall(0).args[0], {
                    oldLspConfig: undefined,
                    newLspConfig: barLspConfig,
                }, "should have transitioned from no config to bar config");
            });
        }));
        test("fires onLspConfigChange event when disabling the extension", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            sorbetConfig.setEnabled(false).then(() => {
                assert.strictEqual(listener.called, true, "should have called listener onLspConfigChange");
                assert.deepStrictEqual(listener.getCall(0).args[0], {
                    oldLspConfig: barLspConfig,
                    newLspConfig: undefined,
                }, "should have transitioned from bar config to no config");
            });
        }));
    }));
    suite(".setSelectedLspConfigId", () => __awaiter(void 0, void 0, void 0, function* () {
        test("fires onLspConfigChange event when changing LSPConfig", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            sorbetConfig.setSelectedLspConfigId(fooLspConfig.id).then(() => {
                assert.strictEqual(listener.called, true, "should be notified");
                assert.deepStrictEqual(listener.getCall(0).args[0], {
                    oldLspConfig: barLspConfig,
                    newLspConfig: fooLspConfig,
                }, "should have transitioned from bar config to foo config");
            });
        }));
        test("does not fire onLspConfigChange event when unchanged", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            assert.strictEqual(sorbetConfig.selectedLspConfig.id, barLspConfig.id);
            sorbetConfig.setSelectedLspConfigId(barLspConfig.id).then(() => {
                assert.strictEqual(listener.called, false, "should not be notified");
            });
        }));
        test("does not fire onLspConfigChange event when extension disabled", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", false],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            sorbetConfig.setSelectedLspConfigId(fooLspConfig.id).then(() => {
                assert.strictEqual(listener.called, false, "should not be notified");
            });
        }));
    }));
    suite(".onLspConfigChange when WorkspaceConfiguration changes", () => __awaiter(void 0, void 0, void 0, function* () {
        test("does not fire when extension is disabled", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", false],
                ["lspConfigs", [fooLspConfig]],
                ["selectedLspConfigId", fooLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            workspaceConfig.update("lspConfigs", [barLspConfig]);
            workspaceConfig.update("selectedLspConfigId", barLspConfig.id);
            assert.strictEqual(listener.called, false, "should not be notified");
        }));
        test("fires when active LSP config is modified", () => __awaiter(void 0, void 0, void 0, function* () {
            const modifiedBarLspConfig = new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, barLspConfig), { command: ["different", "command", "here"] }));
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            workspaceConfig.update("lspConfigs", [
                fooLspConfig,
                modifiedBarLspConfig,
            ]);
            assert.strictEqual(listener.called, true, "should be notified");
            assert.deepStrictEqual(listener.getCall(0).args[0], {
                oldLspConfig: barLspConfig,
                newLspConfig: modifiedBarLspConfig,
            }, "should have transitioned from old bar config to modified bar config");
        }));
        test("does not fire when non-active LSP config is modified", () => __awaiter(void 0, void 0, void 0, function* () {
            const modifiedFooLspConfig = new sorbetLspConfig_1.SorbetLspConfig(Object.assign(Object.assign({}, fooLspConfig), { command: ["different", "command", "here"] }));
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            workspaceConfig.update("lspConfigs", [
                modifiedFooLspConfig,
                barLspConfig,
            ]);
            assert.strictEqual(listener.called, false, "should not be notified");
        }));
        test("does not fire when a new (non-active) LSP config is added", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            workspaceConfig.update("lspConfigs", [fooLspConfig, barLspConfig]);
            assert.strictEqual(listener.called, false, "should not be notified");
        }));
        test("does not fire when a non-active LSP config is removed", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
                ["selectedLspConfigId", barLspConfig.id],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            workspaceConfig.update("lspConfigs", [barLspConfig]);
            assert.strictEqual(listener.called, false, "should not have called listener onLspConfigChange");
        }));
        test("fires when the active LSP changes by nature of being the first lspConfig", () => __awaiter(void 0, void 0, void 0, function* () {
            const workspaceConfig = new FakeWorkspaceConfiguration([
                ["enabled", true],
                ["lspConfigs", [fooLspConfig, barLspConfig]],
            ]);
            const sorbetConfig = new config_1.SorbetExtensionConfig(workspaceConfig);
            const listener = sinon.spy();
            sorbetConfig.onLspConfigChange(listener);
            workspaceConfig.update("lspConfigs", [barLspConfig, fooLspConfig]);
            assert.strictEqual(listener.called, true, "should have called listener onLspConfigChange");
            assert.deepStrictEqual(listener.getCall(0).args[0], {
                oldLspConfig: fooLspConfig,
                newLspConfig: barLspConfig,
            }, "should have transitioned from foo config to bar config");
        }));
    }));
}));
//# sourceMappingURL=config.test.js.map