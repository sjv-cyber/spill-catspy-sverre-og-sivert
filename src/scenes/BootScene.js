import { replaceTextureWithChroma } from '../utils/chromaTexture.js'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    this.load.image('title_screen', 'assets/ui/title_screen.png')
    this.load.image('bg_cell', 'assets/backgrounds/bg_cell.png')
    this.load.image('bg_corridor', 'assets/backgrounds/bg_corridor.png')

    this.load.image('_raw_human', 'assets/sprites/player_human.png')
    this.load.image('_raw_cat', 'assets/sprites/player_cat.png')
    this.load.image('_raw_guard', 'assets/sprites/guard_pmc.png')
    this.load.image('prop_camera', 'assets/sprites/prop_camera.png')
  }

  create() {
    replaceTextureWithChroma(this, '_raw_human', 'player_human', 255, 0, 255, 45)
    replaceTextureWithChroma(this, '_raw_cat', 'player_cat', 255, 0, 255, 45)
    replaceTextureWithChroma(this, '_raw_guard', 'guard_pmc', 255, 0, 255, 45)

    this.textures.remove('_raw_human')
    this.textures.remove('_raw_cat')
    this.textures.remove('_raw_guard')

    this.scene.start('Title')
  }
}
