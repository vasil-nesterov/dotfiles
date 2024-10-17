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
exports.savePackageFiles = void 0;
const vscode_1 = require("vscode");
const path_1 = require("path");
/**
 * Save all __package.rb files with changes.
 *
 * @param context Sorbet extension context.
 * @return `true` if all the files were successfully saved.
 */
function savePackageFiles(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageDocuments = vscode_1.workspace.textDocuments.filter((document) => document.isDirty && (0, path_1.basename)(document.fileName) === "__package.rb");
        if (!packageDocuments.length) {
            context.log.trace("savePackageFiles: nothing to save");
            return true;
        }
        const allSaved = yield Promise.all(packageDocuments.map((document) => {
            context.log.trace(`savePackageFiles: saving ${document.fileName}`);
            return document.save();
        }));
        return allSaved.every((x) => x);
    });
}
exports.savePackageFiles = savePackageFiles;
//# sourceMappingURL=savePackageFiles.js.map