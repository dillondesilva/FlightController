import math
import radio
from microbit import *

uart.init (baudrate=9600)
radio.on()
radio.config (channel=20)
image = Image("99999:"
              "99999:"
              "99999:"
              "99999:"
              "99999")

while True:
        data_string = ''
        data_string = radio.receive()
        if data_string != None:
            display.show(image)
            uart.write(data_string)
        else:
            display.clear()