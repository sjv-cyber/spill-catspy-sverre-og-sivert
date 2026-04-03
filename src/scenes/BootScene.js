export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    // Prototype uses procedural graphics — no assets to load
  }

  create() {
    this.scene.start('Title')
  }
}
