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
const vscode = require("vscode");
const assert = require("assert");
const path = require("path");
const sinon = require("sinon");
const testUtils_1 = require("./testUtils");
const log_1 = require("../log");
const sorbetContentProvider_1 = require("../sorbetContentProvider");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("provideTextDocumentContent succeeds", () => __awaiter(void 0, void 0, void 0, function* () {
        const fileUri = vscode.Uri.parse("sorbet:/test/file", true);
        const expectedContents = "";
        const sendRequestSpy = sinon.spy((_method, _params) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                text: expectedContents,
            });
        }));
        const statusProvider = {
            activeLanguageClient: {
                sendRequest: sendRequestSpy,
            },
        };
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        const provider = new sorbetContentProvider_1.SorbetContentProvider(context);
        assert.strictEqual(yield provider.provideTextDocumentContent(fileUri), expectedContents);
        sinon.assert.calledOnce(sendRequestSpy);
        sinon.assert.calledWith(sendRequestSpy, "sorbet/readFile", {
            uri: fileUri.toString(),
        });
    }));
    test("provideTextDocumentContent handles no activeLanguageClient", () => __awaiter(void 0, void 0, void 0, function* () {
        const fileUri = vscode.Uri.parse("sorbet:/test/file", true);
        const statusProvider = {};
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        const provider = new sorbetContentProvider_1.SorbetContentProvider(context);
        assert.strictEqual(yield provider.provideTextDocumentContent(fileUri), "");
    }));
});
//# sourceMappingURL=sorbetContentProvider.test.js.map