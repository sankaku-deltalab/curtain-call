import { WorldId, WorldsTimerUpdater } from "@curtain-call/entity";

export class WorldsTimerUpdaterImpl implements WorldsTimerUpdater {
  updateTime(_world: WorldId, _deltaSec: number): void {
    // do nothing.
  }

  executeTimersIfTimeWasFilled(_world: WorldId): void {
    // do nothing.
  }
}
