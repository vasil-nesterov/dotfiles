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
const path = require("path");
const sinon = require("sinon");
const testUtils_1 = require("./testUtils");
const metricsClient_1 = require("../metricsClient");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("emitCountMetric calls MetricsEmitter.increment once with correct params ", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedMetricName = "metricClient.test.emitCountMetric";
        const expectedCount = 123;
        const expectedTags = { foo: "bar" };
        const incrementStub = sinon.stub(metricsClient_1.NoOpMetricsEmitter.prototype, "increment");
        testRestorables.push(incrementStub);
        const client = new metricsClient_1.MetricClient({
            configuration: {
                activeLspConfig: undefined,
            },
            log: (0, testUtils_1.createLogStub)(),
        }, new metricsClient_1.NoOpApi());
        yield client.emitCountMetric(expectedMetricName, expectedCount, expectedTags);
        sinon.assert.calledTwice(incrementStub);
        sinon.assert.calledWithMatch(incrementStub.secondCall, `${metricsClient_1.METRIC_PREFIX}${expectedMetricName}`, expectedCount, expectedTags);
    }));
    test("emitTimingMetric calls MetricsEmitter.timing once with correct params ", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedMetricName = "metricClient.test.emitCountMetric";
        const expectedCount = 123;
        const expectedTags = { foo: "bar" };
        const timingStub = sinon.stub(metricsClient_1.NoOpMetricsEmitter.prototype, "timing");
        testRestorables.push(timingStub);
        const client = new metricsClient_1.MetricClient({
            configuration: {
                activeLspConfig: undefined,
            },
            log: (0, testUtils_1.createLogStub)(),
        }, new metricsClient_1.NoOpApi());
        yield client.emitTimingMetric(expectedMetricName, expectedCount, expectedTags);
        sinon.assert.calledOnce(timingStub);
        sinon.assert.calledWithMatch(timingStub, `${metricsClient_1.METRIC_PREFIX}${expectedMetricName}`, expectedCount, expectedTags);
    }));
});
//# sourceMappingURL=metricsClient.test.js.map