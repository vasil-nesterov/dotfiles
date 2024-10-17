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
const assert = require("assert");
const path = require("path");
const sinon = require("sinon");
const testUtils_1 = require("../testUtils");
const toggleTypedFalseCompletionNudges_1 = require("../../commands/toggleTypedFalseCompletionNudges");
const types_1 = require("../../types");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("toggleTypedFalseCompletionNudges", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialState = true;
        let currentState = initialState;
        const log = (0, testUtils_1.createLogStub)();
        const setTypedFalseCompletionNudgesSpy = sinon.spy((value) => {
            currentState = value;
        });
        const configuration = {
            get typedFalseCompletionNudges() {
                return currentState;
            },
            setTypedFalseCompletionNudges: setTypedFalseCompletionNudgesSpy,
        };
        const restartSorbetSpy = sinon.spy((_reason) => { });
        const statusProvider = {
            restartSorbet: restartSorbetSpy,
        };
        const context = {
            log,
            configuration,
            statusProvider,
        };
        assert.strictEqual(yield (0, toggleTypedFalseCompletionNudges_1.toggleTypedFalseCompletionNudges)(context), !initialState);
        sinon.assert.calledOnce(setTypedFalseCompletionNudgesSpy);
        sinon.assert.calledWithExactly(setTypedFalseCompletionNudgesSpy, !initialState);
        sinon.assert.calledOnce(restartSorbetSpy);
        sinon.assert.calledWithExactly(restartSorbetSpy, types_1.RestartReason.CONFIG_CHANGE);
    }));
});
//# sourceMappingURL=toggleTypedFalseCompletionNudges.test.js.map