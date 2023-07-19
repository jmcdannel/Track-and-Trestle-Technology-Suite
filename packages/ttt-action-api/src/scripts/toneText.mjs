import Tone from 'tone';

// const SOUND = 'bbc_coach-horn_07035057.mp3';
// const player = new Tone.Player(SOUND).toDestination();
// Tone.loaded().then(() => {
// 	player.start();
// });

const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();
Tone.loaded().then(() => {
	player.start();
});