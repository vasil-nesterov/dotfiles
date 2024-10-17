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
exports.SorbetStatusBarEntry = void 0;
const Spinner = require("elegant-spinner");
const vscode_1 = require("vscode");
const commandIds_1 = require("./commandIds");
const types_1 = require("./types");
class SorbetStatusBarEntry {
    constructor(context) {
        this.context = context;
        this.serverStatus = 0 /* ServerStatus.DISABLED */;
        this.spinner = Spinner();
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 10);
        this.statusBarItem.command = commandIds_1.SHOW_ACTIONS_COMMAND_ID;
        this.disposable = vscode_1.Disposable.from(this.context.configuration.onLspConfigChange(() => this.render()), this.context.statusProvider.onStatusChanged((e) => this.onServerStatusChanged(e)), this.context.statusProvider.onShowOperation((_params) => this.render()), this.statusBarItem);
        this.render();
        this.statusBarItem.show();
    }
    /**
     * Dispose and free associated resources.
     */
    dispose() {
        this.disposable.dispose();
    }
    onServerStatusChanged(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const isError = this.serverStatus !== e.status && e.status === 4 /* ServerStatus.ERROR */;
            this.serverStatus = e.status;
            this.render();
            if (isError) {
                yield this.context.statusProvider.restartSorbet(types_1.RestartReason.CRASH_EXT_ERROR);
            }
        });
    }
    getSpinner() {
        if (this.spinnerTimer) {
            clearTimeout(this.spinnerTimer);
        }
        // Animate the spinner with setTimeout.
        this.spinnerTimer = setTimeout(() => this.render(), 250);
        return this.spinner();
    }
    render() {
        var _a;
        const { operations } = this.context.statusProvider;
        const { activeLspConfig } = this.context.configuration;
        const sorbetName = (_a = activeLspConfig === null || activeLspConfig === void 0 ? void 0 : activeLspConfig.name) !== null && _a !== void 0 ? _a : "Sorbet";
        let text;
        let tooltip;
        // Errors should suppress operation animations / feedback.
        if (activeLspConfig &&
            this.serverStatus !== 4 /* ServerStatus.ERROR */ &&
            operations.length > 0) {
            const latestOp = operations[operations.length - 1];
            text = `${sorbetName}: ${latestOp.description} ${this.getSpinner()}`;
            tooltip = "The Sorbet server is currently running.";
        }
        else {
            switch (this.serverStatus) {
                case 0 /* ServerStatus.DISABLED */:
                    text = `${sorbetName}: Disabled`;
                    tooltip = "The Sorbet server is disabled.";
                    break;
                case 4 /* ServerStatus.ERROR */:
                    text = `${sorbetName}: Error`;
                    tooltip = "Click for remediation items.";
                    const { serverError } = this.context.statusProvider;
                    if (serverError) {
                        tooltip = `${serverError}\n${tooltip}`;
                    }
                    break;
                case 2 /* ServerStatus.INITIALIZING */:
                    text = `${sorbetName}: Initializing ${this.getSpinner()}`;
                    tooltip = "The Sorbet server is initializing.";
                    break;
                case 1 /* ServerStatus.RESTARTING */:
                    text = `${sorbetName}: Restarting ${this.getSpinner()}`;
                    tooltip = "The Sorbet server is restarting.";
                    break;
                case 3 /* ServerStatus.RUNNING */:
                    text = `${sorbetName}: Idle`;
                    tooltip = "The Sorbet server is currently running.";
                    break;
                default:
                    this.context.log.error(`Invalid ServerStatus: ${this.serverStatus}`);
                    text = "";
                    tooltip = "";
                    break;
            }
        }
        this.statusBarItem.text = text;
        this.statusBarItem.tooltip = tooltip;
    }
}
exports.SorbetStatusBarEntry = SorbetStatusBarEntry;
//# sourceMappingURL=sorbetStatusBarEntry.js.map