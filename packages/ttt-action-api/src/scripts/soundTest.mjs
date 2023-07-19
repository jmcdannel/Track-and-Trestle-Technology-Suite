import { Howl, Howler } from 'howler';
import log from '../core/logger.mjs';

const SOUND = 'bbc_coach-horn_07035057.mp3';
const playSound = async () => {
  log.debug('[AUDIOPLAYER] playSound', SOUND);
  var sound = new Howl({
    src: [SOUND],
    autoplay: true,
    loop: true,
    volume: 1,
    onend: function() {
      log.complete('Finished!');
    }
  });
  
  await sound.play();

}

await playSound();
