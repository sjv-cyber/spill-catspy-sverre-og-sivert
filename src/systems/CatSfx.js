/** Procedural Web Audio SFX for the cat — no external files. */

const COOLDOWN_MS = { default: 90, hiss: 280, hide: 400, purr: 160, mrrp: 200, chirp: 120 }
const lastPlayed = new Map()

/**
 * @param {Phaser.Scene} scene
 * @param {(t: number, n: number) => number} sampleFn t=seconds, n=normalized position 0..1
 * @param {number} durationSec
 */
function makeMonoBuffer(scene, sampleFn, durationSec) {
  const ctx = scene.sound.context
  const rate = ctx.sampleRate
  const n = Math.max(1, Math.floor(rate * durationSec))
  const buf = ctx.createBuffer(1, n, rate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) {
    const t = i / rate
    d[i] = sampleFn(t, i / (n - 1 || 1))
  }
  return buf
}

function noiseSample() {
  return Math.random() * 2 - 1
}

/**
 * @param {Phaser.Scene} scene
 */
export function registerCatSfx(scene) {
  if (!scene.sound?.context) return
  if (scene.registry.get('catSfxRegistered')) return
  scene.registry.set('catSfxRegistered', true)

  const cache = scene.cache.audio

  // Short upward "mrrp" when shifting to cat form
  cache.add(
    'cat_mrrp',
    makeMonoBuffer(scene, (t, n) => {
      const f0 = 520
      const f1 = 920
      const f = f0 + (f1 - f0) * n
      const env = Math.sin(Math.PI * n) * 0.42
      return Math.sin(2 * Math.PI * f * t) * env
    }, 0.085)
  )

  // Tiny chirp on cat jump
  cache.add(
    'cat_chirp',
    makeMonoBuffer(scene, (t, n) => {
      const f = 680 + 180 * (1 - n)
      const env = Math.sin(Math.PI * Math.pow(n, 0.85)) * 0.22
      return Math.sin(2 * Math.PI * f * t) * env
    }, 0.055)
  )

  // Soft landing rumble
  cache.add(
    'cat_purr',
    makeMonoBuffer(scene, (t, n) => {
      const rumble =
        Math.sin(2 * Math.PI * 38 * t) * 0.22 + Math.sin(2 * Math.PI * 76 * t) * 0.12
      const trem = 0.5 + 0.5 * Math.sin(2 * Math.PI * 11 * t)
      const env = Math.exp(-t * 14) * 0.38
      const n0 = noiseSample() * 0.06
      return (rumble * trem + n0) * env * (1 - n * 0.2)
    }, 0.14)
  )

  // Entering a hide zone
  cache.add(
    'cat_hide',
    makeMonoBuffer(scene, (t, n) => {
      const f = 360 + 12 * Math.sin(2 * Math.PI * 5.5 * t)
      const env = Math.sin(Math.PI * n) * 0.14
      return Math.sin(2 * Math.PI * f * t) * env
    }, 0.11)
  )

  // Human-only interact as cat
  cache.add(
    'cat_hiss',
    makeMonoBuffer(scene, (t, n) => {
      const env = Math.exp(-t * 5) * Math.pow(1 - n, 0.4) * 0.32
      const n0 = noiseSample()
      const band = n0 * (0.55 + 0.45 * Math.sin(2 * Math.PI * 24 * t))
      return band * env
    }, 0.2)
  )

  cache.add(
    'sfx_alarm',
    makeMonoBuffer(scene, (t) => {
      const pulse = Math.floor(t * 14) % 2 === 0 ? 1 : 0.35
      const f = 720 + 180 * Math.sin(2 * Math.PI * 2.2 * t)
      const tone = Math.sin(2 * Math.PI * f * t) * 0.22 * pulse
      const n0 = noiseSample() * 0.08
      const env = Math.exp(-t * 2.2)
      return (tone + n0) * env
    }, 0.45)
  )

  cache.add(
    'sfx_terminal',
    makeMonoBuffer(scene, (t, n) => {
      const click = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 90) * 0.35
      const hum = Math.sin(2 * Math.PI * 60 * t) * 0.06 * (1 - n)
      return click + hum
    }, 0.09)
  )
}

function canPlay(key, now) {
  const cd = COOLDOWN_MS[key] ?? COOLDOWN_MS.default
  const prev = lastPlayed.get(key) ?? 0
  if (now - prev < cd) return false
  lastPlayed.set(key, now)
  return true
}

/**
 * @param {Phaser.Scene} scene
 * @param {'mrrp'|'chirp'|'purr'|'hide'|'hiss'} kind
 * @param {{ volume?: number }} [opts]
 */
export function playCatSfx(scene, kind, opts = {}) {
  if (!scene.sound?.context) return
  const keyMap = {
    mrrp: 'cat_mrrp',
    chirp: 'cat_chirp',
    purr: 'cat_purr',
    hide: 'cat_hide',
    hiss: 'cat_hiss',
  }
  const cacheKey = keyMap[kind]
  if (!cacheKey || !scene.cache.audio.exists(cacheKey)) return

  const now = scene.time?.now ?? performance.now()
  if (!canPlay(kind, now)) return

  const base = opts.volume ?? 1
  const vol =
    {
      mrrp: 0.38,
      chirp: 0.2,
      purr: 0.34,
      hide: 0.26,
      hiss: 0.36,
    }[kind] * base

  const rate = 0.94 + Math.random() * 0.1
  try {
    scene.sound.play(cacheKey, { volume: vol, rate })
  } catch (_) {
    /* ignore if audio locked */
  }
}

/**
 * @param {Phaser.Scene} scene
 * @param {'alarm'|'terminal'} kind
 */
export function playUiSfx(scene, kind, opts = {}) {
  if (!scene.sound?.context) return
  const key = kind === 'alarm' ? 'sfx_alarm' : 'sfx_terminal'
  if (!scene.cache.audio.exists(key)) return
  const vol = kind === 'alarm' ? (opts.volume ?? 0.28) : (opts.volume ?? 0.22)
  try {
    scene.sound.play(key, { volume: vol, rate: 0.96 + Math.random() * 0.08 })
  } catch (_) {
    /* ignore */
  }
}
