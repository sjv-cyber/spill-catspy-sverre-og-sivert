/**
 * Panicked researcher graybox: flees along a short vector when the player is near.
 */
export class Scientist {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ x: number, y: number, flee_x?: number, flee_y?: number, triggerRadius?: number, speed?: number }} spec — tile coords
   * @param {number} tileWorldSize
   */
  constructor(scene, spec, tileWorldSize) {
    this.scene = scene
    this.speed = spec.speed ?? 95
    this.triggerRadius = spec.triggerRadius ?? 220
    const fx = spec.flee_x ?? spec.x + 4
    const fy = spec.flee_y ?? spec.y
    this.fleeX = fx * tileWorldSize + tileWorldSize / 2
    this.fleeY = fy * tileWorldSize + tileWorldSize / 2

    const x = spec.x * tileWorldSize + tileWorldSize / 2
    const y = spec.y * tileWorldSize + tileWorldSize / 2

    this.sprite = scene.add.rectangle(x, y, 28, 44, 0xa8c4e8, 0.85)
    this.sprite.setStrokeStyle(2, 0x6a8ab0)
    this.sprite.setDepth(6)
    this.done = false
  }

  update(_time, _delta, playerCenterX, playerCenterY) {
    if (this.done || !this.sprite) return
    const dx = playerCenterX - this.sprite.x
    const dy = playerCenterY - this.sprite.y
    if (Math.hypot(dx, dy) < this.triggerRadius) {
      const tx = this.fleeX - this.sprite.x
      const ty = this.fleeY - this.sprite.y
      const d = Math.hypot(tx, ty)
      if (d < 8) {
        this.done = true
        return
      }
      const step = this.speed * (_delta / 1000)
      this.sprite.x += (tx / d) * step
      this.sprite.y += (ty / d) * step
    }
  }

  destroy() {
    this.sprite?.destroy()
    this.sprite = null
  }
}
