import board
import os
import time
import ssl
import json
import socketpool
import wifi
import adafruit_minimqtt.adafruit_minimqtt as MQTT
import neopixel
import adafruit_led_animation.animation.sparkle as sparkle_animation
import busio
from adafruit_servokit import ServoKit
import digitalio
i2c = busio.I2C(scl=board.GP1, sda=board.GP0)
kit = ServoKit(channels=16, i2c=i2c)

pixel = neopixel.NeoPixel(board.GP2, 30)

broker = "test.mosquitto.org"
ifaceId = "tj-north-pico-w"
# broker = "tamarackjunctionmbp.local"

def connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker {}".format(broker))
    print("Flags: {0}\n RC: {1}".format(flags, rc))

pool = socketpool.SocketPool(wifi.radio)
socket = pool.socket()
socket.listen(1)
socket.setblocking(True)
print("Connected, IPv4 Addr: ", wifi.radio.ipv4_address)

# Define callback methods which are called when events occur
# pylint: disable=unused-argument, redefined-outer-name
def connected(client, userdata, flags, rc):
    # This function will be called when the client is connected
    # successfully to the broker.
    print(f"Connected to mqtt Listening for topic changes")
    client.publish("tj-north-pico-w", "Connected to mqtt Listening for topic changes")
    # Subscribe to all changes on the onoff_feed.
    client.subscribe("@ttt/turnout/tam")


def disconnected(client, userdata, rc):
    # This method is called when the client is disconnected
    print("Disconnected from mqtt!")


def message(client, topic, message):
    # This method is called when a topic the client is subscribed to
    # has a new message.
    print(f"New message on topic {topic}: {message}")
    data = json.loads(message)
    print(data)
    print("handleTurnout")
    action = data.get("action")
    payload = data.get("payload")
    config = payload["config"]
    if (config["interface"] is ifaceId):
        if action is "turnouts":
            handleTurnout(client, payload)
        elif action is "pin":
            handlePin(client, payload)

def handlePin(client, payload):
    print("handlePin")
    print(payload)
    pinNumber = payload["pin"]
    if payload["state"] is True:
        value = 1
    else:
        value = 0
    pin = digitalio.DigitalInOut(pinNumber)
    pin.direction = digitalio.Direction.OUTPUT
    pin.value = not value
    client.publish("tj-north-pico-w", f"Toggled pin {pin} to value {value}")

def handleTurnout(client,payload):
    print("handleTurnout")
    print(payload)
    servo = payload["config"]["servo"]
    if payload["state"] is True:
        angle = payload["config"]["straight"]
    else:
        angle = payload["config"]["divergent"]
    kit.servo[servo].angle = angle
    client.publish("tj-north-pico-w", f"Toggled servo {servo} to angle {angle}")


def subscribe(client, userdata, topic, granted_qos):
    # This method is called when the client subscribes to a new feed.
    print('Subscribed to {0} with QOS level {1}'.format(topic, granted_qos))

def runMqtt():
    
    mqtt_client = MQTT.MQTT(
        broker=broker,
        port=1883,
        socket_pool=pool,
    )

    mqtt_client.on_connect = connected
    mqtt_client.on_disconnect = disconnected
    mqtt_client.on_message = message
    mqtt_client.on_subscribe = subscribe

    # Connect the client to the QTT broker.
    print("Connecting to MQTT...")
    mqtt_client.connect()

    photocell_val = 0
    led_on = True
    while True:
        # Poll the message queue
        mqtt_client.loop()

runMqtt()