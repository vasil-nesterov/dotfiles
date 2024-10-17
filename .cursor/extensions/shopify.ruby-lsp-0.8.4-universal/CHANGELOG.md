# vscode-ruby-lsp-v0.8.4
## 🐛 Bug Fixes

- Prevent the same workspace from being lazily launched more than once (https://github.com/Shopify/ruby-lsp/pull/2693) by @vinistock



# vscode-ruby-lsp-v0.8.3
## ✨ Enhancements

- Display add-on version in the displayAddons command (https://github.com/Shopify/ruby-lsp/pull/2662) by @st0012

## 🐛 Bug Fixes

- Find git root through the git extension API (https://github.com/Shopify/ruby-lsp/pull/2682) by @vinistock



# vscode-ruby-lsp-v0.8.2
## 📦 Other Changes

- Remove version manager setting migration code (https://github.com/Shopify/ruby-lsp/pull/2600) by @vinistock



# vscode-ruby-lsp-v0.8.1
## 🐛 Bug Fixes

- Fix rescue token without explicit class (https://github.com/Shopify/ruby-lsp/pull/2578) by @vinistock
- Never set shell on Windows for any version manager (https://github.com/Shopify/ruby-lsp/pull/2597) by @vinistock



# vscode-ruby-lsp-v0.8.0
## ✨ Enhancements

- Delegate all possible features for ERB (https://github.com/Shopify/ruby-lsp/pull/2563) by @vinistock

## 🐛 Bug Fixes

- Use separator for activation script result (https://github.com/Shopify/ruby-lsp/pull/2552) by @vinistock



# vscode-ruby-lsp-v0.7.20
## 📦 Other Changes

- Allow launching the server in debug mode (https://github.com/Shopify/ruby-lsp/pull/2539) by @vinistock



# vscode-ruby-lsp-v0.7.19
## 📦 Other Changes

- Downgrade engine to v1.91 (https://github.com/Shopify/ruby-lsp/pull/2527) by @vinistock



# vscode-ruby-lsp-v0.7.18
## ✨ Enhancements

- Warn users if shadownev is not installed (https://github.com/Shopify/ruby-lsp/pull/2498) by @vinistock
- Show progress while initializing the server (https://github.com/Shopify/ruby-lsp/pull/2505) by @vinistock

## 🐛 Bug Fixes

- fix(grammar): Fix syntax highlighting for Kernel.` method in Ruby grammar (https://github.com/Shopify/ruby-lsp/pull/2493) by @Sean0628
- Always run Ruby activation using cmd for RubyInstaller (https://github.com/Shopify/ruby-lsp/pull/2489) by @vinistock



# vscode-ruby-lsp-v0.7.17
## ✨ Enhancements

- Minimize semantic tokens returned for local variables (https://github.com/Shopify/ruby-lsp/pull/2482) by @vinistock

## 🐛 Bug Fixes

- Improve Ruby LSP extension's status item names (https://github.com/Shopify/ruby-lsp/pull/2484) by @st0012



# vscode-ruby-lsp-v0.7.16
## ✨ Enhancements

- Add VS Code command to collect issue reporting data (https://github.com/Shopify/ruby-lsp/pull/2456) by @st0012



# vscode-ruby-lsp-v0.7.15
## ✨ Enhancements

- Add Ruby Copilot chat agent with domain driven design command (https://github.com/Shopify/ruby-lsp/pull/2366) by @vinistock
- Enhance debugger attachment requests (https://github.com/Shopify/ruby-lsp/pull/2431) by @st0012

## 🐛 Bug Fixes

- Fix grammar for class and module keyword matching (https://github.com/Shopify/ruby-lsp/pull/2371) by @andyw8
- Avoid requiring json for chruby activation (https://github.com/Shopify/ruby-lsp/pull/2430) by @vinistock



# vscode-ruby-lsp-v0.7.14
## ✨ Enhancements

- Add support for running Rails generators from the UI (https://github.com/Shopify/ruby-lsp/pull/2257) by @vinistock
- Add create Minitest file operation (https://github.com/Shopify/ruby-lsp/pull/2316) by @vinistock

## 🐛 Bug Fixes

- Use URI object when invoking vscode.open (https://github.com/Shopify/ruby-lsp/pull/2318) by @vinistock
- Allow turning off ERB support through setting (https://github.com/Shopify/ruby-lsp/pull/2311) by @vinistock
- Only show file operations in the explorer view (https://github.com/Shopify/ruby-lsp/pull/2321) by @vinistock



# vscode-ruby-lsp-v0.7.13
## ✨ Enhancements

- Accept multiple URIs for the open file command (https://github.com/Shopify/ruby-lsp/pull/2312) by @vinistock

## 📦 Other Changes

- Add note about Mise version manager (https://github.com/Shopify/ruby-lsp/pull/2172) by @andyw8


