import { Character } from "./character";

/**
 * Plan owned by Character.
 * Plan manipulate Character and character components.
 */
export interface Plan<T> {
  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   * @param character Target character.
   */
  update(world: T, deltaSec: number, character: Character<T>): void;
}
