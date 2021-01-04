import { Matrix } from "trans-vector2d";
import { WorldBase } from "../world-base";

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
 * `Box2d` is rectangle description.
 * Mainly used for area description for collision.
 */
export type Box2d = readonly [number, number, number, number]; // [xMin, yMin, xMax, yMax]

/**
 * `Timer` is used for delayed activated function.
 */
export interface Timer {
  update(world: WorldBase, deltaSec: number): { finished: boolean };
  abort(): void;
}
