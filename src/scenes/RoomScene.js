// Placeholder — Agent Task 1 will implement this fully
export class RoomScene extends Phaser.Scene {
  constructor() {
    super('Room')
  }

  init(data) {
    this.roomId = data.roomId || 'room_tutorial'
  }

  create() {
    // TODO: Load room JSON, build tilemap, spawn player + entities
  }

  update(time, delta) {
    // TODO: Update player, guards, lasers, detection checks
  }
}
