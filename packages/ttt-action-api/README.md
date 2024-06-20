#  Actions API

> Control Turnouts, Lights, Sounds, Animations, Frogs and Relays, Signals and more on your layout.

The Action API is installed and run on a supporting device (PC/Mac/Linux/Pi) and communicates with a connected Arduino over serial. It receives commands from the TTT Dispatcher app. The API recieves two basic types of commands: Turnouts and Effects. The API communicates over MQTT on the following channels:

-`@ttt/dispatcher/[LAYOUT_ID]`
-`@ttt/turnout/[LAYOUT_ID]`

## 🚀 Getting Started

Create a `.env` file and define `MONGODB_URI` with your MongoDB URI.

### 📦 Prerequisites

See 

### 📦 Installation

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

#### Signal

#### Sound

#### IALED

#### Macro

## 🛠️ Built With

* [![Node][Node.js]][Node-url]
* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![Vue][Vue.js]][Vue-url]
* [![Angular][Angular.io]][Angular-url]
* [![Svelte][Svelte.dev]][Svelte-url]
* [![Laravel][Laravel.com]][Laravel-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url]


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Node.js]: https://img.shields.io/badge/node.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 