#!/bin/bash

# Run this script in display 0 - the monitor
# export DISPLAY=:0

timeout=5

if read -r -t "$timeout" -n 1; then
    echo "Exiting script due to key press."
    exit 0
else
    echo "No key press detected, continuing script..."
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
/usr/bin/chromium-browser --window-size=1080,1920 --kiosk --disable-pinch --overscroll-history-navigation=0 --window-position=0,0 http://10.25.21.56:3000/home &

chromium_pid=$!

sh idle.sh & echo $!> pid

wait $chromium_pid
display=$(xrandr | grep -oP "HDMI-2")
xrandr --output $display --rotate normal
display=$(xrandr | grep -oP "eDP-1")
xrandr --output $display --rotate normal

pid=$(cat pid)
kill "$pid"
