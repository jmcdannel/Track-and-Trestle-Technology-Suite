# Track & Trastle Suite & DCC-JS Roadmap

## TTT

### MVC TODO:

[x] select /clear loco / layout
[x] quick links to turnouts (drawer, buttons?)
[x] ~quick links to locos~
[x] fix turnout bug/delay
[x] ui beatification
[x] environemnt config
[x] connect to serial devices, action api
[x] pico led w/json
[x] convert dispatcher to dcc api (remove jmri dep, use DCC-JS)
[x] dispatcher interface connection refactor
[x] dcc-ex turnouts
[x] action api servos
[x] dispatcher effects
[x] led strips
[x] fix sounds
[x] signals
[-] dispatcher macros
[x] DCC functions
--
[x] clean up connections / env / config
[x] tam junc config - servos 
[ ] slots/compose/inherit base component for status list - refactor (vue and react) - wait for graphql?
[x] ssl localhost (https://stackoverflow.com/questions/69417788/vite-https-on-localhost)

[x] stop all
[x] verrical UI (or respnsive horiztonal?)
[x] keep alive
[x] disconnect bug
[-] GrpahQL / better state management
[-] convert to typescript
[ ] write unit tests
[ ] handheld throttle (bluetooth?)
[x] status display (mounted screen/tv?)
[ ] ad hoc loco (enter loco address:___ [Acquire])
[ ] icons to svg files

### DCC-JS

[x] Fork DCC-JS
  [ ] release v0.1.0? DCC-EX-JS-API [DEJA.js - the DCC-EX JavaScript API by Track & Trestle Technology (Josh McDannel)]


  - DCC-JS EX-API Server
  - DCC-JS DEJA Throttle (hosted, self hosted)
  - DCC-JS DEJA Dispatcher (hosted, self hosted)
  - Future:
    - DCC-JS Programmer (hosted, self hosted)
    - DCC-JS (hosted, self hosted-wifi)
    - Plugins (custom serial connections, servers, automation)


#### Bugs:
[ ] mqtt Disconnect
[-] dispatcher throttle state on reload


### TODO

[-] Interchange Route Map + Helix

[-] Power / Main Control UI
[ ] Clean Mem (localStorage, sessionStorage)
[?] Route Button UI
[ ] Motion
[ ] Route Map styles to show status
[ ] Mobile optimization
[ ] Auto-version on release to main - show in header
[ ] non-blaocking led
[ ] Fucntions UI / Icons
[ ] Macro Effects
[ ] Turnout Effects

[x] show speed in available throttle
[ ] effect state management
[ ] zustand optimization

[x] platform lighting
[-] city street/sidewalks
[-] city bridge
[ ] city buildings

[-] dashboard UI
[x] dashboard DCC log
[ ] dashboard dcc command
[-] dashboard throttle status

[ ] README
[ ] hotfix branch
[ ] explore vercel options

[ ] Sky
[ ] Pi