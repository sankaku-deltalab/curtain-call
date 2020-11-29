import { CollisionStatus } from "@curtain-call/entity";

/**
 * `CollisionOverlapChecker` is used for collide detection.
 */
export interface CollisionOverlapChecker {
  /**
   * Calculate all collision overlapping.
   *
   * @param statuses Collision statuses.
   * @returns Overlapping collision statuses.
   */
  calcOverlapAllVsAll(
    statuses: ReadonlySet<CollisionStatus>
  ): ReadonlyMap<CollisionStatus, readonly CollisionStatus[]>;
}
