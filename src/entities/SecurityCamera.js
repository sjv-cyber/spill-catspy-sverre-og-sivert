/**
 * Ceiling ARGUS-style camera: sweeps facingAngle for vision checks (no physics body).
 */
export class SecurityCamera {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x: number, y: number, baseAngle: number, sweep: number, sweepSpeed: number, range: number, coneAngle: number, phaseOffset?: number }} spec — tile coords for x,y
   * @param {number} tileWorldSize
   */
  constructor(scene, spec, tileWorldSize) {
    this.scene = scene
    this.baseAngle = spec.baseAngle
    this.sweep = spec.sweep
    this.sweepSpeed = spec.sweepSpeed
    this.range = spec.range
    this.coneAngle = spec.coneAngle
    this.phase = spec.phaseOffset ?? 0
    /** @type {number} */
    this.suppressUntilMs = 0

    this.x = spec.x * tileWorldSize + tileWorldSize / 2
    this.y = spec.y * tileWorldSize + tileWorldSize / 2
    this.facingAngle = this.baseAngle

    if (scene.textures.exists('prop_camera')) {
      this.gfx = scene.add.sprite(this.x, this.y, 'prop_camera')
      this.gfx.setDisplaySize(44, 44)
      this.gfx.setDepth(4)
    } else {
      this.gfx = scene.add.circle(this.x, this.y, 8, 0xff1a3a, 0.9)
      this.gfx.setDepth(4)
    }
  }

  update(time) {
    this.facingAngle = this.baseAngle + Math.sin((time + this.phase) * 0.001 * this.sweepSpeed) * this.sweep
    this.gfx.setPosition(this.x, this.y)
    if (typeof this.gfx.setRotation === 'function') {
      this.gfx.setRotation(this.facingAngle + Math.PI / 2)
    }
  }

  getWatcherState() {
    return {
      visionX: this.x,
      visionY: this.y,
      facingAngle: this.facingAngle,
      coneRange: this.range,
      coneAngle: this.coneAngle,
    }
  }

  /**
   * @param {number} ms
   */
  suppressFor(ms) {
    const now = this.scene.time.now
    this.suppressUntilMs = Math.max(this.suppressUntilMs, now + ms)
  }

  /**
   * @param {number} now
   */
  isSuppressed(now) {
    return now < this.suppressUntilMs
  }

  destroy() {
    this.gfx?.destroy()
    this.gfx = null
  }
}
