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

For this guide we'll set up a node server on the raspberry pi and connect to it over the local network. You could also set up a (free Glitch server)[https://glitch.com/] to connect from any network -- the steps are the same, you'll just need to adjust the Glitch server to be the middleman that receives the messages from the raspi and unity/web project and sends them along to each other.

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

*Note: You may need to check your ifconfig each time you start your device. If your router has dynamically assigned IP addresses (most do), your local IP will change if other devices have been connecting/disconnecting while your pi was offline.*

## Website <--> Raspi: Website Control

We can also test the node server without opening our Unity project by using a simple webpage interface served by our node server. Using (p5.js)[https://p5js.org/], we'll create a super bare-bones interface that lets us check the raspi server connection.

1. Assuming we've already installed the npm packages from the previous section, just run the server (need to run with `sudo`):
    ```
    sudo node webServer.js
    ```
2. Open the same webpage address as before, your pi's local IP address (like `192.168.1.5`). You should see a "hello server" message scroll across the sense hat. If you type a message in the top left input and click the "Send Message" button, that message will scroll across the pi. If you click and drag on the black cells at the bottom of the page, the cells will change color depending on which color is selected in the color picker rectangle to the left of the cells. When you release the mouse on the grid, the array will be sent to the pi and display accordingly. 

https://github.com/websockets/ws

https://github.com/aonghusonia/sense-hat-led

https://github.com/balena-io-playground/node-sense-hat

## Unity <--> Raspi Project: Hello World

For our basic Hello World project connecting Unity to our Raspi server, we're using a barebones Unity3D project (2020.3.12) with the [Websocket-Sharp](https://github.com/sta/websocket-sharp) library.

1. In the Unity Hub, add the project located at <REPO>/Raspi_Unity. Open it and you should see the default scene, HelloWorld.
2. In the hierarchy, click on "ConnectionManager" and type your pi address in the "ServerURL" field of the Connection Test component (make sure to include the "ws://" at the beginning -- i.e. ws://192.168.1.10:8080). You can also change the message that will be sent to the server on connection in the "Message to Send" field.
3. Run the server on the pi:
    ```
    sudo node unityServer.js
    ```
4. Press play in the Unity Inspector. The logs should display the connections and the sensehat will display the message sent from Unity.

https://github.com/GlitchEnzo/NuGetForUnity
https://github.com/sta/websocket-sharp

## Unity <--> Raspi Project: SenseHat Frog

*This demo scene uses a cute [frog asset](https://assetstore.unity.com/packages/3d/characters/animals/froggy-the-frog-quirky-series-185095) from the Unity asset store.*

1. Open the SenseHatDemo scene.
2. Run the same pi server as the previous step.
3. Update the IP field in the "SenseHatConnectionManager" Game Object. When you run the scene, a frog will jump around a 8x8 grid and light up the sense hat pixels accordingly.

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




