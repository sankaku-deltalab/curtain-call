import { DamageType } from "./damage-type";

/**
 * Damage dealing thing like character, weapon or bullet.
 */
export interface DamageDealer<TWorld, TActor> {
  /**
   * Notify this dealt damage to `Health` directly.
   * This function would be called by damaged `Health`.
   *
   * @param world Our world.
   * @param damage Dealt damage (not original damage).
   * @param taker Damaged Health.
   * @param type Damage type.
   */
  notifyDealtDamage(
    world: TWorld,
    damage: number,
    taker: TActor,
    type: DamageType
  ): void;

  /**
   * Notify this killed `Health` directly.
   * This function would be called by killed `Health`.
   *
   * @param world Our world.
   * @param taker Damaged Health.
   * @param type Damage type.
   */
  notifyKilled(world: TWorld, taker: TActor, type: DamageType): void;

  /**
   * Set damaging chain parent.
   * When this dealt damage, this tell damaging and killing to parent `DamageDealer`.
   *
   * @param parentDealer Parent.
   * @returns this.
   */
  setDamageDealerParent(parentDealer: DamageDealer<TWorld, TActor>): this;
}
