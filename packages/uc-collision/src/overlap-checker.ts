import { CollisionRepresentation } from "@curtain-call/entity";

/**
 * `CollisionOverlapChecker` is used for collide detection.
 */
export interface CollisionOverlapChecker {
  /**
   * Calculate all collision overlapping.
   *
   * @param statuses Collision statuses.
   * @returns Overlapping collision representationes.
   */
  calcOverlapAllVsAll(
    statuses: ReadonlySet<CollisionRepresentation>
  ): ReadonlyMap<CollisionRepresentation, readonly CollisionRepresentation[]>;
}
