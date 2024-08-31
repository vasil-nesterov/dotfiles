# ~/.config/fish/config.fish

set fish_greeting "G'day!"

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

export EDITOR="code --wait"
export KUBE_EDITOR="code --wait"

alias    l="ls -lA"
alias   gs="git status"
alias   be="bundle exec"
alias   dc="docker-compose"
alias  cfg='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'

bind \eq beginning-of-line
bind \ew backward-word
bind \ee forward-word
bind \er end-of-line

starship init fish | source

source /opt/homebrew/opt/asdf/libexec/asdf.fish
