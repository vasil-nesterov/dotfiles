"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorbetExtensionContext = void 0;
const vscode_1 = require("vscode");
const config_1 = require("./config");
const log_1 = require("./log");
const metricsClient_1 = require("./metricsClient");
const sorbetStatusProvider_1 = require("./sorbetStatusProvider");
class SorbetExtensionContext {
    constructor(context) {
        const sorbetWorkspaceContext = new config_1.DefaultSorbetWorkspaceContext(context);
        this.configuration = new config_1.SorbetExtensionConfig(sorbetWorkspaceContext);
        this.extensionContext = context;
        this.wrappedLog = new log_1.OutputChannelLog("Sorbet");
        this.metrics = new metricsClient_1.MetricClient(this);
        this.statusProvider = new sorbetStatusProvider_1.SorbetStatusProvider(this);
        this.disposable = vscode_1.Disposable.from(sorbetWorkspaceContext, this.configuration, this.statusProvider, this.wrappedLog);
    }
    /**
     * Dispose and free associated resources.
     */
    dispose() {
        this.disposable.dispose();
    }
    /**
     * Logger.
     */
    get log() {
        return this.wrappedLog;
    }
    /**
     * Output channel used by {@link log}. This is exposed separately to promote
     * use of the {@link Log} interface instead of accessing the UI component.
     */
    get logOutputChannel() {
        return this.wrappedLog.outputChannel;
    }
}
exports.SorbetExtensionContext = SorbetExtensionContext;
//# sourceMappingURL=sorbetExtensionContext.js.map