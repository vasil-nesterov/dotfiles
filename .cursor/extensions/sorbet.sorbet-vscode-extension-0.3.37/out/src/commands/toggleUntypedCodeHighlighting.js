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
exports.configureUntypedCodeHighlighting = exports.toggleUntypedCodeHighlighting = void 0;
const vscode_1 = require("vscode");
const config_1 = require("../config");
function toggle(log, configuration) {
    if (configuration.oldHighlightUntyped != null) {
        return configuration.oldHighlightUntyped;
    }
    switch (configuration.highlightUntyped) {
        case "nowhere":
            return "everywhere";
        case "everywhere-but-tests":
            return "nowhere";
        case "everywhere":
            return "nowhere";
        default:
            const exhaustiveCheck = configuration.highlightUntyped;
            log.warning(`Got unexpected state: ${exhaustiveCheck}`);
            return "nowhere";
    }
}
function cycleStates(context, targetState, forCommand) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldHighlightUntyped = context.configuration.highlightUntyped;
        context.configuration.oldHighlightUntyped = oldHighlightUntyped;
        yield context.configuration.setHighlightUntyped(targetState);
        context.log.info(`${forCommand}: Untyped code highlighting: ${targetState}`);
    });
}
/**
 * Toggle highlighting of untyped code.
 * @param context Sorbet extension context.
 * @returns The new TrackUntyped setting
 */
function toggleUntypedCodeHighlighting(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetState = toggle(context.log, context.configuration);
        yield cycleStates(context, targetState, "ToggleUntyped");
        const { activeLanguageClient: client } = context.statusProvider;
        if (client) {
            client.sendNotification("workspace/didChangeConfiguration", {
                settings: {
                    highlightUntyped: (0, config_1.backwardsCompatibleTrackUntyped)(context.log, targetState),
                },
            });
        }
        else {
            context.log.debug("ToggleUntyped: No active Sorbet LSP to notify.");
        }
        return targetState;
    });
}
exports.toggleUntypedCodeHighlighting = toggleUntypedCodeHighlighting;
/**
 * Set highlighting of untyped code to specific setting.
 * @param context Sorbet extension context.
 */
function configureUntypedCodeHighlighting(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = config_1.ALL_TRACK_UNTYPED.map((trackWhere) => {
            return {
                label: (0, config_1.labelForTrackUntypedSetting)(trackWhere),
                trackWhere,
            };
        });
        const selectedItem = yield vscode_1.window.showQuickPick(items, {
            placeHolder: "Select where to highlight untyped code",
        });
        if (selectedItem) {
            const targetState = selectedItem.trackWhere;
            yield cycleStates(context, targetState, "ConfigureUntyped");
            const { activeLanguageClient: client } = context.statusProvider;
            if (client) {
                client.sendNotification("workspace/didChangeConfiguration", {
                    settings: {
                        highlightUntyped: targetState,
                    },
                });
            }
            else {
                context.log.debug("ConfigureUntyped: No active Sorbet LSP to notify.");
            }
            return targetState;
        }
        return null;
    });
}
exports.configureUntypedCodeHighlighting = configureUntypedCodeHighlighting;
//# sourceMappingURL=toggleUntypedCodeHighlighting.js.map