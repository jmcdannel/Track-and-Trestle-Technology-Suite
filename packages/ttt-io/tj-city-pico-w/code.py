import board
import digitalio
import os
import time
import ssl
import json
import socketpool
import wifi
import adafruit_minimqtt.adafruit_minimqtt as MQTT
import busio
# from adafruit_servokit import ServoKit
# i2c = busio.I2C(scl=board.GP1, sda=board.GP0)
# kit = ServoKit(channels=16, i2c=i2c)

broker = "test.mosquitto.org"
ifaceId = "tj-city-pico-w"
# broker = "tamarackjunctionmbp.local"
pin = digitalio.DigitalInOut(board.LED)
pin.direction = digitalio.Direction.OUTPUT
pins = {
    8: digitalio.DigitalInOut(board.GP8),
    9: digitalio.DigitalInOut(board.GP9),
    10: digitalio.DigitalInOut(board.GP10),
    11: digitalio.DigitalInOut(board.GP11),
    12: digitalio.DigitalInOut(board.GP12),
    13: digitalio.DigitalInOut(board.GP13),
    14: digitalio.DigitalInOut(board.GP14),
    15: digitalio.DigitalInOut(board.GP15)
}
pins[8].direction = digitalio.Direction.OUTPUT
pins[9].direction = digitalio.Direction.OUTPUT
pins[10].direction = digitalio.Direction.OUTPUT
pins[11].direction = digitalio.Direction.OUTPUT
pins[12].direction = digitalio.Direction.OUTPUT
pins[13].direction = digitalio.Direction.OUTPUT
pins[14].direction = digitalio.Direction.OUTPUT
pins[15].direction = digitalio.Direction.OUTPUT

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
    client.publish(ifaceId, "Connected to mqtt Listening for topic changes")
    # Subscribe to all changes on the onoff_feed.
    client.subscribe("@ttt/turnout/tam")
    client.subscribe("@ttt/dispatcher/tam")


def disconnected(client, userdata, rc):
    # This method is called when the client is disconnected
    print("Disconnected from mqtt!")


def message(client, topic, message):
    # This method is called when a topic the client is subscribed to
    # has a new message.
    print(f"New message on topic {topic}: {message}")
    data = json.loads(message)
    print("data")
    print(data)
    action = data.get("action")
    print("action")
    print(action)
    payload = data.get("payload")
    print("payload")
    print(payload)
    
    if payload is not None and "config" in payload:
      config = payload["config"]
      # Rest of your code here
      if action == "turnouts" and config["interface"] == ifaceId:
          handleTurnout(client, payload)
      elif action == "effects" and config["interface"] == ifaceId:
          handlePin(client, payload)
    else:
      print("Payload does not contain a 'config' object")

def handlePin(client, payload):
    print("handlePin")
    print(payload)
    pinNumber = payload["config"]["pin"]
    if payload["state"] is 1:
        value = True
    else:
        value = False
    print(pinNumber)
    print(value)
    print(pins[pinNumber].value)
    print(pin.value)
    pins[pinNumber].value = value
    pin.value = value
    print(pins[pinNumber].value)
    print(pin.value)
    client.publish("@ttt/tj-north-pico-w/tam", f"Toggled pin {pinNumber} to value {value}")

def handleTurnout(client,payload):
    print("handleTurnout")
    print(payload)
    servo = payload["config"]["servo"]
    if payload["state"] is True:
        angle = payload["config"]["straight"]
    else:
        angle = payload["config"]["divergent"]
    # kit.servo[servo].angle = angle
    print(f"Toggled servo {servo} to angle {angle}")
    client.publish("@ttt/tj-north-pico-w/tam", f"Toggled servo {servo} to angle {angle}")


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

    while True:
        # Poll the message queue
        mqtt_client.loop()

runMqtt()




