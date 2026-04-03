import { GAME_WIDTH, GAME_HEIGHT, TILE_SCALE } from '../config.js'
import { loadManifest, resolveRoomPath, loadRoomData, buildRoom } from '../systems/RoomLoader.js'
import { normalizeRoomData, resolvePlayerSpawnTile, tileRectToWorld } from '../systems/roomMetadata.js'
import { Player } from '../entities/Player.js'
import { Guard } from '../entities/Guard.js'
import { SecurityCamera } from '../entities/SecurityCamera.js'
import { Scientist } from '../entities/Scientist.js'
import { MaintenanceRobot } from '../entities/MaintenanceRobot.js'
import { AlarmLight } from '../entities/AlarmLight.js'
import { checkDetection, playerInHideZone, argusCameraSeesPlayer } from '../systems/DetectionSystem.js'
import { playCatSfx, playUiSfx } from '../systems/CatSfx.js'
import { LaserHazard } from '../entities/LaserHazard.js'
import { TerminalOverlay } from '../ui/TerminalOverlay.js'
import { markRoomVisited, setProgressFlag } from '../systems/ProgressStore.js'
import {
  playTransformFlash,
  playTerminalPulse,
  playGateUnlock,
} from '../systems/CatSpyVfx.js'

export class RoomScene extends Phaser.Scene {
  constructor() {
    super('Room')
  }

  init(data) {
    this.roomId = data?.roomId ?? 'room_cell_01'
    this.fromRoomId = data?.fromRoomId ?? null
    this._built = null
    this.roomData = null
    this.player = null
    this.exitRect = null
    this.returnRect = null
    this.entryTextObj = null
    this.errorText = null
    this.guards = []
    this.camerasArgus = []
    this.scientists = []
    this.maintenanceRobots = []
    this.alarmLights = []
    this._onTransformFx = null
    this._exitConsumed = false
    this._returnConsumed = false
    this.roomState = 'idle'
    this._losClearFrames = 0
    this.exitLocked = false
    this.bossEngaged = false
    this.bossClearInteractUsed = false
    this.stateHud = null
    this.bossTriggerRect = null
    this._mapOpen = false
    this._mapDim = null
    this._mapImg = null
    this._prevCatInHide = false
    this.lasers = []
    this._terminal = null
    this._terminalOpen = false
  }

  create() {
    this.runRoomLoad()
  }

