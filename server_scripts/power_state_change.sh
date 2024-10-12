#!/bin/bash

# Path to the file indicating AC power status
AC_POWER_STATUS_FILE="/sys/class/power_supply/AC/online"

# Loop indefinitely
while true; do
  # Read the value of the AC power status
  AC_STATUS=$(cat "$AC_POWER_STATUS_FILE")

  # Check if the AC power is disconnected (value is 0)
  if [ "$AC_STATUS" -eq 0 ]; then
    echo "AC power disconnected. Shutting down..."
    # Shutdown the computer. Use 'sudo' or run as root if necessary.
    sudo shutdown now
    exit 0
  else
    echo "AC power connected. Checking again in 60 seconds..."
  fi

  # Wait for 60 seconds before checking again
  sleep 60
done
