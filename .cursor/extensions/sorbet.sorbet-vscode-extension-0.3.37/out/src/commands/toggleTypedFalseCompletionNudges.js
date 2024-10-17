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
exports.toggleTypedFalseCompletionNudges = void 0;
const types_1 = require("../types");
/**
 * Toggle the auto-complete nudge in `typed: false` files.
 * @param context Sorbet extension context.
 * @returns `true` if the nudge is enabled, `false` otherwise.
 */
function toggleTypedFalseCompletionNudges(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetState = !context.configuration.typedFalseCompletionNudges;
        yield context.configuration.setTypedFalseCompletionNudges(targetState);
        context.log.info(`Untyped file auto-complete nudge: ${targetState ? "enabled" : "disabled"}`);
        yield context.statusProvider.restartSorbet(types_1.RestartReason.CONFIG_CHANGE);
        return context.configuration.typedFalseCompletionNudges;
    });
}
exports.toggleTypedFalseCompletionNudges = toggleTypedFalseCompletionNudges;
//# sourceMappingURL=toggleTypedFalseCompletionNudges.js.map