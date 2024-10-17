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
exports.copySymbolToClipboard = void 0;
const vscode_1 = require("vscode");
/**
 * Copy symbol at current.
 * @param context Sorbet extension context.
 */
function copySymbolToClipboard(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { activeLanguageClient: client } = context.statusProvider;
        if (!client) {
            context.log.warning("CopySymbol: No active Sorbet LSP.");
            return;
        }
        if (!((_a = client.capabilities) === null || _a === void 0 ? void 0 : _a.sorbetShowSymbolProvider)) {
            context.log.warning("CopySymbol: Sorbet LSP does not support 'showSymbol' capability.");
            return;
        }
        const editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            context.log.debug("CopySymbol: No active editor, no target symbol.");
            return;
        }
        if (!editor.selection.isEmpty) {
            context.log.debug("CopySymbol: Non-empty selection, cannot determine target symbol.");
            return;
        }
        if (client.status !== 3 /* ServerStatus.RUNNING */) {
            context.log.warning("CopySymbol: Sorbet LSP is not ready.");
            return;
        }
        const position = editor.selection.active;
        const params = {
            textDocument: {
                uri: editor.document.uri.toString(),
            },
            position,
        };
        let response;
        if (context.statusProvider.operations.length) {
            response = yield vscode_1.window.withProgress({
                cancellable: true,
                location: vscode_1.ProgressLocation.Notification,
            }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
                progress.report({ message: "Querying Sorbet …" });
                const r = yield client.sendRequest("sorbet/showSymbol", params);
                if (token.isCancellationRequested) {
                    context.log.debug(`CopySymbol: Ignored canceled operation result. Symbol:${r.name}`);
                    return undefined;
                }
                else {
                    return r;
                }
            }));
        }
        else {
            response = yield client.sendRequest("sorbet/showSymbol", params);
        }
        if (response) {
            yield vscode_1.env.clipboard.writeText(response.name);
            context.log.debug(`CopySymbol: Copied symbol name. Symbol:${response.name}`);
        }
    });
}
exports.copySymbolToClipboard = copySymbolToClipboard;
//# sourceMappingURL=copySymbolToClipboard.js.map