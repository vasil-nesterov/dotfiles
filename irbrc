#!/usr/bin/env ruby
# coding: UTF-8

require 'awesome_print'
AwesomePrint.irb!

#----------------------------------------------------------------------------
# Shortcuts
def clear
  system 'clear'
end

def l(dir = '')
  puts %x{ls -lha --color #{dir}}.split("\n")
end

def cd(dir = '~')
  Dir.chdir(dir.sub('~', Dir.home))
end

#----------------------------------------------------------------------------
# IRB prompt
txtblk="\e[0;30m" # Black - Regular
txtred="\e[0;31m" # Red
txtgrn="\e[0;32m" # Green
txtylw="\e[0;33m" # Yellow
txtblu="\e[0;34m" # Blue
txtpur="\e[0;35m" # Purple
txtcyn="\e[0;36m" # Cyan
txtwht="\e[0;37m" # White
bldblk="\e[1;30m" # Black - Bold
bldred="\e[1;31m" # Red
bldgrn="\e[1;32m" # Green
bldylw="\e[1;33m" # Yellow
bldblu="\e[1;34m" # Blue
bldpur="\e[1;35m" # Purple
bldcyn="\e[1;36m" # Cyan
bldwht="\e[1;37m" # White
unkblk="\e[4;30m" # Black - Underline
undred="\e[4;31m" # Red
undgrn="\e[4;32m" # Green
undylw="\e[4;33m" # Yellow
undblu="\e[4;34m" # Blue
undpur="\e[4;35m" # Purple
undcyn="\e[4;36m" # Cyan
undwht="\e[4;37m" # White
bakblk="\e[40m"   # Black - Background
bakred="\e[41m"   # Red
badgrn="\e[42m"   # Green
bakylw="\e[43m"   # Yellow
bakblu="\e[44m"   # Blue
bakpur="\e[45m"   # Purple
bakcyn="\e[46m"   # Cyan
bakwht="\e[47m"   # White
txtrst="\e[0m"    # Text Reset

def set_tilda(str)
  home = Dir.home
  str.sub /#{home}/, '~'
end

irb_hack = proc do |s|
  def s.dup
    gsub('%~', set_tilda(Dir.pwd))
  end
end

prompt = "#{txtylw}%N(%m):#{bldylw}%03n #{bldgrn}%~ #{txtblu}$#{txtrst} "

IRB.conf[:PROMPT][:CUSTOM] = { PROMPT_N: prompt.tap(&irb_hack),
                               PROMPT_I: prompt.tap(&irb_hack),
                               PROMPT_S: (prompt + "#{undred}<#{txtrst}").tap(&irb_hack),
                               PROMPT_C: prompt.tap(&irb_hack),
                               RETURN: "\t#{bldred}===> #{txtrst}%s\n"
                             }

IRB.conf[:PROMPT_MODE] = :CUSTOM

#----------------------------------------------------------------------------
IRB.conf[:EVAL_HISTORY] = 1000
IRB.conf[:SAVE_HISTORY] = 1000
IRB.conf[:HISTORY_FILE] = File::expand_path('~/.config/.irbhistory')
