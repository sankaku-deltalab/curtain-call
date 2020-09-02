import { World } from "./world";

export interface Updatable {
  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: World): boolean;

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void;
}
