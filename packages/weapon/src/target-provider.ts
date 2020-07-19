import { Vector } from "trans-vector2d";

export interface TargetProvider<T> {
  /**
   * Get target position.
   *
   * @param world Our world.
   * @returns Target world position.
   */
  getTargetPosition(world: T): Vector | undefined;
}

export class NonTargetProvider<T> implements TargetProvider<T> {
  getTargetPosition(_world: T): undefined {
    return undefined;
  }
}
