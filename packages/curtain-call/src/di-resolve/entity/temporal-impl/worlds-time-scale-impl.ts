import { WorldId, Seconds, WorldsTimeScale } from "@curtain-call/entity";

export class WorldsTimeScaleImpl implements WorldsTimeScale {
  calcTimeScale(_world: WorldId): number {
    return 1;
  }

  update(_world: WorldId, _deltaSec: Seconds): void {
    // do nothing.
  }
}
