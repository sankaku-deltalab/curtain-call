import { ActorBase, CollisionStatus, WorldBase } from "@curtain-call/entity";
import { CheckActorOverlapService } from "../check-actor-overlap-service";
import { CollisionOverlapChecker } from "../overlap-checker";

const givenIsNotUndefined = <T>(v: T | undefined): v is T => v !== undefined;

/**
 * `WorldBase` check actor overlapping when updated.
 */
export class CheckActorOverlapServiceImpl implements CheckActorOverlapService {
  /**
   * Check `ActorBase`-wise collide in world and notify collide to `ActorBase`.
   *
   * @param world Collide checking world.
   * @param overlapChecker Overlap checker instance.
   */
  checkOverlapAndNotifyToActors(
    world: WorldBase,
    overlapChecker: CollisionOverlapChecker
  ): void {
    const actors = Array.from(world.iterateActors());
    const statusToActor = this.calcStatusToActor(actors);
    const statuses = new Set(statusToActor.keys());

    const overlapped = overlapChecker.calcOverlapAllVsAll(statuses);
    overlapped.forEach((others, main) => {
      const mainActor = statusToActor.get(main);
      const otherActors: ReadonlyArray<ActorBase> = others
        .map((st) => statusToActor.get(st))
        .filter<ActorBase>(givenIsNotUndefined);
      if (!mainActor) throw new Error();
      if (!otherActors.every((ac) => ac !== undefined)) throw new Error();
      mainActor.notifyOverlappedWith(world, otherActors);
    });
  }

  private calcStatusToActor(
    actors: readonly ActorBase[]
  ): ReadonlyMap<CollisionStatus, ActorBase> {
    return new Map(actors.map((ac) => [ac.calcCollisionStatus(), ac]));
  }
}
