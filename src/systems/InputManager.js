export class InputManager {
  constructor(scene) {
    this.scene = scene
    this.keys = scene.input.keyboard.addKeys({
      left: 'A',
      leftArr: 'LEFT',
      right: 'D',
      rightArr: 'RIGHT',
      jump: 'SPACE',
      jumpW: 'W',
      jumpUp: 'UP',
      transform: 'T',
      interact: 'E',
      pause: 'ESC',
      map: 'M',
    })
  }

  get left() {
    return this.keys.left.isDown || this.keys.leftArr.isDown
  }

  get right() {
    return this.keys.right.isDown || this.keys.rightArr.isDown
  }

  get jumpPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.jump)
      || Phaser.Input.Keyboard.JustDown(this.keys.jumpW)
      || Phaser.Input.Keyboard.JustDown(this.keys.jumpUp)
  }

  get jump() {
    return this.keys.jump.isDown || this.keys.jumpW.isDown || this.keys.jumpUp.isDown
  }

  get transformPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.transform)
  }

  get interactPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.interact)
  }

  get pausePressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.pause)
  }

  get mapPressed() {
    return Phaser.Input.Keyboard.JustDown(this.keys.map)
  }
}
