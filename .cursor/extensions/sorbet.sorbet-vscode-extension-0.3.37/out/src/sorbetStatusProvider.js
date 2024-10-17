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
exports.SorbetStatusProvider = void 0;
const vscode_1 = require("vscode");
const languageClient_1 = require("./languageClient");
const MIN_TIME_BETWEEN_RETRIES_MS = 7000;
class SorbetStatusProvider {
    constructor(context) {
        this.context = context;
        this.isStarting = false;
        this.lastSorbetRetryTime = 0;
        this.operationStack = [];
        this.onShowOperationEmitter = new vscode_1.EventEmitter();
        this.onStatusChangedEmitter = new vscode_1.EventEmitter();
        this.disposables = [
            this.onShowOperationEmitter,
            this.onStatusChangedEmitter,
        ];
    }
    /**
     * Dispose and free associated resources.
     */
    dispose() {
        vscode_1.Disposable.from(...this.disposables).dispose();
    }
    /**
     * Current Sorbet client, if any.
     */
    get activeLanguageClient() {
        return this.wrappedActiveLanguageClient;
    }
    set activeLanguageClient(value) {
        if (this.wrappedActiveLanguageClient === value) {
            return;
        }
        // Clean-up existing client, if any.
        if (this.wrappedActiveLanguageClient) {
            this.wrappedActiveLanguageClient.dispose();
            const i = this.disposables.indexOf(this.wrappedActiveLanguageClient);
            if (i !== -1) {
                this.disposables.splice(i, 1);
            }
        }
        // Hook-up new client for clean-up, if any.
        if (value) {
            const i = this.disposables.indexOf(value);
            if (i === -1) {
                this.disposables.push(value);
            }
        }
        this.wrappedActiveLanguageClient = value;
        // State might have changed based on new client.
        if (this.wrappedActiveLanguageClient) {
            this.fireOnStatusChanged({
                status: this.wrappedActiveLanguageClient.status,
                error: this.wrappedActiveLanguageClient.lastError,
            });
        }
    }
    /**
     * Raise {@link onShowOperation} event. Prefer this over calling
     * {@link EventEmitter.fire} directly so known state is updated before
     * event listeners are notified. Spurious events are filtered out.
     */
    fireOnShowOperation(data) {
        let changed = false;
        if (data.status === "end") {
            const filteredOps = this.operationStack.filter((otherP) => otherP.operationName !== data.operationName);
            if (filteredOps.length !== this.operationStack.length) {
                this.operationStack = filteredOps;
                changed = true;
            }
        }
        else {
            this.operationStack.push(data);
            changed = true;
        }
        if (changed) {
            this.onShowOperationEmitter.fire(data);
        }
    }
    /**
     * Raise {@link onServerStatusChanged} event. Prefer this over calling
     * {@link EventEmitter.fire} directly so known state is updated before
     * event listeners are notified.
     */
    fireOnStatusChanged(data) {
        if (data.stopped) {
            this.operationStack = [];
        }
        this.onStatusChangedEmitter.fire(data);
    }
    /**
     * Sorbet client current operation stack.
     */
    get operations() {
        return this.operationStack;
    }
    /**
     * Event raised on a {@link ShowOperationParams show-operation} event.
     */
    get onShowOperation() {
        return this.onShowOperationEmitter.event;
    }
    /**
     * Event raised on {@link ServerStatus status} changes.
     */
    get onStatusChanged() {
        return this.onStatusChangedEmitter.event;
    }
    /**
     * Restart Sorbet.
     * @param reason Telemetry reason.
     */
    restartSorbet(reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopSorbet(1 /* ServerStatus.RESTARTING */);
            // `reason` is an enum type with a small and finite number of values.
            this.context.metrics.emitCountMetric(`restart.${reason}`, 1);
            yield this.startSorbet();
        });
    }
    /**
     * Error information, if {@link serverStatus} is {@link ServerStatus.ERROR}
     */
    get serverError() {
        var _a;
        return (_a = this.activeLanguageClient) === null || _a === void 0 ? void 0 : _a.lastError;
    }
    /**
     * Return current {@link ServerStatus server status}.
     */
    get serverStatus() {
        var _a;
        return ((_a = this.activeLanguageClient) === null || _a === void 0 ? void 0 : _a.status) || 0 /* ServerStatus.DISABLED */;
    }
    /**
     * Start Sorbet.
     */
    startSorbet() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isStarting) {
                this.context.log.trace("Ignored start request, already starting.");
                return;
            }
            if (!this.context.configuration.activeLspConfig) {
                this.context.log.info("Ignored start request, no active configuration. See https://sorbet.org/docs/vscode");
                return;
            }
            // Debounce by MIN_TIME_BETWEEN_RETRIES_MS. Returns 0 if the calculated time to sleep is negative.
            const sleepMS = MIN_TIME_BETWEEN_RETRIES_MS - (Date.now() - this.lastSorbetRetryTime);
            if (sleepMS > 0) {
                // Wait timeToSleep ms. Use mutex, as this yields the event loop for future events.
                this.context.log.debug(`Waiting ${sleepMS.toFixed(0)}ms before restarting Sorbet…`);
                this.isStarting = true;
                yield new Promise((res) => setTimeout(res, sleepMS));
                this.isStarting = false;
            }
            this.lastSorbetRetryTime = Date.now();
            // Create client
            const newClient = new languageClient_1.SorbetLanguageClient(this.context, (reason) => this.restartSorbet(reason));
            // Use property-setter to ensure proper setup.
            this.activeLanguageClient = newClient;
            this.disposables.push(newClient.onStatusChange((status) => {
                // Ignore event if this is not the current client (e.g. old client being shut down).
                if (this.activeLanguageClient === newClient) {
                    this.fireOnStatusChanged({
                        status,
                        error: newClient.lastError,
                    });
                }
            }));
            // Wait for `ready` before accessing `languageClient`.
            yield newClient.onReady();
            this.disposables.push(newClient.onNotification("sorbet/showOperation", (params) => {
                // Ignore event if this is not the current client (e.g. old client being shut down).
                if (this.activeLanguageClient === newClient) {
                    this.fireOnShowOperation(params);
                }
            }));
        });
    }
    /**
     * Stop Sorbet.
     * @param newStatus Status to report.
     */
    stopSorbet(newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use property-setter to ensure proper clean-up.
            this.activeLanguageClient = undefined;
            this.fireOnStatusChanged({ status: newStatus, stopped: true });
        });
    }
}
exports.SorbetStatusProvider = SorbetStatusProvider;
//# sourceMappingURL=sorbetStatusProvider.js.map