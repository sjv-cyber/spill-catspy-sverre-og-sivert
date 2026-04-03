import { HUMAN, CAT, TRANSFORM_COOLDOWN } from '../config.js'
import { InputManager } from '../systems/InputManager.js'

export class Player {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x world center
   * @param {number} y world center
   */
  constructor(scene, x, y) {
    this.scene = scene
    this.isHuman = true
    this.input = new InputManager(scene)

    this.sprite = scene.add.rectangle(x, y, HUMAN.width, HUMAN.height, 0x6b8cae)
    this.sprite.setStrokeStyle(2, 0x4a6a8a)
    scene.physics.add.existing(this.sprite)
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const body = this.sprite.body
    body.setCollideWorldBounds(true)
    body.setMaxVelocity(500, HUMAN.maxFallSpeed)

    this.coyoteMs = 0
    this.jumpBufferMs = 0
    this.lastTransformAt = -Infinity
  }

  getBody() {
    return this.sprite.body
  }

  getBounds() {
    return this.sprite.getBounds()
  }

  applyFormPhysics() {
    const cfg = this.isHuman ? HUMAN : CAT
    const body = this.sprite.body
    this.sprite.setDisplaySize(cfg.width, cfg.height)
    body.setSize(cfg.width, cfg.height)
    if (body.refreshBody) body.refreshBody()
    body.setMaxVelocity(500, cfg.maxFallSpeed)
    this.sprite.setFillStyle(this.isHuman ? 0x6b8cae : 0x1a1a22)
    this.sprite.setStrokeStyle(2, this.isHuman ? 0x4a6a8a : 0x33ff88)
  }

  transform() {
    const now = this.scene.time.now
    if (now - this.lastTransformAt < TRANSFORM_COOLDOWN) return
    this.lastTransformAt = now
    this.isHuman = !this.isHuman
    this.applyFormPhysics()
  }

  /**
   * @param {number} dt ms
   */
  update(dt) {
    const cfg = this.isHuman ? HUMAN : CAT
    const body = this.sprite.body
    const onGround = body.blocked.down || body.touching.down

    if (onGround) this.coyoteMs = cfg.coyoteTime
    else this.coyoteMs = Math.max(0, this.coyoteMs - dt)

    if (this.input.jumpPressed) this.jumpBufferMs = cfg.jumpBuffer
    else this.jumpBufferMs = Math.max(0, this.jumpBufferMs - dt)

    if (this.input.left) body.velocity.x = -cfg.speed
    else if (this.input.right) body.velocity.x = cfg.speed
    else body.velocity.x *= Math.pow(0.2, dt / 100)

    if (this.jumpBufferMs > 0 && this.coyoteMs > 0) {
      body.velocity.y = cfg.jumpVelocity
      this.jumpBufferMs = 0
      this.coyoteMs = 0
    }

    if (body.velocity.y > cfg.maxFallSpeed) body.velocity.y = cfg.maxFallSpeed

    if (this.input.transformPressed) this.transform()
  }

  destroy() {
    if (this.sprite) this.sprite.destroy()
    this.sprite = null
  }
}
