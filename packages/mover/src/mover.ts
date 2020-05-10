import { Matrix } from "trans-vector2d";

export interface Mover<T, A> {
  /**
   * Update movement and return transformation delta
   *
   * @param scene Scene.
   * @param deltaSec Delta seconds.
   * @param moving Moving Actor.
   * @returns Transformation delta and movement was done.
   */
  update(
    scene: T,
    deltaSec: number,
    moving: A
  ): { done: boolean; deltaMat: Matrix };
}
