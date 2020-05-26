import { Matrix } from "trans-vector2d";

export interface Mover<T> {
  /**
   * Update movement and return transformation delta
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   * @param currentTrans Current transform.
   * @returns New transformation and movement was done.
   */
  update(
    world: T,
    deltaSec: number,
    currentTrans: Matrix
  ): { done: boolean; newTrans: Matrix };
}
