export EDITOR="/usr/bin/atom"
export BROWSER="/usr/bin/google-chrome"
export QMAKE=/usr/bin/qmake-qt4

export GTK_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
export QT_IM_MODULE=ibus

#LANG=ja_JP.UTF-8
txtblk="\[\e[0;30m\]" # Black - Regular
txtred="\[\e[0;31m\]" # Red
txtgrn="\[\e[0;32m\]" # Green
txtylw="\[\e[0;33m\]" # Yellow
txtblu="\[\e[0;34m\]" # Blue
txtpur="\[\e[0;35m\]" # Purple
txtcyn="\[\e[0;36m\]" # Cyan
txtwht="\[\e[0;37m\]" # White
bldblk="\[\e[1;30m\]" # Black - Bold
bldred="\[\e[1;31m\]" # Red
bldgrn="\[\e[1;32m\]" # Green
bldylw="\[\e[1;33m\]" # Yellow
bldblu="\[\e[1;34m\]" # Blue
bldpur="\[\e[1;35m\]" # Purple
bldcyn="\[\e[1;36m\]" # Cyan
bldwht="\[\e[1;37m\]" # White
unkblk="\[\e[4;30m\]" # Black - Underline
undred="\[\e[4;31m\]" # Red
undgrn="\[\e[4;32m\]" # Green
undylw="\[\e[4;33m\]" # Yellow
undblu="\[\e[4;34m\]" # Blue
undpur="\[\e[4;35m\]" # Purple
undcyn="\[\e[4;36m\]" # Cyan
undwht="\[\e[4;37m\]" # White
bakblk="\[\e[40m\]"   # Black - Background
bakred="\[\e[41m\]"   # Red
badgrn="\[\e[42m\]"   # Green
bakylw="\[\e[43m\]"   # Yellow
bakblu="\[\e[44m\]"   # Blue
bakpur="\[\e[45m\]"   # Purple
bakcyn="\[\e[46m\]"   # Cyan
bakwht="\[\e[47m\]"   # White
reset="\[\e[0m\]"     # Text Reset

# User specific aliases and functions
alias     l='ls -lAF --color'
alias     s='sudo'
alias     f='free -m'
alias   slp='sleep 5 && xset dpms force off'
alias    up='sudo dnf update'
alias    gs='git status'
alias giths='git whatchanged -p --abbrev-commit --pretty=medium'
alias  grep='grep --color=auto --exclude=*.pyc --exclude-dir=.git --exclude-dir=tmp --exclude=coverage.data --exclude-dir=coverage'

export PATH="$HOME/.racket/racket/bin:$HOME/.cabal/bin:$HOME/.rbenv/bin:/usr/local/heroku/bin:/$HOME/nvm":$PATH
#export JDK_HOME="/usr/lib/jvm/java-openjdk/"
export CFLAGS="-march=native -O3 -pipe -fomit-frame-pointer"
export JDK_HOME="/usr/java/jdk1.7.0_10"
export _JAVA_AWT_WM_NONREPARENTING=1
export _JAVA_OPTIONS="-Dswing.aatext=true -Dawt.useSystemAAFontSettings=on"

export PYTHONDONTWRITEBYTECODE=1
export PYTHONPATH=$PYTHONPATH:/usr/local/lib/python2.7/site-packages

# https://gist.github.com/jjb/7389552
export RUBY_GC_HEAP_INIT_SLOTS=600000
export RUBY_GC_MALLOC_LIMIT=60000000
export RUBY_GC_HEAP_FREE_SLOTS=200000

