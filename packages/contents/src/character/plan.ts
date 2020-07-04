import { Character } from "./character";
import { World } from "@curtain-call/world";

/**
 * Plan owned by Character.
 * Plan manipulate Character and character components.
 */
export interface Plan<TWorld extends World> {
  /**
   * Start this plan.
   *
   * @param world World.
   * @param character Target character.
   */
  start(world: TWorld, character: Character<TWorld>): void;

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   * @param character Target character.
   */
  update(world: TWorld, deltaSec: number, character: Character<TWorld>): void;
}
