#using demo from https://www.thegeekpub.com/258732/the-best-gpio-tutorial-for-raspberry-pi-that-we-could-write/

from sense_hat import SenseHat
sense = SenseHat()
sense.clear()
temp = sense.get_temperature()
print("It is {} degrees Celcius".format(temp))
