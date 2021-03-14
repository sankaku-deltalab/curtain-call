import { ActorId, Seconds, ActorsExtensionUpdater } from "@curtain-call/entity";

export class ActorsExtensionUpdaterImpl implements ActorsExtensionUpdater {
  notifyPreUpdate(
    _actors: readonly ActorId[],
    _deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    // do nothing.
  }

  update(
    _actors: readonly ActorId[],
    _deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    // do nothing.
  }

  notifyPostUpdate(
    _actors: readonly ActorId[],
    _deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    // do nothing.
  }
}
