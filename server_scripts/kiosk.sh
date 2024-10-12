#!/bin/bash

# Run this script in display 0 - the monitor
export DISPLAY=:0

gsettings set org.gnome.desktop.notifications show-banners false

if xrandr | grep "HDMI-2 connected"
then
    echo "plugged in"
else
    exit 0
fi

# Hide the mouse from the display
unclutter &

# If Chromium crashes (usually due to rebooting), clear the crash
#flag so we don't have the annoying warning bar
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences


display=$(xrandr | grep -oP "HDMI-2")
xrandr --output $display --rotate right
display=$(xrandr | grep -oP "eDP-1")
xrandr --output $display --rotate right

# Run Chromium and open tabs
/usr/bin/chromium-browser --window-size=1080,1920 --kiosk --disable-pinch --overscroll-history-navigation=0 --window-position=0,0 http://10.25.21.68:5173/kiosk/kiosk-1-1234567/ &
bash power_state_change.sh &