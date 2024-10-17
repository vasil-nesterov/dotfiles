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
const node_1 = require("vscode-languageclient/node");
const vscode_languageserver_protocol_1 = require("vscode-languageserver-protocol");
const assert = require("assert");
const languageClient_1 = require("../languageClient");
const testLanguageServerSpecialURIs_1 = require("./testLanguageServerSpecialURIs");
class RecordingMetricsEmitter {
    constructor() {
        this.metrics = [];
    }
    getAndResetMetrics() {
        const rv = this.metrics;
        this.metrics = [];
        return rv;
    }
    increment(metricName, count = 1, tags = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.metrics.push([0 /* MetricType.Increment */, metricName, count, tags]);
        });
    }
    gauge(metricName, value, tags = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this.metrics.push([1 /* MetricType.Gauge */, metricName, value, tags]);
        });
    }
    timing(metricName, value, tags = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawValue = typeof value === "number" ? value : Date.now() - value.valueOf();
            this.metrics.push([2 /* MetricType.Timing */, metricName, rawValue, tags]);
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            // No-op
        });
    }
}
function createLanguageClient() {
    // The server is implemented in node
    const serverModule = require.resolve("./testLanguageServer");
    // The debug options for the server
    const debugOptions = { execArgv: [] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions,
        },
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: "file", language: "plaintext" }],
        synchronize: {},
    };
    // Create the language client and start the client.
    const client = new node_1.LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
    return client;
}
let metricsEmitter = new RecordingMetricsEmitter();
suite("LanguageClient", () => {
    suite("Metrics", () => {
        suiteSetup(() => {
            metricsEmitter = new RecordingMetricsEmitter();
        });
        test("Shims language clients and records latency metrics", () => __awaiter(void 0, void 0, void 0, function* () {
            const client = (0, languageClient_1.shimLanguageClient)(createLanguageClient(), metricsEmitter.timing.bind(metricsEmitter));
            yield client.onReady();
            {
                const successResponse = yield client.sendRequest("textDocument/hover", {
                    textDocument: {
                        uri: testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.SUCCESS,
                    },
                    position: { line: 1, character: 1 },
                });
                assert.strictEqual(successResponse.contents, testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.SUCCESS);
                const metrics = metricsEmitter.getAndResetMetrics();
                assert.strictEqual(metrics.length, 1);
                const m = metrics[0];
                assert.strictEqual(m[0], 2 /* MetricType.Timing */);
                assert.strictEqual(m[1], "latency.textDocument_hover_ms");
                assert.strictEqual(m[3].success, "true");
            }
            {
                const successResponse = yield client.sendRequest(new vscode_languageserver_protocol_1.RequestType("textDocument/hover"), {
                    textDocument: {
                        uri: testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.SUCCESS,
                    },
                    position: { line: 1, character: 1 },
                });
                assert.strictEqual(successResponse.contents, testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.SUCCESS);
                const metrics = metricsEmitter.getAndResetMetrics();
                assert.strictEqual(metrics.length, 1);
                const m = metrics[0];
                assert.strictEqual(m[0], 2 /* MetricType.Timing */);
                assert.strictEqual(m[1], "latency.textDocument_hover_ms");
                assert.strictEqual(m[3].success, "true");
            }
            try {
                yield client.sendRequest("textDocument/hover", {
                    textDocument: {
                        uri: testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.FAILURE,
                    },
                    position: { line: 1, character: 1 },
                });
                assert.fail("Request should have failed.");
            }
            catch (e) {
                assert(e.message.indexOf(testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.FAILURE) !== -1);
                const metrics = metricsEmitter.getAndResetMetrics();
                assert.strictEqual(metrics.length, 1);
                const m = metrics[0];
                assert.strictEqual(m[0], 2 /* MetricType.Timing */);
                assert.strictEqual(m[1], "latency.textDocument_hover_ms");
                assert.strictEqual(m[3].success, "false");
            }
            try {
                yield client.sendRequest("textDocument/hover", {
                    textDocument: {
                        uri: testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.EXIT,
                    },
                    position: { line: 1, character: 1 },
                });
                assert.fail("Request should have failed.");
            }
            catch (e) {
                const metrics = metricsEmitter.getAndResetMetrics();
                assert.strictEqual(metrics.length, 1);
                const m = metrics[0];
                assert.strictEqual(m[0], 2 /* MetricType.Timing */);
                assert.strictEqual(m[1], "latency.textDocument_hover_ms");
                assert.strictEqual(m[3].success, "false");
            }
        }));
    });
});
//# sourceMappingURL=languageClient.test.js.map