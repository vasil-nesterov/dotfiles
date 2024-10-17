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
// Modified from https://code.visualstudio.com/api/working-with-extensions/testing-extension
const path_1 = require("path");
const fs_1 = require("fs");
const vscode_test_1 = require("vscode-test");
function usage() {
    console.error('usage: run_tests [path/to/extension] [path/to/extension/tests]');
}
function main(extensionDir, extensionTests) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // If not specified, then vscode-test will download VS Code.
            const vscodeExecutablePath = process.env.VSCODE_PATH;
            if (vscodeExecutablePath) {
                console.log(`Using VS Code at ${vscodeExecutablePath}`);
            }
            // The folder containing the Extension Manifest package.json
            // Passed to `--extensionDevelopmentPath`
            const extensionDevelopmentPath = (0, path_1.resolve)(extensionDir);
            const packageJsonPath = (0, path_1.join)(extensionDevelopmentPath, 'package.json');
            if (!(0, fs_1.existsSync)(packageJsonPath)) {
                console.error(`Unable to locate \`${packageJsonPath}\`. Did you pass the correct extension directory?`);
                usage();
                process.exit(2);
            }
            else {
                console.log(`Testing extension at \`${extensionDevelopmentPath}\``);
            }
            // The path to the extension test runner script
            // Passed to --extensionTestsPath
            const extensionTestsPath = extensionTests
                ? (0, path_1.resolve)(extensionTests)
                : (0, path_1.resolve)(extensionDevelopmentPath, 'out', 'src', 'test', 'index.js');
            if (!(0, fs_1.existsSync)(extensionTestsPath)) {
                console.error(`Unable to locate test entry point \`${extensionTestsPath}\``);
                process.exit(3);
            }
            const launchArgs = [
                '--disable-extensions',
                '--disable-telemetry',
                '--disable-updates',
            ];
            if (process.env.VSCODE_USER_DATA_DIR) {
                console.log(`Using user-data-dir ${process.env.VSCODE_USER_DATA_DIR}`);
                launchArgs.push('--user-data-dir', process.env.VSCODE_USER_DATA_DIR);
                if (!(0, fs_1.existsSync)(process.env.VSCODE_USER_DATA_DIR)) {
                    console.error(`Error: ${process.env.VSCODE_USER_DATA_DIR} does not exist.`);
                    process.exit(4);
                }
            }
            // Run the integration tests on the already installed VS Code.
            yield (0, vscode_test_1.runTests)({
                extensionDevelopmentPath,
                extensionTestsPath,
                launchArgs,
                vscodeExecutablePath,
                // https://github.com/microsoft/vscode-test/issues/221
                version: '1.78.2'
            });
        }
        catch (err) {
            console.error('Failed to run tests');
            console.error(err);
            process.exit(5);
        }
    });
}
if (process.argv.length < 3) {
    usage();
    process.exit(1);
}
else {
    main(process.argv[2], process.argv[3]);
}
//# sourceMappingURL=runTests.js.map