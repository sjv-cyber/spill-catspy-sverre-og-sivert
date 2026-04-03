import { GAME_WIDTH, GAME_HEIGHT } from '../config.js'
import { loadManifest, resolveRoomPath, loadRoomData, buildRoom } from '../systems/RoomLoader.js'
import { Player } from '../entities/Player.js'

export class RoomScene extends Phaser.Scene {
  constructor() {
    super('Room')
  }

  init(data) {
    this.roomId = data?.roomId ?? 'room_cell_01'
    this._built = null
    this.player = null
    this.exitRect = null
    this.entryTextObj = null
    this.errorText = null
  }

  create() {
    this.runRoomLoad()
  }

  async runRoomLoad() {
    try {
      const manifest = await loadManifest()
      const path = resolveRoomPath(this.roomId, manifest)
      const roomData = await loadRoomData(path)
      this.buildGameplay(roomData)
    } catch (err) {
      console.error(err)
      this.errorText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `Room load failed:\n${err.message}`, {
        fontSize: '16px',
        fontFamily: 'monospace',
        color: '#ff6666',
        align: 'center',
      }).setOrigin(0.5)
      this.input.keyboard.once('keydown', () => this.scene.start('Title'))
    }
  }

  buildGameplay(roomData) {
    const built = buildRoom(this, roomData)
    this._built = built

    this.physics.world.setBounds(0, 0, built.worldWidth, built.worldHeight)
    this.physics.world.gravity.y = roomData.gravity ?? 980

    this.cameras.main.setBounds(0, 0, built.worldWidth, built.worldHeight)
    this.cameras.main.roundPixels = true

    const ez = built.exitZone
    this.exitRect = new Phaser.Geom.Rectangle(ez.x, ez.y, ez.width, ez.height)

    const doorVis = this.add.rectangle(
      ez.x + ez.width / 2,
      ez.y + ez.height / 2,
      ez.width,
      ez.height,
      0x44aa66,
      0.25
    )
    doorVis.setStrokeStyle(2, 0x66cc88)

    this.player = new Player(this, built.playerSpawnPixels.x, built.playerSpawnPixels.y)
    this.player.applyFormPhysics()
    this.physics.add.collider(this.player.sprite, built.staticGroup)

    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12)
    this.cameras.main.setDeadzone(80, 60)

    const entry = roomData.entry_text ?? ''
    if (entry) {
      this.entryTextObj = this.add.text(GAME_WIDTH / 2, 28, entry, {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#c8e6c9',
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 48 },
      }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100)

      this.time.delayedCall(4500, () => {
        if (!this.entryTextObj?.active) return
        this.tweens.add({
          targets: this.entryTextObj,
          alpha: 0,
          duration: 600,
          onComplete: () => this.entryTextObj?.destroy(),
        })
      })
    }

    this.add.text(12, GAME_HEIGHT - 22, 'Move A/D · Jump SPACE · Transform T · ESC pause', {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: '#666',
    }).setScrollFactor(0).setDepth(50)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanupRoom())
  }

  cleanupRoom() {
    if (this._built?.staticGroup) {
      this._built.staticGroup.clear(true, true)
    }
    if (this.player) {
      this.player.destroy()
      this.player = null
    }
    this._built = null
    this.exitRect = null
    this.entryTextObj = null
  }

  update(time, delta) {
    if (!this.player || !this.exitRect) return

    this.player.update(delta)

    if (this.player.input.pausePressed) {
      this.scene.pause()
      this.scene.launch('Pause')
    }

    const b = this.player.getBounds()
    const pb = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height)
    if (Phaser.Geom.Rectangle.Overlaps(pb, this.exitRect)) {
      this.scene.start('BetaComplete', { roomId: this.roomId })
    }
  }
}
