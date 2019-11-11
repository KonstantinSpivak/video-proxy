1) http://files.emlid.com/images/emlid-raspbian-20190227.img.xz
2) https://etcher.io/ for burn img
3) install drivers

# MJPEG-Streamer Install & Setup
- https://github.com/jacksonliam/mjpg-streamer
- http://raspberrypi.stackexchange.com/questions/36734/compile-mjpg-streamer-error

```
# Update & Install Tools
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install build-essential imagemagick libv4l-dev libjpeg-dev cmake -y

# Clone Repo in /tmp
cd /tmp
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer/mjpg-streamer-experimental

# Make
make
sudo make install

# Run
/usr/local/bin/mjpg_streamer -i "input_uvc.so -r 1280x720 -d /dev/video0 -f 30" -o "output_http.so -p 8080 -w /usr/local/share/mjpg-streamer/www"
```

# NVM NODE VERSION 9
# Install Node Version Manager (NVM)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

# Rerun Profile script to start NVM
source ~/.bashrc  # Rerun profile after installing nvm

# Install Node.js using Node Version Manager
nvm install 9 # Installs Node v9, (nvm install stable) installs Latest version of node
nvm use 9 # Sets Node to use v9
