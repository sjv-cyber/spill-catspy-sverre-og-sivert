export const GAME_WIDTH = 960
export const GAME_HEIGHT = 540
export const TILE_SIZE = 16
export const TILE_SCALE = 2

export const HUMAN = {
  // Hitbox / on-screen target size (texture is scaled to fit)
  width: 48,
  height: 72,
  speed: 200,
  accel: 1200,
  decel: 1500,
  jumpVelocity: -400,
  maxFallSpeed: 600,
  gravity: 980,
  coyoteTime: 80,
  jumpBuffer: 100,
  detectionRangeMultiplier: 1.0,
}

export const CAT = {
  width: 52,
  height: 36,
  speed: 320,
  accel: 1800,
  decel: 1000,
  jumpVelocity: -550,
  maxFallSpeed: 600,
  gravity: 980,
  wallSlideSpeed: 60,
  wallJumpVelocity: { x: -350, y: -400 },
  coyoteTime: 80,
  jumpBuffer: 100,
  detectionRangeMultiplier: 0.5,
}

export const TRANSFORM_COOLDOWN = 500

export const GUARD = {
  coneAngle: Math.PI / 2,
  detectionRange: 200,
  speed: 80,
  waitDuration: 1500,
}

export const LASER = {
  defaultOnDuration: 2000,
  defaultOffDuration: 1500,
}

export const TRANSITION = {
  fadeDuration: 400,
}
