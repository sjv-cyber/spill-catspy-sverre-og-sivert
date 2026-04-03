import { playRobotHackBurst } from '../systems/CatSpyVfx.js'

const PATROL_SPEED = 42

/**
 * Graybox maintenance unit: chunky silhouette, toxic-green sensor, optional micro-patrol.
 */
export class MaintenanceRobot {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ id?: string, x: number, y: number, patrol?: {x:number,y:number}[] }} spec
   * @param {number} tileWorldSize
   */
  constructor(scene, spec, tileWorldSize) {
    this.scene = scene
    this.id = spec.id ?? `robot_${spec.x}_${spec.y}`
    this.hacked = false
    this.tileWorldSize = tileWorldSize

    const cx = spec.x * tileWorldSize + tileWorldSize / 2
    const cy = spec.y * tileWorldSize + tileWorldSize / 2

    this.container = scene.add.container(cx, cy)
    this.container.setDepth(4)

    const body = scene.add.rectangle(0, -8, 38, 24, 0x5c6670, 1)
    body.setStrokeStyle(2, 0x1e2528)

    this.eye = scene.add.rectangle(11, -12, 7, 5, 0x33ee66, 1)
    this.eye.setStrokeStyle(1, 0x113311)

    const legL = scene.add.rectangle(-10, 6, 8, 10, 0x4a5560, 1).setStrokeStyle(1, 0x22282c)
    const legR = scene.add.rectangle(10, 6, 8, 10, 0x4a5560, 1).setStrokeStyle(1, 0x22282c)
    const ant = scene.add.rectangle(-14, -18, 3, 10, 0x3d4850, 1)

    this.container.add([body, legL, legR, ant, this.eye])

    const raw = spec.patrol && spec.patrol.length >= 2 ? spec.patrol : null
    this.waypoints = raw
      ? raw.map((t) => ({
          x: t.x * tileWorldSize + tileWorldSize / 2,
          y: t.y * tileWorldSize + tileWorldSize / 2,
        }))
      : []
    this.wpIndex = this.waypoints.length > 1 ? 1 : 0
    this.waitUntil = 0
  }

  /**
   * @param {number} time
   * @param {number} delta
   */
  update(time, delta) {
    if (this.hacked || this.waypoints.length < 2) return
    if (time < this.waitUntil) return

    const target = this.waypoints[this.wpIndex]
    const dx = target.x - this.container.x
    const dy = target.y - this.container.y
    const dist = Math.hypot(dx, dy)

    if (dist < 4) {
      this.wpIndex = (this.wpIndex + 1) % this.waypoints.length
      this.waitUntil = time + 600
      return
    }

    const step = PATROL_SPEED * (delta / 1000)
    this.container.x += (dx / dist) * step
    this.container.y += (dy / dist) * step
  }

  hack() {
    if (this.hacked) return
    this.hacked = true
    playRobotHackBurst(this.scene, this.container.x, this.container.y - 8)
    this.eye.setFillStyle(0x88ffaa, 1)
    this.scene.tweens.add({
      targets: this.eye,
      alpha: 0.35,
      yoyo: true,
      repeat: 5,
      duration: 120,
      onComplete: () => {
        this.eye.setAlpha(1)
        this.eye.setFillStyle(0x224422, 1)
      },
    })
  }

  destroy() {
    this.container?.destroy(true)
    this.container = null
  }
}
