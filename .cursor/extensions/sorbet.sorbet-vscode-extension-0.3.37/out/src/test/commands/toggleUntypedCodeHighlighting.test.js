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
const vscode = require("vscode");
const path = require("path");
const sinon = require("sinon");
const testUtils_1 = require("../testUtils");
const toggleUntypedCodeHighlighting_1 = require("../../commands/toggleUntypedCodeHighlighting");
const config_1 = require("../../config");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("toggleUntypedCodeHighlighting", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialState = "everywhere";
        let currentState = initialState;
        const log = (0, testUtils_1.createLogStub)();
        const setHighlightUntypedSpy = sinon.spy((value) => {
            currentState = value;
        });
        const configuration = {
            get highlightUntyped() {
                return currentState;
            },
            setHighlightUntyped: setHighlightUntypedSpy,
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
        assert.strictEqual(yield (0, toggleUntypedCodeHighlighting_1.toggleUntypedCodeHighlighting)(context), "nowhere");
        sinon.assert.calledOnce(setHighlightUntypedSpy);
        sinon.assert.calledWithExactly(setHighlightUntypedSpy, "nowhere");
    }));
    test("configureUntypedCodeHighlighting", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialState = "everywhere";
        let currentState = initialState;
        const log = (0, testUtils_1.createLogStub)();
        const setHighlightUntypedSpy = sinon.spy((value) => {
            currentState = value;
        });
        const configuration = {
            get highlightUntyped() {
                return currentState;
            },
            setHighlightUntyped: setHighlightUntypedSpy,
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
        const expectedTrackWhere = "everywhere-but-tests";
        const showQuickPickSingleStub = sinon
            .stub(vscode.window, "showQuickPick")
            .resolves({
            label: (0, config_1.labelForTrackUntypedSetting)(expectedTrackWhere),
            trackWhere: expectedTrackWhere,
        });
        testRestorables.push(showQuickPickSingleStub);
        assert.strictEqual(yield (0, toggleUntypedCodeHighlighting_1.configureUntypedCodeHighlighting)(context), expectedTrackWhere);
        sinon.assert.calledOnce(setHighlightUntypedSpy);
        sinon.assert.calledWithExactly(setHighlightUntypedSpy, expectedTrackWhere);
    }));
    test("toggle is sticky", () => __awaiter(void 0, void 0, void 0, function* () {
        const initialState = "everywhere-but-tests";
        let currentState = initialState;
        const log = (0, testUtils_1.createLogStub)();
        const setHighlightUntypedSpy = sinon.spy((value) => {
            currentState = value;
        });
        const configuration = {
            get highlightUntyped() {
                return currentState;
            },
            setHighlightUntyped: setHighlightUntypedSpy,
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
        assert.strictEqual(yield (0, toggleUntypedCodeHighlighting_1.toggleUntypedCodeHighlighting)(context), "nowhere");
        assert.strictEqual(yield (0, toggleUntypedCodeHighlighting_1.toggleUntypedCodeHighlighting)(context), initialState);
        sinon.assert.calledTwice(setHighlightUntypedSpy);
        sinon.assert.calledWithExactly(setHighlightUntypedSpy.getCall(0), "nowhere");
        sinon.assert.calledWithExactly(setHighlightUntypedSpy.getCall(1), initialState);
    }));
});
//# sourceMappingURL=toggleUntypedCodeHighlighting.test.js.map