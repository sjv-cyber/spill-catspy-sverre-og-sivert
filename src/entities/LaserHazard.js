import { LASER } from '../config.js'

/**
 * Axis-aligned laser sweep between two tile coordinates (same row or same column).
 * @param {Phaser.Scene} scene
 * @param {{ x1: number, y1: number, x2: number, y2: number, on_ms?: number, off_ms?: number, phase_ms?: number, thickness_px?: number }} spec
 * @param {number} tileWorldSize
 */
export class LaserHazard {
  constructor(scene, spec, tileWorldSize) {
    this.scene = scene
    const tw = tileWorldSize
    this.cx1 = spec.x1 * tw + tw / 2
    this.cy1 = spec.y1 * tw + tw / 2
    this.cx2 = spec.x2 * tw + tw / 2
    this.cy2 = spec.y2 * tw + tw / 2
    this.thickness = spec.thickness_px ?? 10
    this.onMs = spec.on_ms ?? LASER.defaultOnDuration
    this.offMs = spec.off_ms ?? LASER.defaultOffDuration
    this.phase = spec.phase_ms ?? 0

    const pad = this.thickness / 2
    this.hitRect = new Phaser.Geom.Rectangle(
      Math.min(this.cx1, this.cx2) - pad,
      Math.min(this.cy1, this.cy2) - pad,
      Math.abs(this.cx2 - this.cx1) + this.thickness,
      Math.abs(this.cy2 - this.cy1) + this.thickness
    )

    this.active = true
    this.glow = scene.add.graphics().setDepth(3.5)
    this.beam = scene.add.graphics().setDepth(4)
  }

  update(time) {
    const cycle = this.onMs + this.offMs
    const t = (((time + this.phase) % cycle) + cycle) % cycle
    this.active = t < this.onMs

    this.glow.clear()
    this.beam.clear()

    const core = this.active ? 0xff2a4a : 0x4a1828
    const glowC = this.active ? 0xff6688 : 0x3a2030
    const wCore = this.active ? this.thickness : this.thickness * 0.45
    const wGlow = wCore + 8

    this._strokeLine(this.glow, wGlow, glowC, this.active ? 0.35 : 0.12)
    this._strokeLine(this.beam, wCore, core, this.active ? 0.92 : 0.2)
  }

  _strokeLine(gfx, width, color, alpha) {
    gfx.lineStyle(width, color, alpha)
    gfx.beginPath()
    gfx.moveTo(this.cx1, this.cy1)
    gfx.lineTo(this.cx2, this.cy2)
    gfx.strokePath()
  }

  /**
   * @param {Phaser.Geom.Rectangle} rect
   */
  hits(rect) {
    if (!this.active) return false
    return Phaser.Geom.Rectangle.Overlaps(this.hitRect, rect)
  }

  destroy() {
    this.glow?.destroy()
    this.beam?.destroy()
    this.glow = null
    this.beam = null
  }
}
