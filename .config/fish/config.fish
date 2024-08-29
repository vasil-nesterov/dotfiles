# ~/.config/fish/config.fish

set fish_greeting ""

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8

export EDITOR="code --wait"
export KUBE_EDITOR="code --wait"

export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

alias   gs="git status"
alias   be="bundle exec"
alias   dc="docker-compose"
alias    l="ls -lA"
alias mine="open -na RubyMine.app --wait --args $argv"
alias  cfg='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'

starship init fish | source

source /opt/homebrew/opt/asdf/libexec/asdf.fish
