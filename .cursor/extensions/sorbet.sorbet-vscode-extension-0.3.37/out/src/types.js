"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartReason = void 0;
// Reasons why Sorbet might be restarted.
var RestartReason;
(function (RestartReason) {
    // Command manuallyinvoked from command palette
    RestartReason["COMMAND"] = "command";
    // Manually invoked from the user clicking on "Restart Sorbet" in status bar popup
    RestartReason["STATUS_BAR_BUTTON"] = "status_bar_button";
    // For environments where a wrapper script protects the `sorbet` invocation,
    // and fails to start it under certain circumstances (for example, an rsync
    // client not running in the background, or a VPN not being connected).
    RestartReason["WRAPPER_REFUSED_SPAWN"] = "wrapper_refused_spawn";
    // For situations where `sorbet` died because it was sent the TERM signal
    RestartReason["FORCIBLY_TERMINATED"] = "forcibly_terminated";
    // LanguageClient closed callback
    RestartReason["CRASH_LC_CLOSED"] = "crash_lc_closed";
    // LanguageClient error callback
    RestartReason["CRASH_LC_ERROR"] = "crash_lc_error";
    // Extension (non-LanguageClient) error
    RestartReason["CRASH_EXT_ERROR"] = "crash_ext_error";
    RestartReason["CONFIG_CHANGE"] = "config_change";
})(RestartReason = exports.RestartReason || (exports.RestartReason = {}));
//# sourceMappingURL=types.js.map