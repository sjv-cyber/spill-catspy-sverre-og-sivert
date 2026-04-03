import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'
import { markSliceComplete } from '../systems/ProgressStore.js'

export class BetaCompleteScene extends Phaser.Scene {
  constructor() {
    super('BetaComplete')
  }

  init(data) {
    this.roomId = data?.roomId ?? 'room_cell_01'
    this.variant = data?.variant ?? 'slice'
  }

  create() {
    markSliceComplete()

    this.cameras.main.setBackgroundColor('#0d1f14')

    if (this.variant === 'janus') {
      this.cameras.main.setBackgroundColor('#1a1028')
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 56, 'JANUS ACKNOWLEDGED', {
          fontSize: '36px',
          fontFamily: 'monospace',
          color: '#d8a8e8',
        })
        .setOrigin(0.5)

      this.add
        .text(
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2 - 6,
          'You found the route that does not appear on the Eagle map.\nThe mug remembers you.',
          {
            fontSize: '15px',
            fontFamily: 'monospace',
            color: '#b8a0c8',
            align: 'center',
            wordWrap: { width: GAME_WIDTH - 72 },
          }
        )
        .setOrigin(0.5)
    } else {
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, 'SLICE COMPLETE', {
        fontSize: '42px',
        fontFamily: 'monospace',
        color: '#7fdc9a',
      }).setOrigin(0.5)

      this.add
        .text(
          GAME_WIDTH / 2,
          GAME_HEIGHT / 2 + 10,
          'Cell through containment arena — retreat, lasers, terminals, boss lock. Good run.',
          {
            fontSize: '15px',
            fontFamily: 'monospace',
            color: '#9a9',
            align: 'center',
            wordWrap: { width: GAME_WIDTH - 80 },
          }
        )
        .setOrigin(0.5)
    }

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 86, 'ENTER — title   R — replay from cell   J — Janus closet', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#6a8a6a',
      })
      .setOrigin(0.5)

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('Title')
    })

    this.input.keyboard.once('keydown-R', () => {
      this.scene.start('Room', { roomId: 'room_cell_01' })
    })

    this.input.keyboard.once('keydown-J', () => {
      this.scene.start('Room', { roomId: 'room_janus_closet' })
    })
  }
}
