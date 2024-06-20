#  Actions API

> Control Turnouts, Lights, Sounds, Animations, Frogs and Relays, Signals and more on your layout.

The Action API is installed and run on a supporting device (PC/Mac/Linux/Pi) and communicates with a connected Arduino over serial. It receives commands from the TTT Dispatcher app. The API recieves two basic types of commands: Turnouts and Effects. The API communicates over MQTT on the following channels:

-`@ttt/dispatcher/[LAYOUT_ID]`
-`@ttt/turnout/[LAYOUT_ID]`

## 🚀 Getting Started

Create a `.env` file and define `MONGODB_URI` with your MongoDB URI.

### 📦 Prerequisites

See [Global Prerequisites](../../README.md)

### 📦 Installation

```sh
pnpm install
pnpm run start
```

## 🧩 Usage

Run `pnpm run start` from this directory (`./packages/ttt-action-api/`) or `pnpm run start:action-api` from the monrepo root.

Layout interface config for Action API:
```json
{
  "_id": {
    "$oid": "649b5d6aaa24e693eaa6dd3b"
  },
  "layoutId": "LAYOUT_ID",
  ...
  "interfaces": [
    {
      "id": "action-api",
      "type": "action-api"
    },
    ...
  ]
}
```

Layout interface config for connected arduino:
```json
{
  "_id": {
    "$oid": "649b5d6aaa24e693eaa6dd3b"
  },
  "layoutId": "LAYOUT_ID",
  ...
  "interfaces": [
    {
      "id": "betatrack-io",
      "type": "serial",
      "config": {
        "baud": 115200
      }
    },
    ...
  ]
}
```

### Turnouts

#### Servos

```json
{
  "config": {
    "interface": "[DEVICE_ID]",
    "servo": 0, // servo location on PCA9685 board
    "divergent": 50, // divergent angle between 0 and 256
    "straight": 100, // divergent angle between 0 and 256
    "type": "servo",
    "effectId": 199 // optionally execute an effect when the turnout is thrown. Effect state will equal turnout state.
  },
  "name": "MY SERVO SWITCH 1", // descriptive name
  "state": true, // inital state
  "turnoutId": 101 // Unique ID
}
```

#### Kato / Pulse Relay

```json
{
  "config": {
    "interface": "[DEVICE_ID]",
    "turnoutIdx": 1, // Index of `TurnoutPulser` array defined in Arduino Sketch (see ttt-io)
    "type": "kato",
    "effectId": 200 // optionally execute an effect when the turnout is thrown. Effect state will equal turnout state.
  },
  "name": "MY KATO SWITCH 2",  // descriptive name
  "state": false, // inital state
  "turnoutId": 102 // Unique ID
},
```

### Effects

#### Light / Pin / Relay / Frog / Power

```json
{
  "config": {
    "interface":"[DEVICE_ID]",
    "pin": 5
  },
  "effectId": 101,
  "name": "LED",
  "state": 0,
  "type": "pin"
},
```

#### Signal

```json
{
  "config": {
    "green": 49,
    "yellow": 51,
    "red": 53
  },
  "effectId": 217,
  "name": "3-way Signal",
  "state": false,
  "type": "signal"
},
```

#### Sound

```json
{
  "config": {
    "file": "diesel-train-arrives-and-departs.wav",
    "interface": "audio"
  },
  "effectId": 204,
  "name": "Traain Come & Go",
  "state": 0,
  "type": "sound"
},
```

#### IALED

```json
{
  "config": {
    "interface": "[IALED_DEVICE_ID]",
    "pin": 2,
    "start": 0,
    "end": 10,
    "command": "color",
    "r": 200,
    "g": 0,
    "b": 0
  },
  "effectId": 302,
  "name": "Red LED",
  "state": 0,
  "type": "ialed"
},
```

#### Macro

```json
{
  "config": {
    "on": [
      225
    ],
    "off": [
      221
    ]
  },
  "effectId": 200,
  "name": "Siding 1 Signals",
  "state": 0,
  "type": "macro"
},
```
