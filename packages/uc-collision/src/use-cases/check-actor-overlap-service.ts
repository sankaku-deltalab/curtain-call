import { WorldBase } from "@curtain-call/entity";
import { CollisionOverlapChecker } from "../overlap-checker";

/**
 * `WorldBase` check actor overlapping when updated.
 */
export interface CheckActorOverlapService {
  /**
   * Check `ActorBase`-wise collide in world and notify collide to `ActorBase`.
   *
   * @param world Collide checking world.
   * @param overlapChecker Overlap checker instance.
   */
  checkOverlapAndNotifyToActors(
    world: WorldBase,
    overlapChecker: CollisionOverlapChecker
  ): void;
}
