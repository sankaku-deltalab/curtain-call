import { Transformation } from "@curtain-call/util";

export interface TargetProvider<T> {
  /**
   * Get target transformation.
   *
   * @param world Our world.
   * @returns Target transformation.
   */
  getTargetTrans(world: T): Transformation | undefined;
}

export class NonTargetProvider<T> implements TargetProvider<T> {
  getTargetTrans(_world: T): undefined {
    return undefined;
  }
}
