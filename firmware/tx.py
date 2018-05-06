# Program by Dillon de Silva
import math
import radio
from microbit import *

radio.on()
radio.config(channel=20)
count = 0
image = Image("99999:"
              "99999:"
              "99999:"
              "99999:"
              "99999")
while True:
    display.show(image)
    x = accelerometer.get_x()
    y = accelerometer.get_y()
    z = accelerometer.get_z()
    a = str(math.sqrt(x**2 + y**2 + z**2))
    t = str(temperature())
    radio.send(str(count) + ',' + a + ',' + t + '\r\n')
    count = count + 1
    display.clear()
    sleep(100)