# get git status
function parse_git_status {
    # clear git variables
    GIT_BRANCH=
    GIT_DIRTY=

    # exit if no git found in system
    local GIT_BIN=$(which git 2>/dev/null)
    [[ -z $GIT_BIN ]] && return

    # check we are in git repo
    local CUR_DIR=$PWD
    while [ ! -d ${CUR_DIR}/.git ] && [ ! $CUR_DIR = "/" ]; do CUR_DIR=${CUR_DIR%/*}; done
    [[ ! -d ${CUR_DIR}/.git ]] && return

    # 'git repo for dotfiles' fix: show git status only in home dir and other git repos
    [[ $CUR_DIR == $HOME ]] && [[ $PWD != $HOME ]] && return

    # get git branch
    GIT_BRANCH=$($GIT_BIN symbolic-ref HEAD 2>/dev/null)
    [[ -z $GIT_BRANCH ]] && return
    GIT_BRANCH=${GIT_BRANCH#refs/heads/}

    # get git status
    local GIT_STATUS=$($GIT_BIN status --porcelain 2>/dev/null)
    [[ -n $GIT_STATUS ]] && GIT_DIRTY=true
}

function parse_git_status {
    # clear git variables
    GIT_BRANCH=
    GIT_DIRTY=

    # exit if no git found in system
    local GIT_BIN=$(which git 2>/dev/null)
    [[ -z $GIT_BIN ]] && return

    # check we are in git repo
    local CUR_DIR=$PWD
    while [ ! -d ${CUR_DIR}/.git ] && [ ! $CUR_DIR = "/" ]; do CUR_DIR=${CUR_DIR%/*}; done
    [[ ! -d ${CUR_DIR}/.git ]] && return

    # 'git repo for dotfiles' fix: show git status only in home dir and other git repos
    [[ $CUR_DIR == $HOME ]] && [[ $PWD != $HOME ]] && return

    # get git branch
    GIT_BRANCH=$($GIT_BIN symbolic-ref HEAD 2>/dev/null)
    [[ -z $GIT_BRANCH ]] && return
    GIT_BRANCH=${GIT_BRANCH#refs/heads/}

    # get git status
    local GIT_STATUS=$($GIT_BIN status --porcelain 2>/dev/null)
    [[ -n $GIT_STATUS ]] && GIT_DIRTY=true
}

function prompt_command {
  local PS1_GIT=
  local PWDNAME="$PWD"

  # beautify working firectory name
  if [ "$HOME" == "$PWD" ]; then
    PWDNAME="~"
  elif [ "$HOME" ==  "${PWD:0:${#HOME}}" ]; then
    PWDNAME="~${PWD:${#HOME}}"
  fi

  parse_git_status
  [[ ! -z "$GIT_BRANCH" ]] && PS1_GIT=" (git: ${GIT_BRANCH})"

  # local color_user=
  #   # set user color
  #   case `id -u` in
  #     0) color_user=$txtred ;;
  #     *) color_user=$txtgrn ;;
  #   esac

    # build git status for prompt
    if [ ! -z "$GIT_BRANCH" ]; then
        PS1_GIT=" (${txtwht}git: ${bldpur}${GIT_BRANCH}${reset})"
    fi

  # calculate fillsize
  local fillsize=$(($COLUMNS-$(printf "${USER}@${HOSTNAME}:${PWDNAME}${PS1_GIT}${PS1_VENV} " | wc -c | tr -d " ")))

  local FILL="$txtred"
  while [ "$fillsize" -gt 0 ]; do FILL="${FILL}─"; fillsize=$(($fillsize-1)); done
  FILL="${FILL}${reset}"

  # set new color prompt
  #PS1="\[$bldgrn\]\w \[$txtblu\]$ \[$txtrst\]"
  #PS1="${color_user}${USER}${reset}@${bldylw}${HOSTNAME}${reset}:${txtwht}${PWDNAME}${reset}${PS1_GIT}${PS1_VENV} ${FILL}\n➜ "
  PS1="$bldgrn\w $txtblu$ \H ${PS1_GIT}${PS1_VENV} ${FILL}\n➜ "
}

PROMPT_COMMAND=prompt_command
eval "$(rbenv init -)"

[[ -s "$HOME/.gvm/scripts/gvm" ]] && source "$HOME/.gvm/scripts/gvm"

# disable mouse acceleration
xinput set-prop 'A4Tech USB Mouse' 'Device Accel Profile' -1
