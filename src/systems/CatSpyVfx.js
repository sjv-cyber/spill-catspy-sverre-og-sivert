/**
 * Minimal pixel-style one-shots: readable, no fullscreen bloom.
 */

/**
 * @param {Phaser.Scene} scene
 * @param {number} wx
 * @param {number} wy
 */
export function playTransformFlash(scene, wx, wy) {
  const g = scene.add.graphics().setDepth(95)
  g.fillStyle(0xff3333, 0.35)
  g.fillRect(wx - 3, wy - 28, 6, 8)
  g.fillStyle(0x44ff66, 0.4)
  g.fillRect(wx - 14, wy - 22, 28, 18)
  g.fillStyle(0xffffff, 0.2)
  g.fillRect(wx - 2, wy - 18, 4, 12)

  scene.tweens.add({
    targets: g,
    alpha: 0,
    duration: 220,
    onComplete: () => g.destroy(),
  })
}

/**
 * @param {Phaser.Scene} scene
 * @param {number} wx
 * @param {number} wy
 */
export function playTerminalPulse(scene, wx, wy) {
  const r = scene.add.rectangle(wx, wy, 24, 18, 0x44ff88, 0.45).setStrokeStyle(1, 0xaaffcc).setDepth(90)
  scene.tweens.add({
    targets: r,
    scaleX: 1.4,
    scaleY: 1.35,
    alpha: 0,
    duration: 380,
    onComplete: () => r.destroy(),
  })
}

/**
 * @param {Phaser.Scene} scene
 * @param {number} wx
 * @param {number} wy
 */
export function playGateUnlock(scene, wx, wy) {
  for (let i = 0; i < 5; i++) {
    const x = wx + (i - 2) * 8
    const p = scene.add.rectangle(x, wy, 4, 3, 0xffcc66, 0.9).setDepth(88)
    scene.tweens.add({
      targets: p,
      y: wy - 20 - i * 4,
      alpha: 0,
      duration: 400 + i * 40,
      onComplete: () => p.destroy(),
    })
  }
}

/**
 * @param {Phaser.Scene} scene
 * @param {number} wx
 * @param {number} wy
 */
export function playRobotHackBurst(scene, wx, wy) {
  const lines = scene.add.graphics().setDepth(92)
  lines.lineStyle(2, 0x66ff99, 0.85)
  for (let i = 0; i < 6; i++) {
    const y0 = wy - 10 + i * 3
    lines.beginPath()
    lines.moveTo(wx - 22, y0)
    lines.lineTo(wx + 22, y0 + (i % 2 === 0 ? 0 : 2))
    lines.strokePath()
  }
  scene.tweens.add({
    targets: lines,
    alpha: 0,
    duration: 280,
    delay: 40,
    onComplete: () => lines.destroy(),
  })
}
