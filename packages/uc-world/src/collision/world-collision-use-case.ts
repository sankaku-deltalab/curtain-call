import {
  WorldBase,
  ActorBase,
  CollisionRepresentation,
} from "@curtain-call/entity";

const givenIsNotUndefined = <T>(v: T | undefined): v is T => v !== undefined;

const keysAndMapToArray = <T, U>(
  keys: readonly T[],
  map: ReadonlyMap<T, U>
): readonly U[] => keys.map((k) => map.get(k)).filter<U>(givenIsNotUndefined);

/**
 * `CollisionOverlapChecker` is used for collide detection.
 */
export interface CollisionOverlapChecker {
  /**
   * Calculate all collision overlapping.
   *
   * @param statuses Collision statuses.
   * @returns Overlapping collision representations.
   */
  calcOverlapAllVsAll(
    statuses: ReadonlySet<CollisionRepresentation>
  ): ReadonlyMap<CollisionRepresentation, readonly CollisionRepresentation[]>;
}

export class WorldCollisionUseCase {
  private readonly overlapChecker: CollisionOverlapChecker;

  constructor(overlapChecker?: CollisionOverlapChecker) {
    if (!overlapChecker) throw new Error("DI failed");

    this.overlapChecker = overlapChecker;
  }

  /**
   * Check `ActorBase`-wise collide in world and notify collide to `ActorBase`.
   *
   * @param world Collide checking world.
   */
  checkOverlapAndNotifyToActors(world: WorldBase): void {
    const actors = Array.from(world.iterateActors());
    const repToActor = this.calcRepresentationToActor(actors);
    const reps = new Set(repToActor.keys());

    const overlapped = this.overlapChecker.calcOverlapAllVsAll(reps);

    overlapped.forEach((otherReps, mainRep) => {
      const mainActor = repToActor.get(mainRep);
      const otherActors = keysAndMapToArray(otherReps, repToActor);

      if (!(mainActor && otherActors.every((ac) => ac !== undefined)))
        throw new Error("Unknown error");

      mainActor.notifyOverlappedWith(world, otherActors);
    });
  }

  private calcRepresentationToActor(
    actors: readonly ActorBase[]
  ): ReadonlyMap<CollisionRepresentation, ActorBase> {
    return new Map(actors.map((ac) => [ac.calcCollisionRepresentation(), ac]));
  }
}
