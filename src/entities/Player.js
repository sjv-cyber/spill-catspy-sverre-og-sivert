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

    const key = scene.textures.exists('player_human') ? 'player_human' : null
    if (!key) {
      throw new Error('Missing texture player_human — BootScene must run first')
    }

    this.sprite = scene.physics.add.sprite(x, y, key)
    this.sprite.setDepth(10)
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setFlipX(false)

    this.coyoteMs = 0
    this.jumpBufferMs = 0
    this.lastTransformAt = -Infinity

    this.applyFormPhysics({ anchorFeet: false })
  }

  getBody() {
    return this.sprite.body
  }

  getBounds() {
    return this.sprite.getBounds()
  }

  _facingLeft() {
    return this.sprite.scaleX < 0
  }

  _applyScaleForForm(facingLeft) {
    const cfg = this.isHuman ? HUMAN : CAT
    const body = this.sprite.body
    const fw = Math.max(1, this.sprite.frame.width)
    const fh = Math.max(1, this.sprite.frame.height)
    const s = Math.min(cfg.width / fw, cfg.height / fh)
    this.sprite.setScale(facingLeft ? -s : s, s)
    body.setSize(cfg.width, cfg.height)
    body.setOffset(0, 0)
    if (body.refreshBody) body.refreshBody()
    body.setMaxVelocity(500, cfg.maxFallSpeed)
    body.updateFromGameObject?.()
  }

  /**
   * @param {{ anchorFeet?: boolean }} opts
   */
  applyFormPhysics(opts = {}) {
    const anchorFeet = opts.anchorFeet === true
    const body = this.sprite.body
    const tex = this.isHuman ? 'player_human' : 'player_cat'
    const facingLeft = this._facingLeft()

    let bottomBefore = null
    if (anchorFeet) {
      bottomBefore = this.sprite.getBounds().bottom
    }

    this.sprite.setTexture(tex)
    this._applyScaleForForm(facingLeft)

    if (anchorFeet && bottomBefore != null) {
      const bottomAfter = this.sprite.getBounds().bottom
      this.sprite.y += bottomBefore - bottomAfter
      body.updateFromGameObject?.()
    }
  }

  transform() {
    const now = this.scene.time.now
    if (now - this.lastTransformAt < TRANSFORM_COOLDOWN) return
    this.lastTransformAt = now
    this.isHuman = !this.isHuman
    this.applyFormPhysics({ anchorFeet: true })
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

    const wantLeft = body.velocity.x < -12 ? true : body.velocity.x > 12 ? false : this._facingLeft()
    if (wantLeft !== this._facingLeft()) {
      this._applyScaleForForm(wantLeft)
    }
  }

  destroy() {
    if (this.sprite) this.sprite.destroy()
    this.sprite = null
  }
}
