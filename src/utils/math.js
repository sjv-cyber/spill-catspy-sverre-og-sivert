export function isPointInCone(px, py, gx, gy, facingAngle, coneAngle, range) {
  const dx = px - gx
  const dy = py - gy
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist > range) return false
  const angleToPlayer = Math.atan2(dy, dx)
  let diff = angleToPlayer - facingAngle
  diff = Math.atan2(Math.sin(diff), Math.cos(diff))
  return Math.abs(diff) <= coneAngle / 2
}

export function raycast(x1, y1, x2, y2, isBlocked) {
  const dx = x2 - x1
  const dy = y2 - y1
  const steps = Math.max(Math.abs(dx), Math.abs(dy))
  if (steps === 0) return true
  const sx = dx / steps
  const sy = dy / steps
  let cx = x1, cy = y1
  for (let i = 0; i < steps; i++) {
    cx += sx
    cy += sy
    if (isBlocked(Math.floor(cx), Math.floor(cy))) return false
  }
  return true
}
