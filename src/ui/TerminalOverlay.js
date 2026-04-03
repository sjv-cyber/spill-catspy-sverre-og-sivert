import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'

/**
 * CRT-style fullscreen overlay. Closes on E / Esc / click dimmer.
 */
export class TerminalOverlay {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ title: string, lines?: string[], onClose?: () => void }} opts
   */
  constructor(scene, opts) {
    this.scene = scene
    this.onClose = opts.onClose
    const d = 190

    this.dim = scene.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH + 8, GAME_HEIGHT + 8, 0x050805, 0.9)
      .setScrollFactor(0)
      .setDepth(d)
      .setInteractive()

    const pw = Math.min(720, GAME_WIDTH - 40)
    const ph = Math.min(400, GAME_HEIGHT - 56)
    this.panel = scene.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, pw, ph, 0x0c0808, 0.97)
      .setStrokeStyle(2, 0xcc3038)
      .setScrollFactor(0)
      .setDepth(d + 1)

    const sep = '='.repeat(26)
    const body = [opts.title || 'LOG', sep, '', ...(opts.lines || [])].join('\n')
    this.text = scene.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 8, body, {
        fontSize: '13px',
        fontFamily: 'monospace',
        color: '#ff9a9a',
        align: 'left',
        lineSpacing: 4,
        wordWrap: { width: pw - 40 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(d + 2)

    this.hint = scene.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 30, 'E / ESC / click — close', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#7a5058',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(d + 2)

    this._onKey = (ev) => {
      if (ev.key === 'Escape' || ev.key === 'e' || ev.key === 'E') this.close()
    }
    scene.input.keyboard.on('keydown', this._onKey)
    this.dim.once('pointerdown', () => this.close())
  }

  close() {
    if (this._gone) return
    this._gone = true
    this.scene.input.keyboard.off('keydown', this._onKey)
    this.dim?.destroy()
    this.panel?.destroy()
    this.text?.destroy()
    this.hint?.destroy()
    this.onClose?.()
  }
}
