import { DamageDealer } from "./damage-dealer";
import { DamageType } from "./damage-type";
import { Health } from "./health";

export interface DamageInterceptor<T> {
  /**
   * Take damage to self.
   *
   * @param scene Scene.
   * @param damage Damage amount.
   * @param dealer Damage dealer dealing directory.
   * @param type Damage type.
   * @param health Health taken damage.
   * @returns Modified damage.
   */
  interceptDamage(
    scene: T,
    damage: number,
    dealer: DamageDealer<T>,
    type: DamageType,
    health: Health<T>
  ): number;
}