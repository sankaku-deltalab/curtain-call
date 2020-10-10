import { Actor, DamageType } from "../actor-interface";
import { World } from "./world";

export interface ActorExtension {
  /**
   * Notify added to actor.
   *
   * @param actor Actor using this.
   */
  notifyAddedToActor(actor: Actor): void;

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

  /**
   * Calculate taken damage multiplier.
   *
   * @param world World.
   * @param damage Original damage amount.
   * @param dealer Damage dealer.
   * @param actor Damage taking actor.
   * @param type Damage type.
   * @returns Damage multiplier.
   */
  calcTakingDamageMultiplier(
    world: World,
    damage: number,
    dealer: Actor,
    actor: Actor,
    type: DamageType
  ): number;
}
