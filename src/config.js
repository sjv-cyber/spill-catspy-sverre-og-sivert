export const GAME_WIDTH = 960
export const GAME_HEIGHT = 540
export const TILE_SIZE = 16
export const TILE_SCALE = 2

export const HUMAN = {
  width: 32,
  height: 64,
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
  // Readable graybox: still shorter than human, not a 24×16 sliver on 32px tiles
  width: 40,
  height: 28,
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