  async runRoomLoad() {
    try {
      const manifest = await loadManifest()
      const path = resolveRoomPath(this.roomId, manifest)
      const raw = await loadRoomData(path)
      this.buildGameplay(normalizeRoomData(raw))
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

  _drawGrayboxOverlay(tileWorldSize) {
    const d = this.roomData
    const dz = d.danger_zone
    if (dz) {
      const r = tileRectToWorld(dz, tileWorldSize)
      const g = this.add.rectangle(r.x + r.width / 2, r.y + r.height / 2, r.width, r.height, 0xff2200, 0.12)
      g.setStrokeStyle(2, 0xff4444, 0.35)
      g.setDepth(0)
    }
    const ip = d.interaction_point
    if (ip) {
      const r = tileRectToWorld(ip, tileWorldSize)
      const g = this.add.rectangle(r.x + r.width / 2, r.y + r.height / 2, r.width, r.height, 0x44ff88, 0.08)
      g.setStrokeStyle(2, 0x88ffaa, 0.45)
      g.setDepth(0)
    }
    const cr = d.cat_route_hint
    if (cr) {
      const r = tileRectToWorld(cr, tileWorldSize)
      const g = this.add.rectangle(r.x + r.width / 2, r.y + r.height / 2, r.width, r.height, 0x44ccff, 0.06)
      g.setStrokeStyle(2, 0x66ddff, 0.35)
      g.setDepth(0)
    }
  }

  _spawnWorldLabels(tileWorldSize) {
    const labels = this.roomData.world_labels
    if (!Array.isArray(labels)) return
    for (const L of labels) {
      const x = L.x * tileWorldSize + tileWorldSize / 2
      const y = L.y * tileWorldSize + tileWorldSize / 2
      this.add
        .text(x, y, L.text, {
          fontSize: `${L.size ?? 11}px`,
          fontFamily: 'monospace',
          color: L.color ?? '#9ab0c8',
        })
        .setOrigin(0.5)
        .setDepth(3)
        .setAlpha(L.alpha ?? 0.75)
    }
  }

  buildGameplay(roomData) {
    this.roomData = roomData
    const tileWorldSize = (roomData.tileSize ?? 16) * TILE_SCALE
    const worldW = roomData.width * tileWorldSize
    const worldH = roomData.height * tileWorldSize
    const bgKey = roomData.background || 'bg_cell'
    if (this.textures.exists(bgKey)) {
      const bg = this.add.image(0, 0, bgKey).setOrigin(0, 0).setDepth(-100)
      const trimRatio = roomData.background_trim_bottom_ratio ?? 0
      if (trimRatio > 0 && trimRatio < 0.95) {
        const src = bg.texture.getSourceImage()
        const tw = src.naturalWidth || src.width
        const th = src.naturalHeight || src.height
        const trimPx = Math.floor(th * trimRatio)
        if (trimPx > 0 && trimPx < th) {
          bg.setCrop(0, 0, tw, th - trimPx)
        }
      }
      bg.setDisplaySize(worldW, worldH)
      bg.setTint(roomData.background_tint ?? 0xaaaab8)
    }

    const built = buildRoom(this, roomData)
    this._built = built

    this.physics.world.setBounds(0, 0, built.worldWidth, built.worldHeight)
    this.physics.world.gravity.y = roomData.gravity ?? 980

    this.cameras.main.setBounds(0, 0, built.worldWidth, built.worldHeight)
    this.cameras.main.roundPixels = true

    this._drawGrayboxOverlay(tileWorldSize)
    this._spawnWorldLabels(tileWorldSize)

    const spawnTile = resolvePlayerSpawnTile(roomData, this.fromRoomId)
    const playerSpawnPixels = {
      x: spawnTile.x * tileWorldSize + tileWorldSize / 2,
      y: spawnTile.y * tileWorldSize + tileWorldSize / 2,
    }

    const ez = built.exitZone
    this.exitRect = new Phaser.Geom.Rectangle(ez.x, ez.y, ez.width, ez.height)

    const door = this.add.rectangle(ez.x + ez.width / 2, ez.y + ez.height / 2, ez.width, ez.height, 0xff8844, 0.18)
    door.setStrokeStyle(2, 0xffcc66)
    door.setDepth(1)
    this._forwardDoorGfx = door
    this.add
      .text(ez.x + ez.width / 2, ez.y - 6, 'EXIT', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#ffcc88',
      })
      .setOrigin(0.5, 1)
      .setDepth(2)

    const re = roomData.return_exit
    if (re?.target_room_id) {
      const rr = tileRectToWorld(
        { x: re.x, y: re.y, w: re.w ?? 2, h: re.h ?? 3 },
        tileWorldSize
      )
      this.returnRect = new Phaser.Geom.Rectangle(rr.x, rr.y, rr.width, rr.height)
      const rg = this.add.rectangle(rr.x + rr.width / 2, rr.y + rr.height / 2, rr.width, rr.height, 0x6688ff, 0.12)
      rg.setStrokeStyle(2, 0x88aaff)
      rg.setDepth(1)
      this.add
        .text(rr.x + rr.width / 2, rr.y - 6, 'BACK', {
          fontSize: '10px',
          fontFamily: 'monospace',
          color: '#aac8ff',
        })
        .setOrigin(0.5, 1)
        .setDepth(2)
    }

    const bt = roomData.boss_trigger
    if (bt && roomData.lock_behavior === 'boss') {
      const br = tileRectToWorld(
        { x: bt.x, y: bt.y, w: bt.w ?? 4, h: bt.h ?? 3 },
        tileWorldSize
      )
      this.bossTriggerRect = new Phaser.Geom.Rectangle(br.x, br.y, br.width, br.height)
      const bx = this.add.rectangle(br.x + br.width / 2, br.y + br.height / 2, br.width, br.height, 0xff00aa, 0.08)
      bx.setStrokeStyle(1, 0xff66cc, 0.4)
      bx.setDepth(0)
    }

    this.player = new Player(this, playerSpawnPixels.x, playerSpawnPixels.y)
    this.physics.add.collider(this.player.sprite, built.staticGroup)

    const gSpecs = [...(roomData.entities?.guards ?? []), ...(roomData.entities?.mutants ?? [])]
    for (const spec of gSpecs) {
      this.guards.push(new Guard(this, spec, built.tileWorldSize))
    }

    const cSpecs = roomData.entities?.cameras ?? []
    for (const spec of cSpecs) {
      this.camerasArgus.push(new SecurityCamera(this, spec, built.tileWorldSize))
    }

    const sSpecs = roomData.entities?.scientists ?? []
    for (const spec of sSpecs) {
      this.scientists.push(new Scientist(this, spec, built.tileWorldSize))
    }

    const robots = roomData.entities?.robots ?? []
    for (const r of robots) {
      this.maintenanceRobots.push(new MaintenanceRobot(this, r, tileWorldSize))
    }

    for (const L of roomData.alarm_lights ?? []) {
      const r = tileRectToWorld(
        { x: L.x, y: L.y, w: L.w ?? 1, h: L.h ?? 1 },
        tileWorldSize
      )
      const cx = r.x + r.width / 2
      const cy = r.y + r.height / 2
      this.alarmLights.push(new AlarmLight(this, cx, cy, Math.max(12, r.width * 0.8)))
    }

    const lSpecs = roomData.entities?.lasers ?? []
    for (const spec of lSpecs) {
      this.lasers.push(new LaserHazard(this, spec, built.tileWorldSize))
    }

    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12, 0, -32)
    this.cameras.main.setDeadzone(80, 60)

    const ds = roomData.default_state ?? 'idle'
    this.roomState = ds === 'locked_boss' ? 'locked' : ds
    if (this.roomState === 'locked' && roomData.lock_behavior === 'boss') {
      this.exitLocked = true
      this.bossEngaged = true
    }

    const entry = roomData.entry_text ?? ''
    if (entry) {
      this.entryTextObj = this.add.text(GAME_WIDTH / 2, 28, entry, {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#c8e6c9',
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 48 },
      })
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(100)

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

    this.stateHud = this.add
      .text(12, GAME_HEIGHT - 52, '', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#8899aa',
      })
      .setScrollFactor(0)
      .setDepth(50)

