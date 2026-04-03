import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'
import { loadManifest } from '../systems/RoomLoader.js'
import { hasProgressFlag } from '../systems/ProgressStore.js'

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title')
  }

  create() {
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'title_screen')
    const sx = GAME_WIDTH / bg.width
    const sy = GAME_HEIGHT / bg.height
    bg.setScale(Math.max(sx, sy))
    bg.setDepth(-10)

    const janusLine = hasProgressFlag('janus_hint')
      ? '\nJ — Janus closet (you read the hint)'
      : '\nJ — secret route (no spoilers)'

    const hint = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 28,
        `ENTER / SPACE / click — Start   ·   O — Options${janusLine}`,
        {
          fontSize: '11px',
          fontFamily: 'monospace',
          color: '#c4dcc4',
          align: 'center',
        }
      )
      .setOrigin(0.5)
      .setDepth(10)
    hint.setShadow(0, 1, '#000000', 6, true, true)

    let optionsLine = null

    const startGame = async () => {
      let roomId = 'room_cell_01'
      try {
        const manifest = await loadManifest()
        if (manifest?.default_room_id) roomId = manifest.default_room_id
      } catch (_) {
        /* manifest optional */
      }
      this.scene.start('Room', { roomId })
    }

    const showOptionsStub = () => {
      if (optionsLine) return
      optionsLine = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 44, 'Options — coming soon', {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#e0c8a0',
      }).setOrigin(0.5).setDepth(11)
      optionsLine.setShadow(0, 1, '#000000', 4, true, true)
      this.time.delayedCall(2200, () => {
        optionsLine?.destroy()
        optionsLine = null
      })
    }

    const cleanupAndStart = () => {
      this.input.keyboard.off('keydown', onKey)
      this.input.off('pointerdown', onPointer)
      startGame()
    }

    const onKey = (ev) => {
      if (ev.key === 'j' || ev.key === 'J') {
        this.input.keyboard.off('keydown', onKey)
        this.input.off('pointerdown', onPointer)
        this.scene.start('Room', { roomId: 'room_janus_closet' })
        return
      }
      if (ev.key === 'o' || ev.key === 'O') {
        showOptionsStub()
        return
      }
      cleanupAndStart()
    }

    const onPointer = () => {
      cleanupAndStart()
    }

    this.input.keyboard.on('keydown', onKey)
    this.input.once('pointerdown', onPointer)

    this.input.gamepad?.once('down', cleanupAndStart)
  }
}
