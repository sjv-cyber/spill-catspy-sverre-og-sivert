import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  init(data) {
    this.roomId = data.roomId
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(180, 20, 20, 0.8)')

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'DETECTED!', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#fff',
    }).setOrigin(0.5)

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 'Press R to retry', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ddd',
    }).setOrigin(0.5)

    this.input.keyboard.on('keydown-R', () => {
      this.scene.start('Room', { roomId: this.roomId })
    })

    this.time.delayedCall(1500, () => {
      this.scene.start('Room', { roomId: this.roomId })
    })
  }
}
