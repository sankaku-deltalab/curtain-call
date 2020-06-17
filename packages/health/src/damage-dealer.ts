import { EventEmitter } from "eventemitter3";
import { Health } from "./health";
import { DamageType } from "./damage-type";

/**
 * Damage dealing thing like character, weapon or bullet.
 */
export class DamageDealer<T> {
  /** Events. */
  public event = new EventEmitter<{
    dealtDamage: [T, number, DamageDealer<T>[], Health<T>, DamageType];
    killed: [T, DamageDealer<T>[], Health<T>, DamageType];
  }>();

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
    world: T,
    damage: number,
    taker: Health<T>,
    type: DamageType
  ): void {
    this.event.emit("dealtDamage", world, damage, [this], taker, type);
  }

  /**
   * Notify this killed `Health` directly.
   * This function would be called by killed `Health`.
   *
   * @param world Our world.
   * @param taker Damaged Health.
   * @param type Damage type.
   */
  notifyKilled(world: T, taker: Health<T>, type: DamageType): void {
    this.event.emit("killed", world, [this], taker, type);
  }

  /**
   * Set damaging chain.
   * When this dealt damage, this can tell damaging and killing to parent `DamageDealer`.
   *
   * @param parentDealer Parent.
   * @returns this.
   */
  chainedFrom(parentDealer: DamageDealer<T>): this {
    this.event
      .on("dealtDamage", (world, damage, dealers, taker, type) => {
        parentDealer.event.emit(
          "dealtDamage",
          world,
          damage,
          [...dealers, parentDealer],
          taker,
          type
        );
      })
      .on("killed", (world, dealers, taker, type) => {
        parentDealer.event.emit(
          "killed",
          world,
          [...dealers, parentDealer],
          taker,
          type
        );
      });

    return this;
  }
}
