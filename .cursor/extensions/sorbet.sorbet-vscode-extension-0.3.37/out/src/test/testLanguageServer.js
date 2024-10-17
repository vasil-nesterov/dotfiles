"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const testLanguageServerSpecialURIs_1 = require("./testLanguageServerSpecialURIs");
// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
connection.onInitialize((_) => {
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Full,
            // Tell the client that the server supports code completion
            completionProvider: {
                resolveProvider: true,
            },
        },
    };
});
connection.onInitialized(() => { });
connection.onHover((e) => {
    switch (e.textDocument.uri) {
        case testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.SUCCESS:
            return { contents: testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.SUCCESS };
        case testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.FAILURE:
            throw new Error(testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.FAILURE);
        case testLanguageServerSpecialURIs_1.TestLanguageServerSpecialURIs.EXIT:
            process.exit(1);
            break; // Unreachable, but eslint doesn't know that.
        default:
            throw new Error("Invalid request.");
    }
});
// Listen on the connection
connection.listen();
//# sourceMappingURL=testLanguageServer.js.map