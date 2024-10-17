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
exports.MetricClient = exports.NoOpApi = exports.NoOpMetricsEmitter = exports.METRIC_PREFIX = void 0;
const vscode_1 = require("vscode");
exports.METRIC_PREFIX = "ruby_typer.lsp.extension.";
class NoOpMetricsEmitter {
    increment(_metricName, _count, _tags) {
        return __awaiter(this, void 0, void 0, function* () { });
    } // eslint-disable-line no-empty-function
    gauge(_metricName, _value, _tags) {
        return __awaiter(this, void 0, void 0, function* () { });
    } // eslint-disable-line no-empty-function
    timing(_metricName, _value, _tags) {
        return __awaiter(this, void 0, void 0, function* () { });
    } // eslint-disable-line no-empty-function
    flush() {
        return __awaiter(this, void 0, void 0, function* () { });
    } // eslint-disable-line no-empty-function
}
exports.NoOpMetricsEmitter = NoOpMetricsEmitter;
class NoOpApi {
    constructor() {
        this.metricsEmitter = new NoOpMetricsEmitter();
    }
}
exports.NoOpApi = NoOpApi;
NoOpApi.INSTANCE = new NoOpApi();
class MetricClient {
    /**
     * Constructor.
     * @param context Extension context.
     * @param api API instance. This is intended for tests only.
     */
    constructor(context, api) {
        var _a;
        this.apiPromise = api ? Promise.resolve(api) : this.initSorbetMetricsApi();
        this.context = context;
        const sorbetExtension = vscode_1.extensions.getExtension("sorbet.sorbet-vscode-extension");
        this.sorbetExtensionVersion =
            (_a = sorbetExtension === null || sorbetExtension === void 0 ? void 0 : sorbetExtension.packageJSON.version) !== null && _a !== void 0 ? _a : "unknown";
        this.emitCountMetric("metrics_client_initialized", 1);
    }
    /**
     * Build a tag set.
     * @param tags Tags to add to, or override, default ones.
     * @returns Tag set.
     */
    buildTags(tags) {
        var _a, _b;
        return Object.assign({ config_id: (_b = (_a = this.context.configuration.activeLspConfig) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "disabled", sorbet_extension_version: this.sorbetExtensionVersion }, tags);
    }
    initSorbetMetricsApi() {
        return __awaiter(this, void 0, void 0, function* () {
            let sorbetMetricsApi;
            try {
                const api = yield vscode_1.commands.executeCommand("sorbet.metrics.getExportedApi");
                if (api) {
                    this.context.log.info("Metrics-gathering initialized.");
                    sorbetMetricsApi = api;
                    if (!sorbetMetricsApi.metricsEmitter.timing) {
                        this.context.log.info("Timer metrics disabled (unsupported API).");
                        sorbetMetricsApi = NoOpApi.INSTANCE;
                    }
                }
                else {
                    this.context.log.info("Metrics-gathering disabled (no API)");
                    sorbetMetricsApi = NoOpApi.INSTANCE;
                }
            }
            catch (reason) {
                sorbetMetricsApi = NoOpApi.INSTANCE;
                const adjustedReason = (reason === null || reason === void 0 ? void 0 : reason.message) ===
                    "command 'sorbet.metrics.getExportedApi' not found"
                    ? "Define the 'sorbet.metrics.getExportedApi' command to enable metrics gathering"
                    : reason.message;
                this.context.log.error(`Metrics-gathering disabled (error): ${adjustedReason}`);
            }
            return sorbetMetricsApi;
        });
    }
    /**
     * Emit a count metric.
     * @param metric Metric name.
     * @param count Metric count.
     * @param extraTags Tags to attach to metric.
     */
    emitCountMetric(metric, count, extraTags = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.apiPromise;
            if (!api) {
                return;
            }
            const fullName = `${exports.METRIC_PREFIX}${metric}`;
            const tags = this.buildTags(extraTags);
            api.metricsEmitter.increment(fullName, count, tags);
        });
    }
    /**
     * Emit a time metric.
     * @param metric Metric name.
     * @param time Time.
     * @param extraTags Tags to attach to metric.
     */
    emitTimingMetric(metric, time, extraTags = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = yield this.apiPromise;
            if (!(api === null || api === void 0 ? void 0 : api.metricsEmitter.timing)) {
                // Ignore timers if metrics extension does not support them.
                return;
            }
            const fullName = `${exports.METRIC_PREFIX}${metric}`;
            const tags = this.buildTags(extraTags);
            api.metricsEmitter.timing(fullName, time, tags);
        });
    }
}
exports.MetricClient = MetricClient;
//# sourceMappingURL=metricsClient.js.map