import { Actor } from "../actor";
import { World } from "./world";

export interface ActorController {
  /**
   * Get controlling actor.
   */
  getActor(): Actor;

  /**
   * Set controlling actor.
   *
   * @param actor Actor.
   * @returns this.
   */
  notifyUsedBy(actor: Actor): this;

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void;

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: World): boolean;
}
