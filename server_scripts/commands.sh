wget -O gnome-shell-extension-installer "https://github.com/brunelli/gnome-shell-extension-installer/raw/master/gnome-shell-extension-installer"

chmod +x gnome-shell-extension-installer

mv gnome-shell-extension-installer /usr/bin/

apt install curl

gnome-shell-extension-installer 1140 3.20.4


