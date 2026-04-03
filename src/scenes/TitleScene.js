import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title')
  }

  create() {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, 'CATSPY', {
      fontSize: '64px',
      fontFamily: 'monospace',
      color: '#e0e0e0',
    }).setOrigin(0.5)

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 'Press any key to start', {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#888',
    }).setOrigin(0.5)

    this.input.keyboard.once('keydown', () => {
      this.scene.start('Room', { roomId: 'room_tutorial' })
    })

    this.input.gamepad?.once('down', () => {
      this.scene.start('Room', { roomId: 'room_tutorial' })
    })
  }
}
