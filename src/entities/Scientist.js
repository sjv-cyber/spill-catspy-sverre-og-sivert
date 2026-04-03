/**
 * Researcher graybox: lab-coat silhouette (readable CatSpy palette, not cute).
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

    this.container = scene.add.container(x, y)
    this.container.setDepth(6)

    const coat = scene.add.rectangle(0, 2, 30, 40, 0xd8e4e8, 0.92)
    coat.setStrokeStyle(2, 0x6a7a88)
    const skirt = scene.add.rectangle(0, 14, 34, 22, 0xc8d2d8, 0.9).setStrokeStyle(1, 0x5a6870)
    const legs = scene.add.rectangle(0, 28, 12, 14, 0x3a4550, 0.95).setStrokeStyle(1, 0x22282c)
    const head = scene.add.rectangle(0, -18, 16, 16, 0xc8b8a8, 1).setStrokeStyle(2, 0x6a6058)
    const hair = scene.add.rectangle(-2, -24, 18, 8, 0x4a4038, 1)
    const clipboard = scene.add.rectangle(16, 4, 8, 12, 0x2a3038, 0.9).setStrokeStyle(1, 0x8890a0)

    this.container.add([coat, skirt, legs, hair, head, clipboard])
    this.done = false
  }

  update(_time, _delta, playerCenterX, playerCenterY) {
    if (this.done || !this.container) return
    const dx = playerCenterX - this.container.x
    const dy = playerCenterY - this.container.y
    if (Math.hypot(dx, dy) < this.triggerRadius) {
      const tx = this.fleeX - this.container.x
      const ty = this.fleeY - this.container.y
      const d = Math.hypot(tx, ty)
      if (d < 8) {
        this.done = true
        return
      }
      const step = this.speed * (_delta / 1000)
      this.container.x += (tx / d) * step
      this.container.y += (ty / d) * step
    }
  }

  destroy() {
    this.container?.destroy(true)
    this.container = null
  }
}