    this._setupMapOverlay()

    this.add
      .text(12, GAME_HEIGHT - 36, 'Move A/D · Jump SPACE · Transform T · Interact E · Map M · ESC pause', {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#666',
      })
      .setScrollFactor(0)
      .setDepth(50)

    this.add
      .text(12, GAME_HEIGHT - 18, 'Graybox slice · retreat rooms: slip LOS to calm guards · boss: overload console (E)', {
        fontSize: '10px',
        fontFamily: 'monospace',
        color: '#555',
      })
      .setScrollFactor(0)
      .setDepth(50)

    this._onTransformFx = (ev) => {
      playTransformFlash(this, ev.x, ev.y)
    }
    this.events.on('catspy-player-transform', this._onTransformFx)

    markRoomVisited(roomData.room_id)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanupRoom())
  }

  _gateTilesWorldCenter(tileWorldSize) {
    const tiles = this.roomData?.extra_solid_tiles ?? []
    if (!tiles.length) return null
    let sx = 0
    let sy = 0
    for (const t of tiles) {
      sx += t.x
      sy += t.y
    }
    const n = tiles.length
    return {
      x: (sx / n) * tileWorldSize + tileWorldSize / 2,
      y: (sy / n) * tileWorldSize + tileWorldSize / 2,
    }
  }

  _removeGateSolids() {
    const solids = this._built?.gateSolids ?? []
    for (const rect of solids) {
      this._built.staticGroup.remove(rect, true, true)
    }
    solids.length = 0
  }

  _setupMapOverlay() {
    if (!this.textures.exists('eagles_nest_map')) return

    this._mapDim = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0a1210, 0.82)
      .setScrollFactor(0)
      .setDepth(180)
      .setVisible(false)

    this._mapImg = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'eagles_nest_map')
      .setScrollFactor(0)
      .setDepth(181)
      .setVisible(false)

    const padX = 40
    const padY = 48
    const maxW = GAME_WIDTH - padX * 2
    const maxH = GAME_HEIGHT - padY * 2
    const sx = maxW / this._mapImg.width
    const sy = maxH / this._mapImg.height
    this._mapImg.setScale(Math.min(sx, sy))
  }

  _setMapOpen(open) {
    this._mapOpen = open
    if (this._mapDim) this._mapDim.setVisible(open)
    if (this._mapImg) this._mapImg.setVisible(open)
    if (open && this.player?.sprite?.body) {
      this.player.sprite.body.setVelocity(0, 0)
    }
  }

  cleanupRoom() {
    this._terminal?.close()
    this._terminal = null
    this._terminalOpen = false

    for (const L of this.lasers) L.destroy()
    this.lasers = []

    if (this._onTransformFx) {
      this.events.off('catspy-player-transform', this._onTransformFx)
      this._onTransformFx = null
    }
    for (const g of this.guards) g.destroy()
    this.guards = []
    for (const c of this.camerasArgus) c.destroy()
    this.camerasArgus = []
    for (const s of this.scientists) s.destroy()
    this.scientists = []
    for (const b of this.maintenanceRobots) b.destroy()
    this.maintenanceRobots = []
    for (const a of this.alarmLights) a.destroy()
    this.alarmLights = []

    if (this._built?.staticGroup) {
      this._built.staticGroup.clear(true, true)
    }
    if (this.player) {
      this.player.destroy()
      this.player = null
    }
    this._built = null
    this.exitRect = null
    this.returnRect = null
    this.entryTextObj = null
    this.roomData = null
    this.stateHud = null
    this.bossTriggerRect = null
    this._mapDim?.destroy()
    this._mapImg?.destroy()
    this._mapDim = null
    this._mapImg = null
    this._mapOpen = false
    this._prevCatInHide = false
  }

  _playerPixelCenter() {
    const b = this.player.getBounds()
    return { px: b.x + b.width / 2, py: b.y + b.height / 2 }
  }

  _updateDoorVisual() {
    if (!this._forwardDoorGfx) return
    if (this.exitLocked) {
      this._forwardDoorGfx.setFillStyle(0x662222, 0.45)
      this._forwardDoorGfx.setStrokeStyle(2, 0xff4444)
    } else {
      this._forwardDoorGfx.setFillStyle(0xff8844, 0.18)
      this._forwardDoorGfx.setStrokeStyle(2, 0xffcc66)
    }
  }

  _tryInteractables(tileWorldSize) {
    const list = this.roomData.interactables
    if (!Array.isArray(list) || !this.player.input.interactPressed) return

    const b = this.player.getBounds()
    const pb = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height)

    for (const it of list) {
      if (it.requires_human && !this.player.isHuman) continue
      const r = tileRectToWorld(
        { x: it.x, y: it.y, w: it.w ?? 2, h: it.h ?? 2 },
        tileWorldSize
      )
      const zone = new Phaser.Geom.Rectangle(r.x, r.y, r.width, r.height)
      if (!Phaser.Geom.Rectangle.Overlaps(pb, zone)) continue

      const action = it.action
      if (action === 'suppress_cameras') {
        const ms = it.duration_ms ?? 5500
        for (const c of this.camerasArgus) c.suppressFor(ms)
        const cx = r.x + r.width / 2
        const cy = r.y + r.height / 2
        playTerminalPulse(this, cx, cy)
        return
      }
      if (action === 'open_gate') {
        this._removeGateSolids()
        const gc = this._gateTilesWorldCenter(tileWorldSize)
        if (gc) playGateUnlock(this, gc.x, gc.y)
        return
      }
      if (action === 'hack_robot') {
        const rid = it.robot_id
        if (rid) {
          for (const bot of this.maintenanceRobots) {
            if (bot.id === rid) bot.hack()
          }
        }
        if (it.open_gate === true) {
          this._removeGateSolids()
          const gc = this._gateTilesWorldCenter(tileWorldSize)
          if (gc) playGateUnlock(this, gc.x, gc.y)
        }
        return
      }
      if (action === 'clear_boss') {
        if (this.roomData.lock_behavior === 'boss' && this.bossEngaged) {
          this.exitLocked = false
          this.roomState = 'cleared'
          this.bossClearInteractUsed = true
        }
        return
      }
      if (action === 'terminal_log') {
        const logId = it.log_id
        const pack = this.cache.json.get('terminal_logs')
        const entry = pack?.logs?.[logId]
        if (!entry) return
        playUiSfx(this, 'terminal')
        this._terminalOpen = true
        if (this.player?.sprite?.body) this.player.sprite.body.setVelocity(0, 0)
        this._terminal = new TerminalOverlay(this, {
          title: entry.title,
          lines: entry.lines,
          onClose: () => {
            this._terminal = null
            this._terminalOpen = false
            if (logId === 'obs_lab_01') setProgressFlag('janus_hint', true)
            if (logId === 'janus_closet_01') setProgressFlag('janus_mug', true)
          },
        })
        return
      }
    }

    if (!this.player.isHuman) {
      for (const it of list) {
        if (!it.requires_human) continue
        const r = tileRectToWorld(
          { x: it.x, y: it.y, w: it.w ?? 2, h: it.h ?? 2 },
          tileWorldSize
        )
        const zone = new Phaser.Geom.Rectangle(r.x, r.y, r.width, r.height)
        if (Phaser.Geom.Rectangle.Overlaps(pb, zone)) {
          playCatSfx(this, 'hiss')
          return
        }
      }
    }
  }

  update(time, delta) {
    if (!this.player || !this.exitRect || !this._built?.wallGrid) return

    if (this.player.input.mapPressed) {
      this._setMapOpen(!this._mapOpen)
    }

    if (this._mapOpen) {
      if (this.player.input.pausePressed) {
        this._setMapOpen(false)
        this.scene.pause()
        this.scene.launch('Pause')
      }
      return
    }

    if (this._terminalOpen) {
      if (this.player.input.pausePressed) {
        this._terminal?.close()
        this.scene.pause()
        this.scene.launch('Pause')
      }
      return
    }

    const tileWorldSize = this._built.tileWorldSize
    const now = this.time.now
    const { px, py } = this._playerPixelCenter()

    for (const c of this.camerasArgus) c.update(time)
    for (const c of this.camerasArgus) {
      if (
        argusCameraSeesPlayer(c, this.player, this._built.wallGrid, tileWorldSize, {
          hideZones: this.roomData.entities?.hideZones,
          now,
        })
      ) {
        c.pulseLensIfHot(now)
      }
    }
    for (const g of this.guards) g.update(time, delta)
    for (const s of this.scientists) s.update(time, delta, px, py)
    for (const b of this.maintenanceRobots) b.update(time, delta)

    for (const L of this.lasers) L.update(time)

    this.player.update(delta)

    const hideZones = this.roomData.entities?.hideZones
    const catInHide = playerInHideZone(this.player, hideZones, tileWorldSize)
    if (catInHide && !this._prevCatInHide) {
      playCatSfx(this, 'hide')
    }
    this._prevCatInHide = catInHide

    if (this.bossTriggerRect && this.roomData.lock_behavior === 'boss' && !this.bossEngaged) {
      const pb = new Phaser.Geom.Rectangle(
        this.player.getBounds().x,
        this.player.getBounds().y,
        this.player.getBounds().width,
        this.player.getBounds().height
      )
      if (Phaser.Geom.Rectangle.Overlaps(pb, this.bossTriggerRect)) {
        this.bossEngaged = true
        this.exitLocked = true
        this.roomState = 'locked'
        playUiSfx(this, 'alarm', { volume: 0.34 })
        this.cameras.main.shake(420, 0.011)
      }
    }

    this._tryInteractables(tileWorldSize)

    const lb = this.player.getBounds()
    const laserRect = new Phaser.Geom.Rectangle(lb.x, lb.y, lb.width, lb.height)
    for (const L of this.lasers) {
      if (L.hits(laserRect)) {
        this.scene.start('GameOver', { roomId: this.roomId, cause: 'laser' })
        return
      }
    }

    if (this.player.input.pausePressed) {
      this.scene.pause()
      this.scene.launch('Pause')
    }

    const spotted = checkDetection(
      this.guards,
      this.camerasArgus,
      this.player,
      this._built.wallGrid,
      this._built.tileWorldSize,
      {
        hideZones: this.roomData.entities?.hideZones,
        now,
      }
    )

    const retreat = this.roomData.supports_retreat === true
    const isBossRoom = this.roomData.lock_behavior === 'boss'

    if (spotted) {
      this._losClearFrames = 0
      if (!retreat || isBossRoom) {
        this.scene.start('GameOver', { roomId: this.roomId })
        return
      }
      this.roomState = 'combat'
    } else if (retreat && this.roomState === 'combat') {
      this._losClearFrames += 1
      if (this._losClearFrames > 72) {
        this.roomState = 'idle'
      }
    }

    const alertish = this.roomState === 'combat' || this.roomState === 'alert'
    for (const g of this.guards) g.setAlertMode(alertish && retreat)

    if (retreat && alertish) {
      for (const g of this.guards) {
        if (!g.sprite) continue
        const d = Math.hypot(px - g.sprite.x, py - g.sprite.y)
        if (d < 52) {
          this.scene.start('GameOver', { roomId: this.roomId })
          return
        }
      }
    }

    if (this.stateHud) {
      const lockNote = this.exitLocked ? ' · EXIT LOCKED' : ''
      this.stateHud.setText(
        `${this.roomData.room_id} · ${this.roomState}${lockNote} · type:${this.roomData.room_type}`
      )
    }

    this._updateDoorVisual()

    const pb = new Phaser.Geom.Rectangle(
      this.player.getBounds().x,
      this.player.getBounds().y,
      this.player.getBounds().width,
      this.player.getBounds().height
    )

    if (this.returnRect && !this._returnConsumed && !this.exitLocked) {
      if (Phaser.Geom.Rectangle.Overlaps(pb, this.returnRect)) {
        this._returnConsumed = true
        const back = this.roomData.return_exit.target_room_id
        this.scene.start('Room', { roomId: back, fromRoomId: this.roomData.room_id })
        return
      }
    }

    const canUseForwardExit = !this.exitLocked
    if (
      canUseForwardExit
      && !this._exitConsumed
      && Phaser.Geom.Rectangle.Overlaps(pb, this.exitRect)
    ) {
      this._exitConsumed = true
      const next = this.roomData?.next_room_id
      if (next) {
        this.scene.start('Room', { roomId: next, fromRoomId: this.roomData.room_id })
      } else {
        const variant = this.roomData.room_id === 'room_janus_closet' ? 'janus' : 'slice'
        this.scene.start('BetaComplete', { roomId: this.roomId, variant })
      }
    }
  }
}
