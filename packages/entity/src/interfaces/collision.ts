import { Box2d } from "./misc";

/**
 * `CollisionGroup` decide collidability between collisions.
 * If (A.mask & B.category) !== 0, A can collide to B.
 */
export interface CollisionGroup {
  readonly category: number;
  readonly mask: number;
}

/**
 * Calculate can collide between two `CollisionGroup`.
 *
 * @param main Calculating group.
 * @param other Other group.
 * @returns `main` can collide with `other`.
 */
export function canCollideGroup(
  main: CollisionGroup,
  other: CollisionGroup
): boolean {
  return (main.mask & other.category) !== 0;
}

/**
 * `CollisionRepresentation` describe current collision representation.
 */
export interface CollisionRepresentation {
  readonly box2ds: readonly Box2d[];
  readonly group: CollisionGroup;
  readonly isExcess: boolean;
}
