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

/**
 * @param {Array<{ getWatcherState: () => object }>} guards
 * @param {Array<{ getWatcherState: () => object }>} cameras
 */
export function checkDetection(guards, cameras, player, wallGrid, tileWorldSize) {
  const b = player.getBounds()
  const px = b.x + b.width / 2
  const py = b.y + b.height / 2
  const mul = player.isHuman ? HUMAN.detectionRangeMultiplier : CAT.detectionRangeMultiplier

  const all = [...guards, ...cameras]
  for (const w of all) {
    const st = w.getWatcherState()
    if (watcherSeesPlayer(st, px, py, wallGrid, tileWorldSize, mul)) return true
  }
  return false
}
