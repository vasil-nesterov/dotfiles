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
exports.getAvailableActions = exports.showSorbetActions = void 0;
const vscode_1 = require("vscode");
const commandIds_1 = require("../commandIds");
const types_1 = require("../types");
/**
 * Show available actions in a drop-down.
 * @param context Sorbet extension context.
 */
function showSorbetActions(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const actions = getAvailableActions(context.statusProvider.serverStatus);
        const selectedAction = yield vscode_1.window.showQuickPick(actions, {
            placeHolder: "Select an action",
        });
        switch (selectedAction) {
            case "Configure Sorbet" /* Action.ConfigureSorbet */:
                yield vscode_1.commands.executeCommand(commandIds_1.SHOW_CONFIG_PICKER_COMMAND_ID);
                break;
            case "Disable Sorbet" /* Action.DisableSorbet */:
                yield vscode_1.commands.executeCommand(commandIds_1.SORBET_DISABLE_COMMAND_ID);
                break;
            case "Enable Sorbet" /* Action.EnableSorbet */:
                yield vscode_1.commands.executeCommand(commandIds_1.SORBET_ENABLE_COMMAND_ID);
                break;
            case "Restart Sorbet" /* Action.RestartSorbet */:
                yield vscode_1.commands.executeCommand(commandIds_1.SORBET_RESTART_COMMAND_ID, types_1.RestartReason.STATUS_BAR_BUTTON);
                break;
            case "View Output" /* Action.ViewOutput */:
                yield vscode_1.commands.executeCommand(commandIds_1.SHOW_OUTPUT_COMMAND_ID);
                break;
            default:
                break; // User canceled
        }
    });
}
exports.showSorbetActions = showSorbetActions;
/**
 * Get available {@link Action actions} based on Sorbet' status.
 */
function getAvailableActions(serverStatus) {
    const actions = ["View Output" /* Action.ViewOutput */];
    switch (serverStatus) {
        case 4 /* ServerStatus.ERROR */:
            actions.push("Restart Sorbet" /* Action.RestartSorbet */);
            break;
        case 0 /* ServerStatus.DISABLED */:
            actions.push("Enable Sorbet" /* Action.EnableSorbet */);
            break;
        default:
            actions.push("Restart Sorbet" /* Action.RestartSorbet */, "Disable Sorbet" /* Action.DisableSorbet */);
            break;
    }
    actions.push("Configure Sorbet" /* Action.ConfigureSorbet */);
    return actions;
}
exports.getAvailableActions = getAvailableActions;
//# sourceMappingURL=showSorbetActions.js.map