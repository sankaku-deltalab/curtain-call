import { Matrix } from "trans-vector2d";
import { ActorBase } from "./actor-base";
import { WorldBase } from "./world-base";

/**
 * `Movement` express movement of `ActorBase`.
 */
export interface Movement {
  /**
   * Update internal state and given transformation matrix.
   *
   * @param deltaSec Delta seconds.
   * @param prevTransform Transformation matrix before applied movement.
   * @returns Movement was finished and applied transformation matrix.
   */
  update(
    deltaSec: number,
    prevTransform: Matrix
  ): { finished: boolean; nextTransform: Matrix };
}

/**
 * `DrawingObject` represent drawing thing.
 */
export interface DrawingObject {
  /** `objectId` is used for linking between in-game drawing thing and in-rendering drawing thing for speed. */
  readonly objectId: string;
  readonly zIndex: number;
}

/**
 * `Box2d` is rectangle description.
 * Mainly used for area description for collision.
 */
export type Box2d = readonly [number, number, number, number]; // [xMin, yMin, xMax, yMax]

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
 * `CollisionStatus` describe current collision status.
 */
export interface CollisionStatus {
  readonly box2ds: readonly Box2d[];
  readonly group: CollisionGroup;
  readonly isExcess: boolean;
}

/**
 * `ActorExtension` would be used for extending `ActorBase` without inheritance.
 */
export interface ActorExtension {
  preUpdate(world: WorldBase, actor: ActorBase, deltaSec: number): void;
  update(world: WorldBase, actor: ActorBase, deltaSec: number): void;
  postUpdate(world: WorldBase, actor: ActorBase, deltaSec: number): void;
}

/**
 * `Timer` is used for delayed activated function.
 */
export interface Timer {
  update(world: WorldBase, deltaSec: number): { finished: boolean };
  abort(): void;
}
