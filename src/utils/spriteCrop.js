/**
 * Copy a normalized sub-rectangle from a loaded/canvas texture into a new canvas texture key.
 * Use when source PNGs are wide "scene" renders instead of tight character sprites.
 *
 * @param {Phaser.Scene} scene
 * @param {string} sourceKey
 * @param {string} targetKey
 * @param {{ x: number, y: number, w: number, h: number }} norm — each 0..1 relative to full bitmap
 */
export function cropTextureToKey(scene, sourceKey, targetKey, norm) {
  const tex = scene.textures.get(sourceKey)
  const src = tex.getSourceImage()
  const sw = src.naturalWidth || src.width
  const sh = src.naturalHeight || src.height
  const sx = Math.floor(sw * norm.x)
  const sy = Math.floor(sh * norm.y)
  const cw = Math.max(1, Math.floor(sw * norm.w))
  const ch = Math.max(1, Math.floor(sh * norm.h))

  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')
  ctx.drawImage(src, sx, sy, cw, ch, 0, 0, cw, ch)

  if (scene.textures.exists(targetKey)) scene.textures.remove(targetKey)
  scene.textures.addCanvas(targetKey, canvas)
}
