"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.getFilePath = exports.getSourceFileName = exports.getTestFileName = exports.defaultTestFilePattern = exports.fileNameWithoutExtension = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fileExtensionRegex = new RegExp(/(?:\.([^.]+))?$/);
const fileNameWithoutExtension = (uri, extension) => {
    var _a, _b;
    return (((_b = (_a = uri.fsPath
        .split("\\")
        .pop()) === null || _a === void 0 ? void 0 : _a.split("/").pop()) === null || _b === void 0 ? void 0 : _b.replace(`.${extension}`, "")) || "BLA");
};
exports.fileNameWithoutExtension = fileNameWithoutExtension;
const defaultTestFilePattern = (fileExtension) => `%source_file%_test.${fileExtension}`;
exports.defaultTestFilePattern = defaultTestFilePattern;
const getTestFileName = (sourceFileUri) => {
    const fileEnding = fileExtensionRegex.exec(sourceFileUri.fsPath)[1];
    const defaultPattern = exports.defaultTestFilePattern(fileEnding);
    const pattern = vscode.workspace
        .getConfiguration("goto-test.testFilePatterns")
        .get(fileEnding) || defaultPattern;
    const sourceFileName = exports.fileNameWithoutExtension(sourceFileUri, fileEnding);
    const testFileName = pattern.replace("%source_file%", sourceFileName);
    return testFileName;
};
exports.getTestFileName = getTestFileName;
const getSourceFileName = (testFileUri) => {
    const fileEnding = fileExtensionRegex.exec(testFileUri.fsPath)[1];
    const testFileName = exports.fileNameWithoutExtension(testFileUri, fileEnding);
    const defaultPattern = `%source_file%.${fileEnding}`;
    let pattern = defaultPattern;
    const config = vscode.workspace.getConfiguration("goto-test.testFilePatterns");
    Object.keys(config)
        .forEach(key => {
        const value = config.get(key) || "";
        if (value.endsWith(`.${fileEnding}`)) {
            pattern = `%source_file%.${key}`;
        }
    });
    const sourceFileName = pattern.replace("%source_file%", testFileName.replace(/[\W_]test/i, ""));
    return sourceFileName;
};
exports.getSourceFileName = getSourceFileName;
const getFilePath = (sourceFileUri, fileNameFn) => {
    if (sourceFileUri.scheme !== "file") {
        return null;
    }
    const testFileName = fileNameFn(sourceFileUri); //  getTestFileName(sourceFileUri);
    return testFileName;
};
exports.getFilePath = getFilePath;
const fileQuickPicks = (uris) => uris.map((uri) => {
    return { uri: uri, label: uri.fsPath };
});
const openFile = (testFileName) => {
    vscode.window.setStatusBarMessage(`Finding and switching to ${testFileName}`, vscode.workspace
        .findFiles(`**/${testFileName}`, undefined, 10)
        .then((uris) => {
        if (uris.length < 1) {
            vscode.window.showErrorMessage(`Couldn't find file: ${testFileName}`);
            return null;
        }
        else if (uris.length === 1) {
            return vscode.workspace.openTextDocument(uris[0]);
        }
        else {
            const quickPicks = fileQuickPicks(uris);
            return vscode.window
                .showQuickPick(quickPicks, {
                title: "More than one file candidate matches, pick one",
            })
                .then((quickPick) => {
                if (quickPick) {
                    return vscode.workspace.openTextDocument(quickPick.uri);
                }
                else {
                    return null;
                }
            });
        }
    })
        .then((doc) => {
        if (doc) {
            vscode.window.showTextDocument(doc);
        }
    }, (error) => vscode.window.showErrorMessage(error)));
};
const openTestFileFromActiveSourceFile = () => {
    var _a;
    const activeFileUri = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
    if (activeFileUri) {
        const testFileName = exports.getFilePath(activeFileUri, exports.getTestFileName);
        if (testFileName) {
            openFile(testFileName);
        }
    }
};
const openSourceFileFromActiveTestFile = () => {
    var _a;
    const activeFileUri = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
    if (activeFileUri) {
        const sourceFileName = exports.getFilePath(activeFileUri, exports.getSourceFileName);
        if (sourceFileName) {
            openFile(sourceFileName);
        }
    }
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "goto-test" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let goToTestFile = vscode.commands.registerCommand("goto-test.gotoTestFile", openTestFileFromActiveSourceFile);
    let goToSourceFile = vscode.commands.registerCommand("goto-test.gotoSourceFile", openSourceFileFromActiveTestFile);
    context.subscriptions.push(goToTestFile);
    context.subscriptions.push(goToSourceFile);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map