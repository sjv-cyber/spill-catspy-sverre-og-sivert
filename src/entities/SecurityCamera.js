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

    this.x = spec.x * tileWorldSize + tileWorldSize / 2
    this.y = spec.y * tileWorldSize + tileWorldSize / 2
    this.facingAngle = this.baseAngle

    this.glow = scene.add.circle(this.x, this.y, 5, 0xff1a3a, 0.9)
    this.glow.setStrokeStyle(1, 0xff88aa)
    this.glow.setDepth(4)

    this.arm = scene.add.rectangle(this.x + 8, this.y + 4, 20, 6, 0x4a3a40, 0.85)
    this.arm.setStrokeStyle(1, 0x2a2028)
    this.arm.setDepth(3)
  }

  update(time) {
    this.facingAngle = this.baseAngle + Math.sin((time + this.phase) * 0.001 * this.sweepSpeed) * this.sweep
    this.glow.setPosition(this.x, this.y)
    this.arm.setPosition(this.x + Math.cos(this.facingAngle) * 10, this.y + Math.sin(this.facingAngle) * 8)
    this.arm.setRotation(this.facingAngle)
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

  destroy() {
    this.glow?.destroy()
    this.arm?.destroy()
    this.glow = null
    this.arm = null
  }
}
