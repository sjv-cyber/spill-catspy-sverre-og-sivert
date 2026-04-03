import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'
import { loadManifest } from '../systems/RoomLoader.js'

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

    this.input.keyboard.once('keydown', startGame)

    this.input.gamepad?.once('down', startGame)
  }
}
