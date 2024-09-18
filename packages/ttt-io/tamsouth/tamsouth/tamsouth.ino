#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <TurnoutPulser.h>

TurnoutPulser turnouts[] = {
  TurnoutPulser(22, 23),
  TurnoutPulser(24, 25),
  TurnoutPulser(26, 27),
  TurnoutPulser(28, 29),
  TurnoutPulser(2, 3),
  TurnoutPulser(4, 5),
  TurnoutPulser(6, 7),
  TurnoutPulser(8, 9)
};

int outPins[] = { 4, 5, 6 };

SoftwareSerial tamSouthSerial(11, 10);

const size_t capacity = 20 * JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + 60;
DynamicJsonDocument doc(capacity);

boolean newData = false;
const byte numChars = 256;
char receivedChars[numChars]; 

void setup() {
  tamSouthSerial.begin(9600);
  Serial.begin(9600);
  Serial.println("<TamSouth is listening>");

  for (int idx = 0; idx < (sizeof(outPins) / sizeof(outPins[0])); idx++) {
    pinMode(outPins[idx], OUTPUT);
  }

  for (int idx = 0; idx < (sizeof(turnouts) / sizeof(turnouts[0])); idx++) {
    turnouts[idx].begin();
  }
  // tamSouthSerial.println("<TamSouth is transmitting>");
  Serial.println("<TamSouth is setup>");
}

void loop() {

  for (int idx = 0; idx < (sizeof(turnouts) / sizeof(turnouts[0])); idx++) {
    turnouts[idx].loop();
  }

  // if (tamSouthSerial.available())
  //     handleInput();

  // recvWithEndMarker(); // check for incoming data
  // showNewData();

  if (tamSouthSerial.available() > 0) {
    Serial.println("handleInput");
    handleInput();
  }
}

void recvWithEndMarker() {
    static byte ndx = 0;
    char endMarker = '\n';
    char rc;
    
    while (tamSouthSerial.available() > 0 && newData == false) {
        rc = tamSouthSerial.read();

        if (rc != endMarker) {
            receivedChars[ndx] = rc;
            ndx++;
            if (ndx >= numChars) {
                ndx = numChars - 1;
            }
        }
        else {
            receivedChars[ndx] = '\0'; // terminate the string
            ndx = 0;
            newData = true;
        }
    }
}

void showNewData() {
  if (newData == true) {
      Serial.print("This just in ... ");
      Serial.println(receivedChars);
  }
}


void handleInput() {
  String input = tamSouthSerial.readString();
  Serial.println(input);
  deserializeJson(doc, input);
  JsonArray array = doc.as<JsonArray>();
  for (JsonVariant v : array) {
    handleAction(v, input);
  }
}

void handleAction(JsonVariant v, String input) {
  String action = v["action"];
  JsonObject payload = v["payload"];

  Serial.print("Action: ");
  Serial.println(action);
  Serial.print("payload: ");
  Serial.println(payload);

  if (action == "pin") {
    // handlePin(payload);
  } else if (action == "servo") {
    // handleServo(payload);
  } else if (action == "turnout") {
    handleTurnout(payload);
  } else if (action == "ialed") {
    // handleLED(payload);
  }
}

void handleTurnout(JsonObject payload) {
  int turnoutIdx = payload["turnout"];
  bool state = payload["state"];
  turnouts[turnoutIdx].set(state);
  Serial.print("turnoutIdx: ");
  Serial.println(turnoutIdx);
  Serial.print("state: ");
  Serial.println(state);
}
