// Placeholder — Agent Task 1 will implement unified input
export class InputManager {
  constructor(scene) {
    this.scene = scene
    // TODO: Bind keyboard + gamepad, expose action states
  }

  get left() { return false }
  get right() { return false }
  get jump() { return false }
  get transform() { return false }
  get interact() { return false }
}
