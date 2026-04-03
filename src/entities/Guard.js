import { GUARD } from '../config.js'

export class Guard {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ patrol: {x:number,y:number}[], coneRange?: number, coneAngle?: number, speed?: number }} spec
   * @param {number} tileWorldSize
   */
  constructor(scene, spec, tileWorldSize) {
    this.scene = scene
    const waypoints = (spec.patrol || []).map((t) => ({
      x: t.x * tileWorldSize + tileWorldSize / 2,
      y: t.y * tileWorldSize + tileWorldSize / 2,
    }))
    if (waypoints.length < 2) throw new Error('Guard needs at least 2 patrol waypoints')

    this.waypoints = waypoints
    this.wpIndex = 1
    const start = waypoints[0]

    const tex = scene.textures.exists('guard_pmc') ? 'guard_pmc' : null
    if (!tex) throw new Error('Missing guard_pmc texture')

    this.sprite = scene.add.sprite(start.x, start.y, tex)
    this.sprite.setDisplaySize(36, 52)
    this.sprite.setDepth(5)
    this.sprite.setFlipX(false)

    this.coneRange = spec.coneRange ?? GUARD.detectionRange
    this.coneAngle = spec.coneAngle ?? GUARD.coneAngle
    this.speed = spec.speed ?? GUARD.speed
    this.waitUntil = 0
    this.facingAngle = 0
    this._faceToward(waypoints[1])
  }

  _faceToward(target) {
    this.facingAngle = Math.atan2(target.y - this.sprite.y, target.x - this.sprite.x)
  }

  update(time, delta) {
    if (time < this.waitUntil) return

    const target = this.waypoints[this.wpIndex]
    const dx = target.x - this.sprite.x
    const dy = target.y - this.sprite.y
    const dist = Math.hypot(dx, dy)

    if (dist < 6) {
      this.wpIndex = (this.wpIndex + 1) % this.waypoints.length
      this.waitUntil = time + GUARD.waitDuration
      const next = this.waypoints[this.wpIndex]
      this._faceToward(next)
      return
    }

    this._faceToward(target)
    const step = this.speed * (delta / 1000)
    const nx = (dx / dist) * step
    const ny = (dy / dist) * step
    this.sprite.x += nx
    this.sprite.y += ny

    this.sprite.setFlipX(dx > 0)
  }

  getWatcherState() {
    return {
      visionX: this.sprite.x,
      visionY: this.sprite.y - 18,
      facingAngle: this.facingAngle,
      coneRange: this.coneRange,
      coneAngle: this.coneAngle,
    }
  }

  destroy() {
    this.sprite?.destroy()
    this.sprite = null
  }
}
