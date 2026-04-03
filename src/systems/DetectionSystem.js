import { HUMAN, CAT, GUARD } from '../config.js'
import { isPointInCone, raycast } from '../utils/math.js'

/**
 * @param {number[][]} wallGrid
 * @param {number} tileWorldSize
 * @returns {(wpx: number, wpy: number) => boolean}
 */
export function makeWorldWallBlocker(wallGrid, tileWorldSize) {
  const rows = wallGrid.length
  const cols = wallGrid[0]?.length ?? 0
  return (wpx, wpy) => {
    const c = Math.floor(wpx / tileWorldSize)
    const r = Math.floor(wpy / tileWorldSize)
    if (r < 0 || c < 0 || r >= rows || c >= cols) return true
    return wallGrid[r][c] === 1
  }
}

/**
 * @param {{ visionX: number, visionY: number, facingAngle: number, coneRange?: number, coneAngle?: number }} watcher
 */
export function watcherSeesPlayer(watcher, playerCenterX, playerCenterY, wallGrid, tileWorldSize, rangeMultiplier = 1) {
  const range = (watcher.coneRange ?? GUARD.detectionRange) * rangeMultiplier
  const coneAngle = watcher.coneAngle ?? GUARD.coneAngle
  const gx = watcher.visionX
  const gy = watcher.visionY

  if (!isPointInCone(playerCenterX, playerCenterY, gx, gy, watcher.facingAngle, coneAngle, range)) {
    return false
  }

  const isBlocked = makeWorldWallBlocker(wallGrid, tileWorldSize)
  return raycast(gx, gy, playerCenterX, playerCenterY, isBlocked)
}

export function playerInHideZonePx(px, py, hideZones, tileWorldSize, isCat) {
  if (!isCat || !hideZones?.length) return false
  for (const z of hideZones) {
    const zx = z.x * tileWorldSize
    const zy = z.y * tileWorldSize
    const zw = (z.w ?? z.width ?? 1) * tileWorldSize
    const zh = (z.h ?? z.height ?? 1) * tileWorldSize
    if (px >= zx && px <= zx + zw && py >= zy && py <= zy + zh) return true
  }
  return false
}

/**
 * @param {{ getBounds: () => Phaser.Geom.Rectangle, isHuman: boolean }} player
 */
export function playerInHideZone(player, hideZones, tileWorldSize) {
  if (player.isHuman || !hideZones?.length) return false
  const b = player.getBounds()
  const px = b.x + b.width / 2
  const py = b.y + b.height / 2
  return playerInHideZonePx(px, py, hideZones, tileWorldSize, true)
}

/**
 * Single ARGUS camera, same rules as `checkDetection` (hide cat zones, suppression, range mul).
 * @param {{ getWatcherState: () => object, isSuppressed?: (t:number)=>boolean }} camera
 * @param {{ getBounds: () => Phaser.Geom.Rectangle, isHuman: boolean }} player
 */
export function argusCameraSeesPlayer(camera, player, wallGrid, tileWorldSize, options = {}) {
  const now = options.now ?? 0
  if (camera.isSuppressed?.(now)) return false
  const b = player.getBounds()
  const px = b.x + b.width / 2
  const py = b.y + b.height / 2
  const hideZones = options.hideZones
  if (playerInHideZonePx(px, py, hideZones, tileWorldSize, !player.isHuman)) return false
  const mul = player.isHuman ? HUMAN.detectionRangeMultiplier : CAT.detectionRangeMultiplier
  const st = camera.getWatcherState()
  return watcherSeesPlayer(st, px, py, wallGrid, tileWorldSize, mul)
}

/**
 * @param {Array<{ getWatcherState: () => object }>} guards
 * @param {Array<{ getWatcherState: () => object, isSuppressed?: (t:number)=>boolean }>} cameras
 * @param {{ hideZones?: object[], now?: number }} [options]
 */
export function checkDetection(guards, cameras, player, wallGrid, tileWorldSize, options = {}) {
  const b = player.getBounds()
  const px = b.x + b.width / 2
  const py = b.y + b.height / 2
  const mul = player.isHuman ? HUMAN.detectionRangeMultiplier : CAT.detectionRangeMultiplier
  const now = options.now ?? 0
  const hideZones = options.hideZones

  if (playerInHideZonePx(px, py, hideZones, tileWorldSize, !player.isHuman)) {
    return false
  }

  const activeCams = cameras.filter((c) => (c.isSuppressed ? !c.isSuppressed(now) : true))
  const all = [...guards, ...activeCams]
  for (const w of all) {
    const st = w.getWatcherState()
    if (watcherSeesPlayer(st, px, py, wallGrid, tileWorldSize, mul)) return true
  }
  return false
}
