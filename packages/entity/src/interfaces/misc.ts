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

/**
 * `RandomGenerator` deal random value.
 */
export interface RandomGenerator {
  /**
   * Generate integer number N s.t. `start <= N <= end`.
   *
   * @example
   * randInt(2, 3) // 3
   *
   * @param start
   * @param end
   * @returns Random integer.
   */
  randInt(start: number, end: number): number;

  /**
   * Generate float number N s.t. `start <= N <= end` from uniform distribution.
   *
   * @example
   * uniform(2, 3) // 2.8
   *
   * @param start
   * @param end
   * @returns Random float.
   */
  uniform(start: number, end: number): number;

  /**
   * Return one of value in seq.
   *
   * @example
   * choice(["a", "b"]) // "a"
   * choice(["a", "b"], [1.5, 3]) // "b"
   *
   * @param seq
   * @param weights
   * @returns Random chosen one.
   */
  choice<T>(seq: readonly T[], weights?: number[]): T;

  /**
   * Create random generator.
   * When called this method, internal state of this would be changed.
   *
   * @returns New random generator.
   */
  createRandomGenerator(): RandomGenerator;
}
