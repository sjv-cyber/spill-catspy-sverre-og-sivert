import { replaceTextureWithChroma } from '../utils/chromaTexture.js'
import { cropTextureToKey } from '../utils/spriteCrop.js'

/** Tight vertical-ish crop from 1376×768-style wide renders (character near center). */
const CROP_PLAYER = { x: 0.34, y: 0.06, w: 0.32, h: 0.88 }
const CROP_GUARD = { x: 0.28, y: 0.06, w: 0.38, h: 0.88 }

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
    replaceTextureWithChroma(this, '_raw_human', '_ch_human', 255, 0, 255, 45)
    replaceTextureWithChroma(this, '_raw_cat', '_ch_cat', 255, 0, 255, 45)
    replaceTextureWithChroma(this, '_raw_guard', '_ch_guard', 255, 0, 255, 45)

    cropTextureToKey(this, '_ch_human', 'player_human', CROP_PLAYER)
    cropTextureToKey(this, '_ch_cat', 'player_cat', CROP_PLAYER)
    cropTextureToKey(this, '_ch_guard', 'guard_pmc', CROP_GUARD)

    ;['_raw_human', '_raw_cat', '_raw_guard', '_ch_human', '_ch_cat', '_ch_guard'].forEach((k) => {
      if (this.textures.exists(k)) this.textures.remove(k)
    })

    this.scene.start('Title')
  }
}
