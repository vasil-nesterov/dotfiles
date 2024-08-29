local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.default_prog = { '/opt/homebrew/bin/fish', '-l' }

--config.color_scheme = 'Sex Colors (terminal.sexy)'
config.color_scheme = 'rose-pine'

config.font = wezterm.font 'JetBrains Mono NL'
config.font_size = 13.0

return config
