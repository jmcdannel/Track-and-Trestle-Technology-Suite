import board
import os
import time
import ssl
import json
import socketpool
import wifi
import adafruit_minimqtt.adafruit_minimqtt as MQTT

import neopixel
from adafruit_led_animation.animation.solid import Solid
from adafruit_led_animation.animation.blink import Blink
from adafruit_led_animation.animation.comet import Comet
from adafruit_led_animation.animation.chase import Chase
from adafruit_led_animation.animation.sparkle import Sparkle
from adafruit_led_animation.animation.SparklePulse import SparklePulse
from adafruit_led_animation.sequence import AnimationSequence

import busio
from adafruit_servokit import ServoKit
i2c = busio.I2C(scl=board.GP1, sda=board.GP0)
kit = ServoKit(channels=16, i2c=i2c)

pixel = neopixel.NeoPixel(board.GP2, 30)
pixelPlatform = neopixel.NeoPixel(board.GP3, 47)

pixelAnimationEnabled = True
pixelAnimation = Solid(pixel, color=(0, 0, 0))
pixelPlatformAnimationEnabled = True
pixelPlatformAnimation = Solid(pixelPlatform, color=(0, 0, 0))
# pixelPlatformAnimation = Sparkle(pixelPlatform, speed=1, color=(220, 220, 220), num_sparkles=5)
# pixelPlatformAnimation = SparklePulse(pixelPlatform, speed=0.05, period=3, color=(220, 220, 220))

# broker = "test.mosquitto.org"
broker = "joshs-mac-mini.local"

def connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker {}".format(broker))
    print("Flags: {0}\n RC: {1}".format(flags, rc))

pool = socketpool.SocketPool(wifi.radio)
socket = pool.socket()
socket.listen(1)
socket.setblocking(True)
print("Connected, IPv4 Addr: ", wifi.radio.ipv4_address)

mqtt_client = MQTT.MQTT(
    broker=broker,
    port=1883,
    socket_pool=pool,
)

def runAnimations():
    print(f"Run animations")
    print(pixelPlatformAnimationEnabled)
    while pixelAnimationEnabled:
        pixelAnimation.animate()
    
    while pixelPlatformAnimationEnabled:
        pixelPlatformAnimation.animate()


# Define callback methods which are called when events occur
# pylint: disable=unused-argument, redefined-outer-name
def connected(client, userdata, flags, rc):
    # This function will be called when the client is connected
    # successfully to the broker.
    print(f"Connected to mqtt Listening for topic changes")
    client.subscribe("ttt")
    client.subscribe("ttt-turnout")
    client.subscribe("ttt-ialed")
    client.subscribe("ttt-effect")


def disconnected(client, userdata, rc):
    # This method is called when the client is disconnected
    print("Disconnected from mqtt!")

def handleTurnout(action):
    print("handleTurnout")
    servo = action["turnout"]["config"]["servo"]
    if action["turnout"]["state"] is True:
        angle = action["turnout"]["config"]["straight"]
    else:
        angle = action["turnout"]["config"]["divergent"]
    kit.servo[servo].angle = angle

def handleIALED(action):
    global pixelAnimationEnabled, pixelAnimation, pixelPlatformAnimationEnabled, pixelPlatformAnimation
    start, end, command, pin = (
        action["start"],
        action["end"],
        action["command"],
        action["pin"],
    )
    strip = pixel
    if pin is 3:
        strip = pixelPlatform

    if command == "off":        
        animation = Solid(strip, color=(0, 0, 0))
        
    else:        
        r, g, b = (
            action["r"],
            action["g"],
            action["b"],
        )
    
        if command == "color":
            animation = Solid(strip, color=(r, g, b))
        
        elif command == "blink":
            animation = Blink(strip, speed=0.5, color=(r, g, b))
        
        elif command == "comet":
            animation = Comet(strip, speed=0.015, color=(r, g, b), tail_length=4, bounce=True)
        
        elif command == "chase":
            animation = Chase(strip, speed=0.1, color=(r, g, b), size=3, spacing=6)
        
        elif command == "sparkle":
            animation = Sparkle(strip, speed=0.05, color=(r, g, b), num_sparkles=10)
        
        elif command == "sparklepulse":  
            animation = SparklePulse(pixelPlatform, speed=0.05, period=3, color=(r, g, b))

    if pin is 2:
        pixelAnimation = animation
    elif pin is 3:
        pixelPlatformAnimation = animation

def message(client, topic, message):
    # This method is called when a topic the client is subscribed to
    # has a new message.
    print(f"New message on topic ..{topic}..")
    action = json.loads(message)
    if topic == "ttt-turnout" or topic == "ttt":
        handleTurnout(action)
    elif topic == "ttt-ialed":
        handleIALED(action)
    

def subscribe(client, userdata, topic, granted_qos):
    # This method is called when the client subscribes to a new feed.
    print('Subscribed to {0} with QOS level {1}'.format(topic, granted_qos))

mqtt_client.on_connect = connected
mqtt_client.on_disconnect = disconnected
mqtt_client.on_message = message
mqtt_client.on_subscribe = subscribe

# Connect the client to the QTT broker.
print("Connecting to MQTT...")
mqtt_client.connect()

while True:
    # Poll the message queue
    mqtt_client.loop()
    pixelAnimation.animate()
    pixelPlatformAnimation.animate()

