# Hacking the Hack
## Raspberry Pi Setup and Integration Guide

## Overview
This guide hopes to provide resources that will help walk you through setting up the Raspberry Pi 4, using the Pi and its peripherals, and connecting to a Unity Project over a server. Please feel free to make PRs if you find better resources or develop your own demo scripts/projects, and create an issue if you run into any problems!

## Contents:
1. Overview and Kit Parts List
2. Raspberry Pi First Time Setup
3. SSH and Command Line Basics
4. Sensehat Installation and Demo
5. Camera Installation and Demo
6. Microphone Installation and Demo
7. Networking // Pi as a Server
8. Unity <--> Raspi Project: Hello World
9. Unity <--> Raspi Project: Sensehat
10. Unity <--> Raspi Project: Microphone
11. Unity <--> Raspi Project: Camera
12. Unity <--> Raspi Project: AR
13. Unity <--> Raspi Project: VR
14. Unity <--> Raspi Project: VRChat
15. Misc


### Kit Parts List:
* $35 Pi 4 2GB https://www.canakit.com/raspberry-pi-4-2gb.html
* $35 SENSE HAT https://www.canakit.com/raspberry-pi-sense-hat.html?cid=usd&src=raspberrypi
* $25 Pi Camera https://www.canakit.com/raspberry-pi-camera-v2-8mp.html?cid=usd&src=raspberrypi
* $6 Microphone https://www.adafruit.com/product/3367
* $8 Power Supply https://www.amazon.com/dp/B07W8XHMJZ
* $10 MicroSD Card https://www.amazon.com/dp/B06XWMQ81P


## Raspberry Pi First Time Setup

This assumes you already have the Raspberry Pi OS loaded onto your SD Card. If not, check the links at the bottom of this section for instructions. If you’re receiving a Reality Kit in the mail, the SD card comes preloaded with the OS.

If you have an HDMI monitor and a USB keyboard/mouse, follow [the official raspberry pi set up guide](https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up/3).  If not,  you can connect over SSH -- follow the SSH instructions on [this guide from NYU](https://itp.nyu.edu/networks/setting-up-a-raspberry-pi/).

Make sure the following interfaces are enabled using `sudo raspi-config`:
* Ssh
* Camera
* I2C
* Remote Gpio

## SSH and Command Line Basics

https://www.pcmag.com/how-to/essential-commands-to-learn-for-your-raspberry-pi-projects

https://www.circuitbasics.com/useful-raspberry-pi-commands/

https://projects.raspberrypi.org/en/projects/getting-started-with-git/4

## Sensehat Installation and Demo

The repo includes some demo scripts for the sensehat -- you can run them by cd’ing to the directory and running the python script:
```
cd <REPO>/sensehatDemo
sudo python helloWorld.py
```
The "clearPixels.py" script is handy if you want to turn off the LEDs that automatically turn on at start.

*Note: When you turn on the raspberry pi, the sensehat will flash brightly and scare the crap out of you. Or at least me, it gets me every time.*

https://projects.raspberrypi.org/en/projects/getting-started-with-the-sense-hat/8

https://www.thegeekpub.com/258732/the-best-gpio-tutorial-for-raspberry-pi-that-we-could-write/

## Camera Installation and Demo

https://www.raspberrypi.com/documentation/accessories/camera.html

Troubleshooting:
* If you’re getting a “no cameras available” message
    * Check to make sure you’ve enabled camera access in raspi-config
    * Type `sudo vcgencmd get_camera` and check to see if the camera is both supported and detected (=1)
        * If not, check your wiring again
 

## Microphone Installation and Demo

https://learn.adafruit.com/usb-audio-cards-with-a-raspberry-pi/recording-audio

## Networking // Pi as a Server

You first need to make sure your [raspberry pi has node and npm installed](https://lindevs.com/install-node-js-and-npm-on-raspberry-pi/).

For this guide we'll set up a node server on the raspberry pi and have unity connect to it over the local network. You could also set up a (free Glitch server)[https://glitch.com/] to connect from any network -- the steps are the same, you'll just need to adjust the Glitch server to be the middleman that receives the messages from the raspi and unity project and sends them along to each other.

1. cd to the "basicServer" directory and install the associated node modules:
    ```
    cd <REPO>/basicServer
    npm install
    ```
2. Now we can run the server and if a client connects, we'll see a message in the terminal saying so. 
    ```
    node serverHello.js
    ```
3. You can now open a webpage and check to see if it's serving on your local network. To find the local network IP address of your raspi, run the `ifconfig` command and find a line that starts with something that looks like `inet 192.168.1.5` -- I'm on wifi so for me it was under the section `wlan0`. This IP address is the address of your pi on the local network (192.168), so if your unity project is on the same wifi network, you can use this address like you would a standard URL (i.e. "192.168.1.5:8080" vs "https://example.com"). Open a webpage on another computer and go to `192.168.<your address>:8080`. If you see "Cannot GET /", that means it's working! We're not serving anything, so there's nothing for the server to pick up on (i.e. you won't see the connection message in the raspi terminal), but we know it's working because it says it's not working haha. If we stop the server script on the raspi (`CTRL-C`) and try and open the same webpage, now we'll see a "this site can't be reached" message.

https://github.com/websockets/ws

https://github.com/balena-io-playground/node-sense-hat

## Unity <--> Raspi Project: Hello World

https://github.com/endel/NativeWebSocket

## Unity <--> Raspi Project: Sensehat

todo: send server color

## Unity <--> Raspi Project: Camera

https://docs.unity3d.com/ScriptReference/Video.VideoPlayer.html

## Unity <--> Raspi Project: Microphone

https://github.com/adrenak/UniVoice

## Unity <--> Raspi Project: AR

https://unity.com/unity/features/arfoundation

## Unity <--> Raspi Project: VR

https://docs.unity3d.com/Manual/VROverview.html

## Unity <--> Raspi Project: VRChat

https://docs.vrchat.com/docs/setting-up-the-sdk

## Misc




