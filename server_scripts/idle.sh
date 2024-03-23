idle_threshold=900000

while true
do
	idle_time=$(xprintidle)

	if xrandr | grep -q "HDMI-2 connected"
	then
		echo "plugged in"
	else
		shutdown now 
	fi


	if [[$idle_time -gt $idle_threshold]]
	then
		xdotool key "ctrl+R" &
	fi

	sleep 2

done
