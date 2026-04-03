import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'

export class BetaCompleteScene extends Phaser.Scene {
  constructor() {
    super('BetaComplete')
  }

  init(data) {
    this.roomId = data?.roomId ?? 'room_cell_01'
  }

  create() {
    this.cameras.main.setBackgroundColor('#0d1f14')

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'SLICE COMPLETE', {
      fontSize: '42px',
      fontFamily: 'monospace',
      color: '#7fdc9a',
    }).setOrigin(0.5)

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, 'Cell → corridor → exit. Two-room slice OK.', {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#9a9',
      align: 'center',
      wordWrap: { width: GAME_WIDTH - 80 },
    }).setOrigin(0.5)

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70, 'ENTER — title   R — replay from cell', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#6a8a6a',
    }).setOrigin(0.5)

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Title')
    })

    this.input.keyboard.once('keydown-R', () => {
      this.scene.start('Room', { roomId: 'room_cell_01' })
    })
  }
}
