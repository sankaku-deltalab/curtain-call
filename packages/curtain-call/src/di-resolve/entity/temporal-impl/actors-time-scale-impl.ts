import { ActorId, Seconds, ActorsTimeScale } from "@curtain-call/entity";

export class ActorsTimeScaleImpl implements ActorsTimeScale {
  calcTimeScale(actors: ActorId[]): Map<ActorId, number> {
    return new Map(actors.map((ac) => [ac, 1]));
  }

  update(_actors: readonly ActorId[], _deltaSec: Seconds): void {
    // do nothing.
  }
}
