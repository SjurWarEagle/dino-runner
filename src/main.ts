import Phaser from 'phaser';

import Game from './scenes/Game';
import Preloader from './scenes/Preloader';
import GameOver from '~/scenes/GameOver';
import StartPage from '~/scenes/StartPage';

const runningLocally =
  (window.location.href as string).toLocaleLowerCase().indexOf('localhost') !==
  -1;

const config: Phaser.Types.Core.GameConfig = {
  parent: 'mygame',
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: '#2646c6',
  scale: {
    mode: Phaser.Scale.FIT,
    // ...
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 100 },
      debug: runningLocally,
    },
  },
  scene: [Preloader, Game, GameOver, StartPage],
};

export default new Phaser.Game(config);
