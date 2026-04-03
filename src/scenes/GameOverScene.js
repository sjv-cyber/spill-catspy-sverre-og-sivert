import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  init(data) {
    this.roomId = data?.roomId
    this.cause = data?.cause ?? 'spotted'
  }

  create() {
    this.cameras.main.setBackgroundColor('rgba(180, 20, 20, 0.8)')

    const title = this.cause === 'laser' ? 'BURNED THROUGH' : 'DETECTED!'
    const sub =
      this.cause === 'laser'
        ? 'ARGUS beam grid — time the off-cycle or use cover.'
        : 'Vision cone or contact — try cat form, hide, or retreat.'

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 28, title, {
        fontSize: '44px',
        fontFamily: 'monospace',
        color: '#fff',
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 22, sub, {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#e8c8c8',
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 100 },
      })
      .setOrigin(0.5)

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 72, 'R — retry this room', {
        fontSize: '15px',
        fontFamily: 'monospace',
        color: '#ddd',
      })
      .setOrigin(0.5)

    let gone = false
    const retry = () => {
      if (gone) return
      gone = true
      this.scene.start('Room', { roomId: this.roomId })
    }
    this.time.delayedCall(2200, retry)
    this.input.keyboard.once('keydown-R', retry)
  }
}
