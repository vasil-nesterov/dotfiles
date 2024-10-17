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
exports.showSorbetConfigurationPicker = void 0;
const vscode_1 = require("vscode");
/**
 * Show Sorbet Configuration picker.
 * @param context Sorbet extension context.
 */
function showSorbetConfigurationPicker(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { configuration: { activeLspConfig, lspConfigs }, } = context;
        const items = lspConfigs.map((lspConfig) => ({
            label: `${lspConfig.isEqualTo(activeLspConfig) ? "• " : ""}${lspConfig.name}`,
            description: lspConfig.description,
            detail: lspConfig.command.join(" "),
            lspConfig,
        }));
        items.push({
            label: `${activeLspConfig ? "" : "• "}Disable Sorbet`,
            description: "Disable the Sorbet extension",
        });
        const selectedItem = yield vscode_1.window.showQuickPick(items, {
            placeHolder: "Select a Sorbet configuration",
        });
        if (selectedItem) {
            const { lspConfig } = selectedItem;
            if (lspConfig) {
                context.configuration.setActiveLspConfigId(lspConfig.id);
            }
            else {
                context.configuration.setEnabled(false);
            }
        }
    });
}
exports.showSorbetConfigurationPicker = showSorbetConfigurationPicker;
//# sourceMappingURL=showSorbetConfigurationPicker.js.map