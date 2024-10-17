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
exports.SorbetContentProvider = exports.SORBET_SCHEME = void 0;
/**
 * URI scheme supported by {@link SorbetContentProvider}.
 */
exports.SORBET_SCHEME = "sorbet";
/**
 * Content provider for URIs with `sorbet` scheme.
 */
class SorbetContentProvider {
    constructor(context) {
        this.context = context;
    }
    /**
     * Provide textual content for a given uri.
     */
    provideTextDocumentContent(uri, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            let content;
            const { activeLanguageClient: client } = this.context.statusProvider;
            if (client) {
                this.context.log.info(`Retrieving file contents. URI:${uri}`);
                const response = yield client.sendRequest("sorbet/readFile", {
                    uri: uri.toString(),
                });
                content = response.text;
            }
            else {
                this.context.log.info(`Cannot retrieve file contents, no active Sorbet client. URI:${uri}`);
                content = "";
            }
            return content;
        });
    }
}
exports.SorbetContentProvider = SorbetContentProvider;
//# sourceMappingURL=sorbetContentProvider.js.map