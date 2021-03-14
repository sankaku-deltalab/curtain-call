import { ActorId, Seconds, ActorsTimerUpdater } from "@curtain-call/entity";

export class ActorsTimerUpdaterImpl implements ActorsTimerUpdater {
  updateTime(
    _actors: readonly ActorId[],
    _deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    // do nothing.
  }

  executeTimersIfTimeWasFilled(_actors: readonly ActorId[]): void {
    // do nothing.
  }
}
