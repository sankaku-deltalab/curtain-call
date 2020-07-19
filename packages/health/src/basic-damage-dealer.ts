import { DamageType } from "./damage-type";
import { DamageDealer } from "./damage-dealer";

/**
 * Damage dealing thing like character, weapon or bullet.
 */
export class BasicDamageDealer<TWorld, TActor>
  implements DamageDealer<TWorld, TActor> {
  private parent?: DamageDealer<TWorld, TActor>;

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
  ): void {
    if (!this.parent) return;
    this.parent.notifyDealtDamage(world, damage, taker, type);
  }

  /**
   * Notify this killed `Health` directly.
   * This function would be called by killed `Health`.
   *
   * @param world Our world.
   * @param taker Damaged Health.
   * @param type Damage type.
   */
  notifyKilled(world: TWorld, taker: TActor, type: DamageType): void {
    if (!this.parent) return;
    this.parent.notifyKilled(world, taker, type);
  }

  /**
   * Set damaging chain parent.
   * When this dealt damage, this tell damaging and killing to parent `DamageDealer`.
   *
   * @param parentDealer Parent.
   * @returns this.
   */
  setDamageDealerParent(parentDealer: DamageDealer<TWorld, TActor>): this {
    this.parent = parentDealer;
    return this;
  }
}
