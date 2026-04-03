export class StateMachine {
  constructor(initialState, states) {
    this.states = states
    this.current = initialState
    this.states[this.current]?.enter?.()
  }

  transition(newState) {
    if (newState === this.current || !this.states[newState]) return
    this.states[this.current]?.exit?.()
    this.current = newState
    this.states[this.current]?.enter?.()
  }

  update(dt) {
    this.states[this.current]?.update?.(dt)
  }
}
