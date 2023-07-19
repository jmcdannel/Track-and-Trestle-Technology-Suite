let Afplay = require('afplay');

let player = new Afplay;

module.exports = class Player {
  constructor() {
    this.play = (sound) => {
      player.play(sound)
        .then(() => {
          console.log('[AFPLAERY] Audio done playing');
        })
        .catch(error => {
          console.log('[AFPLAERY] Error playing file');
        });

    }
  }
};
