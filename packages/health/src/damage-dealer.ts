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
  }>();
}
