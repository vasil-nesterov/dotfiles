#!/bin/sh

xsetroot -cursor_name left_ptr
trayer --edge bottom --align right --width 7 --tint 0x313131 --transparent true --height 21&
#nm-applet&
# ibus-daemon -d

exec xmonad
#exec openbox-session
