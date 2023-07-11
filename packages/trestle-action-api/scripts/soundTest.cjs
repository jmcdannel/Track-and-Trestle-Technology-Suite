const player = require('play-sound')();

const SOUND = './bbc_coach-horn_07035057.mp3';
player.play(SOUND, (err) => {
    if (err) throw err;
});