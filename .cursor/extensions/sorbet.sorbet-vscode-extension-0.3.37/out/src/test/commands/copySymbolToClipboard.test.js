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
const path = require("path");
const sinon = require("sinon");
const testUtils_1 = require("../testUtils");
const copySymbolToClipboard_1 = require("../../commands/copySymbolToClipboard");
const log_1 = require("../../log");
suite(`Test Suite: ${path.basename(__filename, ".test.js")}`, () => {
    let testRestorables;
    setup(() => {
        testRestorables = [];
    });
    teardown(() => {
        testRestorables.forEach((r) => r.restore());
    });
    test("copySymbolToClipboard: does nothing if client is not present", () => __awaiter(void 0, void 0, void 0, function* () {
        const writeTextSpy = sinon.spy();
        const envClipboardStub = sinon.stub(vscode, "env").value({
            clipboard: {
                writeText: writeTextSpy,
            },
        });
        testRestorables.push(envClipboardStub);
        const statusProvider = {
            activeLanguageClient: undefined,
        };
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        yield (0, copySymbolToClipboard_1.copySymbolToClipboard)(context);
        sinon.assert.notCalled(writeTextSpy);
    }));
    test("copySymbolToClipboard: does nothing if client is not ready", () => __awaiter(void 0, void 0, void 0, function* () {
        const writeTextSpy = sinon.spy();
        const envClipboardStub = sinon.stub(vscode, "env").value({
            clipboard: {
                writeText: writeTextSpy,
            },
        });
        testRestorables.push(envClipboardStub);
        const statusProvider = {
            activeLanguageClient: {
                status: 0 /* ServerStatus.DISABLED */,
            },
        };
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        yield (0, copySymbolToClipboard_1.copySymbolToClipboard)(context);
        sinon.assert.notCalled(writeTextSpy);
    }));
    test("copySymbolToClipboard: does nothing if client does not support `sorbetShowSymbolProvider`", () => __awaiter(void 0, void 0, void 0, function* () {
        const writeTextSpy = sinon.spy();
        const envClipboardStub = sinon.stub(vscode, "env").value({
            clipboard: {
                writeText: writeTextSpy,
            },
        });
        testRestorables.push(envClipboardStub);
        const statusProvider = {
            activeLanguageClient: {
                capabilities: {
                    sorbetShowSymbolProvider: false,
                },
                status: 3 /* ServerStatus.RUNNING */,
            },
        };
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        yield (0, copySymbolToClipboard_1.copySymbolToClipboard)(context);
        sinon.assert.notCalled(writeTextSpy);
    }));
    test("copySymbolToClipboard: copies symbol to clipboard when there is a valid selection", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedUri = vscode.Uri.parse("file://workspace/test.rb");
        const expectedSymbolName = "test_symbol_name";
        const writeTextSpy = sinon.spy();
        const envClipboardStub = sinon.stub(vscode, "env").value({
            clipboard: {
                writeText: writeTextSpy,
            },
        });
        testRestorables.push(envClipboardStub);
        const activeTextEditorStub = sinon
            .stub(vscode.window, "activeTextEditor")
            .get(() => ({
            document: { uri: expectedUri },
            selection: new vscode.Selection(1, 1, 1, 1),
        }));
        testRestorables.push(activeTextEditorStub);
        const sendRequestSpy = sinon.spy((_method, _param) => ({
            name: expectedSymbolName,
        }));
        const statusProvider = {
            activeLanguageClient: {
                capabilities: {
                    sorbetShowSymbolProvider: true,
                },
                sendRequest: sendRequestSpy,
                status: 3 /* ServerStatus.RUNNING */,
            },
            operations: [],
        };
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        yield (0, copySymbolToClipboard_1.copySymbolToClipboard)(context);
        sinon.assert.calledOnce(writeTextSpy);
        sinon.assert.calledWith(writeTextSpy, expectedSymbolName);
        sinon.assert.calledOnce(sendRequestSpy);
        sinon.assert.calledWith(sendRequestSpy, "sorbet/showSymbol", sinon.match.object);
    }));
    test("copySymbolToClipboard: shows progress dialog when Sorbet is not ready", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedUri = vscode.Uri.parse("file://workspace/test.rb");
        const expectedSymbolName = "test_symbol_name";
        const writeTextSpy = sinon.spy();
        const envClipboardStub = sinon.stub(vscode, "env").value({
            clipboard: {
                writeText: writeTextSpy,
            },
        });
        testRestorables.push(envClipboardStub);
        const activeTextEditorStub = sinon
            .stub(vscode.window, "activeTextEditor")
            .get(() => ({
            document: { uri: expectedUri },
            selection: new vscode.Selection(1, 1, 1, 1),
        }));
        testRestorables.push(activeTextEditorStub);
        const progressStub = sinon.stub(vscode.window, "withProgress").resolves({
            name: expectedSymbolName,
        });
        testRestorables.push(progressStub);
        const statusProvider = {
            activeLanguageClient: {
                capabilities: {
                    sorbetShowSymbolProvider: true,
                },
                status: 3 /* ServerStatus.RUNNING */,
            },
            operations: [
                {
                    description: "Test operation",
                    operationName: "TestOperation",
                    status: "start",
                },
            ],
        };
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        yield (0, copySymbolToClipboard_1.copySymbolToClipboard)(context);
        sinon.assert.calledOnce(writeTextSpy);
        sinon.assert.calledWith(writeTextSpy, expectedSymbolName);
        sinon.assert.calledOnce(progressStub);
    }));
    test("copySymbolToClipboard: exits gracefully when cancelled", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedUri = vscode.Uri.parse("file://workspace/test.rb");
        const writeTextSpy = sinon.spy();
        const envClipboardStub = sinon.stub(vscode, "env").value({
            clipboard: {
                writeText: writeTextSpy,
            },
        });
        testRestorables.push(envClipboardStub);
        const activeTextEditorStub = sinon
            .stub(vscode.window, "activeTextEditor")
            .get(() => ({
            document: { uri: expectedUri },
            selection: new vscode.Selection(1, 1, 1, 1),
        }));
        testRestorables.push(activeTextEditorStub);
        const progressStub = sinon
            .stub(vscode.window, "withProgress")
            .resolves(undefined); // Canceled
        testRestorables.push(progressStub);
        const statusProvider = {
            activeLanguageClient: {
                capabilities: {
                    sorbetShowSymbolProvider: true,
                },
                status: 3 /* ServerStatus.RUNNING */,
            },
            operations: [
                {
                    description: "Test operation",
                    operationName: "TestOperation",
                    status: "start",
                },
            ],
        };
        const context = {
            log: (0, testUtils_1.createLogStub)(log_1.LogLevel.Info),
            statusProvider,
        };
        yield (0, copySymbolToClipboard_1.copySymbolToClipboard)(context);
        sinon.assert.calledOnce(progressStub);
        sinon.assert.notCalled(writeTextSpy);
    }));
});
//# sourceMappingURL=copySymbolToClipboard.test.js.map