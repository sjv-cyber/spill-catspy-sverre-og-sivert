import { TILE_SCALE } from '../config.js'

const MANIFEST_PATH = 'assets/rooms/manifest.json'

export async function loadManifest() {
  const res = await fetch(MANIFEST_PATH)
  if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`)
  return res.json()
}

export function resolveRoomPath(roomId, manifest) {
  if (manifest?.rooms?.[roomId]?.path) return manifest.rooms[roomId].path
  return `assets/rooms/${roomId}.json`
}

export async function loadRoomData(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load room ${path}: ${res.status}`)
  return res.json()
}

/**
 * @param {Phaser.Scene} scene
 * @param {object} roomData
 * @returns {{ staticGroup: Phaser.Physics.Arcade.StaticGroup, gateSolids: Phaser.GameObjects.GameObject[], worldWidth: number, worldHeight: number, tileWorldSize: number, wallGrid: number[][], playerSpawnPixels: { x: number, y: number }, exitZone: { x: number, y: number, width: number, height: number }, roomData: object }}
 */
export function buildRoom(scene, roomData) {
  const tileSize = roomData.tileSize ?? 16
  const tileWorldSize = tileSize * TILE_SCALE
  const w = roomData.width
  const h = roomData.height
  const walls = roomData.layers?.walls
  if (!walls || walls.length !== h || walls[0].length !== w) {
    throw new Error('Room walls grid size mismatch with width/height')
  }

  const staticGroup = scene.physics.add.staticGroup()

  const gateSolids = []

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      if (walls[row][col] !== 1) continue
      const cx = col * tileWorldSize + tileWorldSize / 2
      const cy = row * tileWorldSize + tileWorldSize / 2
      const rect = scene.add.rectangle(cx, cy, tileWorldSize, tileWorldSize, 0x080a10)
      rect.setAlpha(0.62)
      rect.setStrokeStyle(1, 0x3a4a62)
      scene.physics.add.existing(rect, true)
      staticGroup.add(rect)
    }
  }

  const extras = Array.isArray(roomData.extra_solid_tiles) ? roomData.extra_solid_tiles : []
  for (const t of extras) {
    const col = t.x
    const row = t.y
    if (row < 0 || col < 0 || row >= h || col >= w) continue
    const cx = col * tileWorldSize + tileWorldSize / 2
    const cy = row * tileWorldSize + tileWorldSize / 2
    const rect = scene.add.rectangle(cx, cy, tileWorldSize, tileWorldSize, 0x2a1810)
    rect.setAlpha(0.75)
    rect.setStrokeStyle(1, 0x8a5a40)
    scene.physics.add.existing(rect, true)
    staticGroup.add(rect)
    gateSolids.push(rect)
  }

  const spawn = roomData.playerSpawn
  const playerSpawnPixels = {
    x: spawn.x * tileWorldSize + tileWorldSize / 2,
    y: spawn.y * tileWorldSize + tileWorldSize / 2,
  }

  const ex = roomData.exit
  const ew = ex.w ?? 1
  const eh = ex.h ?? 2
  const exitZone = {
    x: ex.x * tileWorldSize,
    y: ex.y * tileWorldSize,
    width: ew * tileWorldSize,
    height: eh * tileWorldSize,
  }

  return {
    staticGroup,
    gateSolids,
    worldWidth: w * tileWorldSize,
    worldHeight: h * tileWorldSize,
    tileWorldSize,
    wallGrid: walls,
    playerSpawnPixels,
    exitZone,
    roomData,
  }
}
