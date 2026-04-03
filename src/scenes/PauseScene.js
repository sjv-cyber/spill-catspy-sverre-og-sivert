import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('Pause')
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6)

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'PAUSED', {
      fontSize: '36px',
      fontFamily: 'monospace',
      color: '#fff',
    }).setOrigin(0.5)

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'ESC to resume | R to restart', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#aaa',
    }).setOrigin(0.5)

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop()
      this.scene.resume('Room')
    })
  }
}
