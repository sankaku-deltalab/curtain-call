import { Actor, World } from "@curtain-call/actor";

export interface TargetProvider {
  /**
   * Get target position.
   *
   * @param world Our world.
   * @returns Target world position.
   */
  getTarget(world: World): Actor | undefined;
}
