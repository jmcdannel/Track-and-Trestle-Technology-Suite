# Track and Trestle Technology

This suite of applications is designed and developed to support a model railroad using a [DCC-EX EX-CommandStation](https://dcc-ex.com/ex-commandstation/index.html) and additional Arduinos, Raspberry Pis or other devices that support the required protocols. The applications communicate using [MQTT 📡](https://mqtt.org/). The apps (Throttle App, Dispatcher App, Dashboard App) publish commands like throttle speed and direction, turnouts, or effects like lights, sounds and signals. The servers (DEJA.js for DCC commands, Action API for Arduinos and other supported interfaces) subscibe to those commands, process them, and then send them to the appropriate interface. DEJA.js sends [DCC-EX Native Commands]https://dcc-ex.com/reference/software/command-summary-consolidated.html via Serial over USB to the DCC-EX CommandStation, while the ActionAPI sends serial commands to usb-connected Arduinos.

## ✨ Features

- 💄 Beautiful DCC locomotive throttles designed for ease of use
- 💻 Connect to PC/Mac/Linux/Pi via USB
- 🎛️ Control turnouts - servos or momentary relays (Kato switches!)
- 💡 Toggle lights, 🪩 IALEDs and 🚦 Signals
- 🎼 Play sounds
- 🛤️ Toggle routes
- ✨ Toggle relays, control motor drivers, juice frogs, control LCDs
- 👑 Rule over your tiny world

> [TODO] => INSERT ARCHITECURE DIAGRAM

## Usage

### Prerequisites for all configurations

1. 📦 [Install & Configure DCC-EX CommandStation](https://dcc-ex.com/ex-commandstation/index.html) via USB to Mac/PC/Linux/Raspberry Pi
2. 📦 Install NodeJS 21+ on Mac/PC/Linux/Raspberry Pi
  - Install NVM, Node 21 [Recommended] 
    > `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
    ```
    $ nvm install 21
    ```
  - OR: Install Node 21

2. 📦 Install Lerna
  ```
  $ npm install -g lerna
  ```

3. Configure Environments
> See package README files for configuration instructions.

### Run all packages Locally
```
$ lerna run start
```

---

### Bare Minumum [DEJA.js] + [Throttle]

1. 📦 Install DEJA.js
2. 🚀 Launch Throttle App

<p align="center">
  <img src="./.resources/img/ttt-architecture3.png" alt="Basic Architecture Diagram" />
</p>

---

### [DEJA.js] + [ActionAPI] + [App] + [Dispatcher]

1. 📦 Install DEJA.js
2. 📦 Install ActionApi
3. 📝 Configure App
4. 🚀 Launch Dispatcher

<p align="center">
  <img src="./.resources/img/ttt-architecture2.png" alt="Basic Architecture Diagram" />
</p>

### [DEJA.js] + [ActionAPI] + [App] + [Dispatcher] + [Throttle] + [Dashboard]

1. 📦 Install DEJA.js
2. 📦 Install ActionApi
3. 📝 Configure App
4. 🚀 Launch Dashboard
4. 🚀 Launch Throttle
4. 🚀 Launch Dispatcher

<p align="center">
  <img src="./.resources/img/ttt-architecture1.png" alt="Basic Architecture Diagram" />
</p>



### DCC-EC

// 🛰️ DEJA.js Server
 
## Packages

### 🧠 Action Api

The Action API listens to commands sent from the Throttle App, Dispatcher App or Dashboard and sends or executes those commands on the target interface. Supported interfaces include:
- Arduino via USB
- Raspberry Pi Pico W (via MQTT)
- Audio output

- Required [App]

---
### 🚆 Dispatcher App

React App that handles all layout operations including throttles, turnouts and effects.

<p align="center">
  <img src="./.resources/img/screenshots/dispatcher-1.png" alt="Size Limit CLI" width="100%">
</p>

<p align="center">
  <img src="./.resources/img/screenshots/dispatcher-2.png" alt="Size Limit CLI" width="100%">
</p>

---
### 🎚️ Throttle App

VueJS app for simple throttle operations.

<p align="center">
  <img src="./.resources/img/screenshots/throttle-1.png" alt="Size Limit CLI" width="360">
  <img src="./.resources/img/screenshots/throttle-2.png" alt="Size Limit CLI" width="360">
  <img src="./.resources/img/screenshots/throttle-3.png" alt="Size Limit CLI" width="360">
</p>

---
### 🔱 TTT App

NextJS app hosted on Vercel. The main purpose of this package is to provide secure REST API access to MongoDB. Future enhancements will include landing pages, documentation, demos, and the Dashboard App.

---
### 🎛️ Dashboard App

Preact app that displays layout information about the DCC-EX EX-CommandStation.

- 🪵 DCC Command Log
- 💥 DCC-EX EX-CommandStation Status and Stats
- 📈 Current Usage in Miliamps
- 🚄 Active Locomotive Speeds


---
### 🧬  IO

This package contains source code for the devices found in Tamarack Junction - the author's model railroad. These scripts are specific for each device and the connections to those devices. Future improvements to these scripts will allow each device to run a single source package and configured using `config.h` files.


## Resources

# 🚂🚆🚇🚊🚉🛰️🚀🚦🚧⛰️🛤️📱💻📡🎛️⚙️⚠️🔱🟢🟣🔵🟠🟡🔴❤️‍🔥🎼🧩✨☄️🍀☘️🌲🕶️🧠🔗🖲f🏓🪢🧶🎨👑🔈🔀🔁

### Layouts

// TODO: Describe
### Locos

// TODO: Describe
### Turnouts

// TODO: Describe
### Effects

// TODO: Describe
### Routes

// TODO: Describe
### Sensors

