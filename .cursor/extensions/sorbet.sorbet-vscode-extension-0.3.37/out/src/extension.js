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
exports.activate = void 0;
const vscode_1 = require("vscode");
const cmdIds = require("./commandIds");
const copySymbolToClipboard_1 = require("./commands/copySymbolToClipboard");
const savePackageFiles_1 = require("./commands/savePackageFiles");
const setLogLevel_1 = require("./commands/setLogLevel");
const showSorbetActions_1 = require("./commands/showSorbetActions");
const showSorbetConfigurationPicker_1 = require("./commands/showSorbetConfigurationPicker");
const toggleUntypedCodeHighlighting_1 = require("./commands/toggleUntypedCodeHighlighting");
const toggleTypedFalseCompletionNudges_1 = require("./commands/toggleTypedFalseCompletionNudges");
const log_1 = require("./log");
const sorbetContentProvider_1 = require("./sorbetContentProvider");
const sorbetExtensionContext_1 = require("./sorbetExtensionContext");
const sorbetStatusBarEntry_1 = require("./sorbetStatusBarEntry");
const types_1 = require("./types");
/**
 * Extension entrypoint.
 */
function activate(context) {
    const sorbetExtensionContext = new sorbetExtensionContext_1.SorbetExtensionContext(context);
    sorbetExtensionContext.log.level = (0, log_1.getLogLevelFromEnvironment)();
    context.subscriptions.push(sorbetExtensionContext, sorbetExtensionContext.configuration.onLspConfigChange(({ oldLspConfig, newLspConfig }) => __awaiter(this, void 0, void 0, function* () {
        const { statusProvider } = sorbetExtensionContext;
        if (oldLspConfig && newLspConfig) {
            // Something about the config changed, so restart
            yield statusProvider.restartSorbet(types_1.RestartReason.CONFIG_CHANGE);
        }
        else if (oldLspConfig) {
            yield statusProvider.stopSorbet(0 /* ServerStatus.DISABLED */);
        }
        else {
            yield statusProvider.startSorbet();
        }
    })));
    const statusBarEntry = new sorbetStatusBarEntry_1.SorbetStatusBarEntry(sorbetExtensionContext);
    context.subscriptions.push(statusBarEntry);
    // Register providers
    context.subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider(sorbetContentProvider_1.SORBET_SCHEME, new sorbetContentProvider_1.SorbetContentProvider(sorbetExtensionContext)));
    // Register commands
    context.subscriptions.push(vscode_1.commands.registerCommand(cmdIds.COPY_SYMBOL_COMMAND_ID, () => (0, copySymbolToClipboard_1.copySymbolToClipboard)(sorbetExtensionContext)), vscode_1.commands.registerCommand(cmdIds.SET_LOGLEVEL_COMMAND_ID, (level) => (0, setLogLevel_1.setLogLevel)(sorbetExtensionContext, level)), vscode_1.commands.registerCommand(cmdIds.SHOW_ACTIONS_COMMAND_ID, () => (0, showSorbetActions_1.showSorbetActions)(sorbetExtensionContext)), vscode_1.commands.registerCommand(cmdIds.SHOW_CONFIG_PICKER_COMMAND_ID, () => (0, showSorbetConfigurationPicker_1.showSorbetConfigurationPicker)(sorbetExtensionContext)), vscode_1.commands.registerCommand(cmdIds.SHOW_OUTPUT_COMMAND_ID, () => sorbetExtensionContext.logOutputChannel.show(true)), vscode_1.commands.registerCommand(cmdIds.SORBET_ENABLE_COMMAND_ID, () => sorbetExtensionContext.configuration.setEnabled(true)), vscode_1.commands.registerCommand(cmdIds.SORBET_DISABLE_COMMAND_ID, () => sorbetExtensionContext.configuration.setEnabled(false)), vscode_1.commands.registerCommand(cmdIds.SORBET_RESTART_COMMAND_ID, (reason = types_1.RestartReason.COMMAND) => sorbetExtensionContext.statusProvider.restartSorbet(reason)), vscode_1.commands.registerCommand(cmdIds.SORBET_SAVE_PACKAGE_FILES, () => (0, savePackageFiles_1.savePackageFiles)(sorbetExtensionContext)), vscode_1.commands.registerCommand(cmdIds.TOGGLE_HIGHLIGHT_UNTYPED_COMMAND_ID, () => (0, toggleUntypedCodeHighlighting_1.toggleUntypedCodeHighlighting)(sorbetExtensionContext)), vscode_1.commands.registerCommand(cmdIds.CONFIGURE_HIGHLIGHT_UNTYPED_COMMAND_ID, () => (0, toggleUntypedCodeHighlighting_1.configureUntypedCodeHighlighting)(sorbetExtensionContext)), vscode_1.commands.registerCommand(cmdIds.TOGGLE_TYPED_FALSE_COMPLETION_NUDGES_COMMAND_ID, () => (0, toggleTypedFalseCompletionNudges_1.toggleTypedFalseCompletionNudges)(sorbetExtensionContext)));
    // Start the extension.
    return sorbetExtensionContext.statusProvider.startSorbet();
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map