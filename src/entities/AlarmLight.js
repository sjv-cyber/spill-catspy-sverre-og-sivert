/**
 * Pulsing red industrial strobe — gameplay-readable, small footprint.
 */
export class AlarmLight {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} cx world center x
   * @param {number} cy world center y
   * @param {number} [size]
   */
  constructor(scene, cx, cy, size = 14) {
    this.scene = scene
    this.sprite = scene.add.rectangle(cx, cy, size, size * 0.65, 0xff2222, 0.55)
    this.sprite.setStrokeStyle(2, 0x661010)
    this.sprite.setDepth(3)

    scene.tweens.add({
      targets: this.sprite,
      alpha: { from: 0.25, to: 0.95 },
      duration: 420,
      yoyo: true,
      repeat: -1,
    })
  }

  destroy() {
    this.scene.tweens.killTweensOf(this.sprite)
    this.sprite?.destroy()
    this.sprite = null
  }
}
