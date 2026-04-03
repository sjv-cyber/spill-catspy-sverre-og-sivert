import { GAME_WIDTH, GAME_HEIGHT } from './config.js'
import { BootScene } from './scenes/BootScene.js'
import { TitleScene } from './scenes/TitleScene.js'
import { RoomScene } from './scenes/RoomScene.js'
import { GameOverScene } from './scenes/GameOverScene.js'
import { PauseScene } from './scenes/PauseScene.js'

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 980 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, RoomScene, GameOverScene, PauseScene],
  pixelArt: true,
}

const game = new Phaser.Game(config)
