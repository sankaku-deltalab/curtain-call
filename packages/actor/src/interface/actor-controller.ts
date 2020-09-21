import { Actor } from "../actor-interface";
import { World } from "./world";

export interface ActorController {
  /**
   * Update self.
   *
   * @param world World.
   * @param actor Actor using this.
   * @param deltaSec Delta seconds.
   */
  update(world: World, actor: Actor, deltaSec: number): void;

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @param actor Actor using this.
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(world: World, actor: Actor): boolean;
}
