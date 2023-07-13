# trestle-apps

## Usage

### Prerequisites
- NVM
  >> `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
- Deno 
  >>`curl -fsSL https://deno.land/x/install/install.sh | sh`

  or
  
  >>`brew install deno`
- Yarn
  >>` npm install -g yarn`
- Lerna
  >>` npm install -g lerna`

### Run
```
$ lerna run start
```

## Packages

### *Trestle-TT* Action Api

[NODE]

`ws://127.0.0.1:8080`

WebSocketServer receives messages for effects and turnouts and executes the actions from the server.

### *Trestle-TT* Action IO

[ARDUINO]

Arduino App to process action and turnout commands.

### *Trestle-TT* DCC Api

[NODE]

`ws://127.0.0.1:8080`

WebSocketServer receives messages and relays them via Serial connection to an Arduino connected via USB and running DCC-EX EX-CommandStation.

### *Trestle-TT* Dispatcher App

[REACT (cra)]

`http://[host]:3000`

React App that handles all layout operations including throttles, turnouts and effects.

### *Trestle-TT* Layout Api

[DENO]

`http://127.0.0.1:5000`

REST API to retrieve layout configuratoin and resources from MongoDB *trestledb*

### *Trestle-TT* State Api

[DENO]

`http://127.0.0.1:5001`

REST API to manage state of turnouts, effects and interfaces (e.g. Serail connected arduinos, onboard sound player)

### *Trestle-TT* Throttle App

[VueJS]

`http://[host]:5173`

VueJS app for simple layout operations - throttle, turnouts, effects.


## Resources

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

// TODO: Describe
