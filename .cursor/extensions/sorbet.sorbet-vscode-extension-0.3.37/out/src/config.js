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
exports.SorbetExtensionConfig = exports.DefaultSorbetWorkspaceContext = exports.backwardsCompatibleTrackUntyped = exports.labelForTrackUntypedSetting = exports.ALL_TRACK_UNTYPED = void 0;
const vscode_1 = require("vscode");
const fs = require("fs");
const sorbetLspConfig_1 = require("./sorbetLspConfig");
const utils_1 = require("./utils");
exports.ALL_TRACK_UNTYPED = [
    "nowhere",
    "everywhere-but-tests",
    "everywhere",
];
function coerceTrackUntypedSetting(value) {
    switch (value) {
        case true:
            return "everywhere";
        case false:
            return "nowhere";
        case "nowhere":
        case "everywhere-but-tests":
        case "everywhere":
            return value;
        default:
            return "nowhere";
    }
}
function labelForTrackUntypedSetting(value) {
    switch (value) {
        case "nowhere":
            return "Nowhere";
        case "everywhere-but-tests":
            return "Everywhere but tests";
        case "everywhere":
            return "Everywhere";
        default:
            const unexpected = value;
            throw new Error(`Unexpected value: ${unexpected}`);
    }
}
exports.labelForTrackUntypedSetting = labelForTrackUntypedSetting;
function backwardsCompatibleTrackUntyped(log, trackWhere) {
    switch (trackWhere) {
        case "nowhere":
            return false;
        case "everywhere":
            return true;
        case "everywhere-but-tests":
            return trackWhere;
        default:
            const exhaustiveCheck = trackWhere;
            log.warning(`Got unexpected state: ${exhaustiveCheck}`);
            return false;
    }
}
exports.backwardsCompatibleTrackUntyped = backwardsCompatibleTrackUntyped;
/** Default implementation accesses `workspace` directly. */
class DefaultSorbetWorkspaceContext {
    constructor(extensionContext) {
        this.cachedSorbetConfiguration = vscode_1.workspace.getConfiguration("sorbet");
        this.onDidChangeConfigurationEmitter = new vscode_1.EventEmitter();
        this.workspaceState = extensionContext.workspaceState;
        this.disposables = [
            this.onDidChangeConfigurationEmitter,
            vscode_1.workspace.onDidChangeConfiguration((e) => {
                if (e.affectsConfiguration("sorbet")) {
                    // update the cached configuration before firing
                    this.cachedSorbetConfiguration = vscode_1.workspace.getConfiguration("sorbet");
                    this.onDidChangeConfigurationEmitter.fire(e);
                }
            }),
        ];
    }
    dispose() {
        vscode_1.Disposable.from(...this.disposables).dispose();
    }
    get(section, defaultValue) {
        var _a;
        const stateKey = `sorbet.${section}`;
        return ((_a = this.workspaceState.get(stateKey)) !== null && _a !== void 0 ? _a : this.cachedSorbetConfiguration.get(section, defaultValue));
    }
    update(section, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const stateKey = `sorbet.${section}`;
            const configValue = this.cachedSorbetConfiguration.get(section, value);
            if (configValue === value) {
                // Remove value from state since configuration's is enough.
                yield this.workspaceState.update(stateKey, undefined);
            }
            else {
                // Save to state since it is being customized.
                yield this.workspaceState.update(stateKey, value);
            }
            this.onDidChangeConfigurationEmitter.fire({
                affectsConfiguration: (section) => /"^sorbet($|\.)"/.test(section),
            });
        });
    }
    get onDidChangeConfiguration() {
        return this.onDidChangeConfigurationEmitter.event;
    }
    /**
     * This function is a workaround to make it possible to enable Sorbet on first launch.
     *
     * The `sorbet.enabled` setting always has its default value set to `false` from `package.json` and cannot be
     * undefined. That means that invoking `workspaceContext.get("enabled", this.enabled)` will always return `false` on
     * first launch regardless of the value of `this.enabled`.
     *
     * To workaround this, we check if `sorbet.enabled` is still undefined in the workspace state and in every type of
     * configuration other than the `defaultValue`. If that's the case, then we can update the workspace state and enable
     * Sorbet on first launch.
     */
    initializeEnabled(enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            const stateEnabled = this.workspaceState.get("sorbet.enabled");
            if (stateEnabled === undefined) {
                const cachedConfig = this.cachedSorbetConfiguration.inspect("enabled");
                if (cachedConfig === undefined ||
                    (cachedConfig.globalValue === undefined &&
                        cachedConfig.workspaceValue === undefined &&
                        cachedConfig.workspaceFolderValue === undefined &&
                        cachedConfig.globalLanguageValue === undefined &&
                        cachedConfig.workspaceFolderLanguageValue === undefined &&
                        cachedConfig.workspaceLanguageValue === undefined)) {
                    yield this.update("enabled", enabled);
                }
            }
        });
    }
}
exports.DefaultSorbetWorkspaceContext = DefaultSorbetWorkspaceContext;
class SorbetExtensionConfig {
    constructor(sorbetWorkspaceContext) {
        this.oldHighlightUntyped = undefined;
        this.configFilePatterns = [];
        this.configFileWatchers = [];
        this.onLspConfigChangeEmitter = new vscode_1.EventEmitter();
        this.sorbetWorkspaceContext = sorbetWorkspaceContext;
        this.standardLspConfigs = [];
        this.userLspConfigs = [];
        this.wrappedHighlightUntyped = "nowhere";
        this.wrappedTypedFalseCompletionNudges = true;
        this.wrappedRevealOutputOnError = false;
        // Any workspace with a `…/sorbet/config` file is considered Sorbet-enabled
        // by default. This implementation does not work in the general case with
        // multi-root workspaces.
        const { workspaceFolders } = vscode_1.workspace;
        this.wrappedEnabled =
            !!(workspaceFolders === null || workspaceFolders === void 0 ? void 0 : workspaceFolders.length) &&
                fs.existsSync(`${workspaceFolders[0].uri.fsPath}/sorbet/config`);
        this.disposables = [
            this.onLspConfigChangeEmitter,
            this.sorbetWorkspaceContext.onDidChangeConfiguration(() => this.refresh()),
            {
                dispose: () => vscode_1.Disposable.from(...this.configFileWatchers).dispose(),
            },
        ];
        this.sorbetWorkspaceContext.initializeEnabled(this.wrappedEnabled);
        this.refresh();
    }
    /**
     * Dispose and free associated resources.
     */
    dispose() {
        vscode_1.Disposable.from(...this.disposables).dispose();
    }
    /**
     * Refreshes the configuration from {@link sorbetWorkspaceContext},
     * emitting change events as necessary.
     */
    refresh() {
        var _a;
        const oldLspConfig = this.activeLspConfig;
        const oldConfigFilePatterns = this.configFilePatterns;
        this.configFilePatterns = this.sorbetWorkspaceContext.get("configFilePatterns", this.configFilePatterns);
        this.wrappedEnabled = this.sorbetWorkspaceContext.get("enabled", this.enabled);
        this.wrappedRevealOutputOnError = this.sorbetWorkspaceContext.get("revealOutputOnError", this.revealOutputOnError);
        const highlightUntyped = this.sorbetWorkspaceContext.get("highlightUntyped", this.highlightUntyped);
        // Always store the setting as a TrackUntyped enum value internally.
        // We'll convert it to legacy-style boolean options (potentially) at the call sites.
        this.wrappedHighlightUntyped = coerceTrackUntypedSetting(highlightUntyped);
        this.wrappedTypedFalseCompletionNudges = this.sorbetWorkspaceContext.get("typedFalseCompletionNudges", this.typedFalseCompletionNudges);
        vscode_1.Disposable.from(...this.configFileWatchers).dispose();
        this.configFileWatchers = this.configFilePatterns.map((pattern) => {
            const watcher = vscode_1.workspace.createFileSystemWatcher(pattern);
            const onConfigChange = () => {
                const c = this.activeLspConfig;
                this.onLspConfigChangeEmitter.fire({
                    oldLspConfig: c,
                    newLspConfig: c,
                });
            };
            watcher.onDidChange(onConfigChange);
            watcher.onDidCreate(onConfigChange);
            watcher.onDidDelete(onConfigChange);
            return watcher;
        });
        this.standardLspConfigs = this.sorbetWorkspaceContext
            .get("lspConfigs", [])
            .map((c) => new sorbetLspConfig_1.SorbetLspConfig(c));
        this.userLspConfigs = this.sorbetWorkspaceContext
            .get("userLspConfigs", [])
            .map((c) => new sorbetLspConfig_1.SorbetLspConfig(c));
        this.selectedLspConfigId = this.sorbetWorkspaceContext.get("selectedLspConfigId", undefined);
        // Ensure `selectedLspConfigId` is a valid Id (not `undefined` or empty)
        if (!this.selectedLspConfigId) {
            this.selectedLspConfigId = (_a = this.lspConfigs[0]) === null || _a === void 0 ? void 0 : _a.id;
        }
        const newLspConfig = this.activeLspConfig;
        if (!sorbetLspConfig_1.SorbetLspConfig.areEqual(oldLspConfig, newLspConfig) ||
            !(0, utils_1.deepEqual)(oldConfigFilePatterns, this.configFilePatterns)) {
            this.onLspConfigChangeEmitter.fire({
                oldLspConfig,
                newLspConfig,
            });
        }
    }
    /**
     * An event that fires when the (effective) active configuration changes.
     */
    get onLspConfigChange() {
        return this.onLspConfigChangeEmitter.event;
    }
    /**
     * Get the active {@link SorbetLspConfig LSP config}.
     *
     * A {@link selectedLspConfig selected} config is only active when {@link enabled}
     * is `true`.
     */
    get activeLspConfig() {
        return this.enabled ? this.selectedLspConfig : undefined;
    }
    get enabled() {
        return this.wrappedEnabled;
    }
    get highlightUntyped() {
        return this.wrappedHighlightUntyped;
    }
    /**
     * Returns a copy of the current SorbetLspConfig objects.
     */
    get lspConfigs() {
        const results = [];
        const resultIds = new Set();
        [...this.userLspConfigs, ...this.standardLspConfigs].forEach((c) => {
            if (!resultIds.has(c.id)) {
                results.push(c);
                resultIds.add(c.id);
            }
        });
        return results;
    }
    get revealOutputOnError() {
        return this.wrappedRevealOutputOnError;
    }
    /**
     * Get the currently selected {@link SorbetLspConfig LSP config}.
     *
     * Returns `undefined` if {@link selectedLspConfigId} has not been set or if
     * its value does not map to a config in {@link lspConfigs}.
     */
    get selectedLspConfig() {
        return this.lspConfigs.find((c) => c.id === this.selectedLspConfigId);
    }
    get typedFalseCompletionNudges() {
        return this.wrappedTypedFalseCompletionNudges;
    }
    /**
     * Set active {@link SorbetLspConfig LSP config}.
     *
     * If {@link enabled} is `false`, this will change it to `true`.
     */
    setActiveLspConfigId(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const updates = [];
            if (((_a = this.activeLspConfig) === null || _a === void 0 ? void 0 : _a.id) !== id) {
                updates.push(this.sorbetWorkspaceContext.update("selectedLspConfigId", id));
            }
            if (!this.enabled) {
                updates.push(this.sorbetWorkspaceContext.update("enabled", true));
            }
            if (updates.length) {
                yield Promise.all(updates);
                this.refresh();
            }
        });
    }
    setEnabled(enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sorbetWorkspaceContext.update("enabled", enabled);
            this.refresh();
        });
    }
    setHighlightUntyped(trackWhere) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sorbetWorkspaceContext.update("highlightUntyped", trackWhere);
            this.refresh();
        });
    }
    /**
     * Set selected {@link SorbetLspConfig LSP config}.
     *
     * This does not change {@link enabled} state.
     */
    setSelectedLspConfigId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.selectedLspConfigId !== id) {
                yield this.sorbetWorkspaceContext.update("selectedLspConfigId", id);
                this.refresh();
            }
        });
    }
    setTypedFalseCompletionNudges(enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sorbetWorkspaceContext.update("typedFalseCompletionNudges", enabled);
            this.refresh();
        });
    }
}
exports.SorbetExtensionConfig = SorbetExtensionConfig;
//# sourceMappingURL=config.js.map