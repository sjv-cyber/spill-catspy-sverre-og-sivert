/**
 * Replace magenta (or custom RGB) with transparency; register as Phaser canvas texture.
 * @param {Phaser.Scene} scene
 * @param {string} sourceKey loaded image key
 * @param {string} targetKey new texture key (can equal sourceKey after remove)
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} tolerance
 */
export function replaceTextureWithChroma(scene, sourceKey, targetKey, r, g, b, tolerance = 40) {
  const tex = scene.textures.get(sourceKey)
  const src = tex.getSourceImage()
  const w = src.naturalWidth || src.width
  const h = src.naturalHeight || src.height
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(src, 0, 0)
  const imageData = ctx.getImageData(0, 0, w, h)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const cr = d[i]
    const cg = d[i + 1]
    const cb = d[i + 2]
    if (
      Math.abs(cr - r) <= tolerance
      && Math.abs(cg - g) <= tolerance
      && Math.abs(cb - b) <= tolerance
    ) {
      d[i + 3] = 0
    }
  }
  ctx.putImageData(imageData, 0, 0)
  if (scene.textures.exists(targetKey)) scene.textures.remove(targetKey)
  scene.textures.addCanvas(targetKey, canvas)
}
