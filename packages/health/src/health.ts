import { EventEmitter } from "eventemitter3";
import { DamageDealer } from "./damage-dealer";
import { DamageInterceptor } from "./damage-interceptor";
import { DamageType } from "./damage-type";

/**
 * Health.
 */
export class Health<T> {
  public readonly event = new EventEmitter<{
    healed: [T, number];
    takenDamage: [T, number, DamageDealer<T>, DamageType];
    died: [T, DamageDealer<T>, DamageType];
  }>();

  private health = 0;
  private healthMax = 0;
  private interceptors = new Set<DamageInterceptor<T>>();

  /**
   * Init health and healthMax.
   *
   * @param health Health and healthMax.
   * @returns this.
   */
  init(health: number): this {
    this.health = this.healthMax = health;
    return this;
  }

  /**
   * Take damage to self.
   *
   * @param scene Scene.
   * @param damage Damage amount.
   * @param dealer Damage dealer dealing directory.
   * @param type Damage type.
   */
  takeDamage(
    scene: T,
    damage: number,
    dealer: DamageDealer<T>,
    type: DamageType
  ): void {
    if (this.isDead()) return;

    let modifiedDamage = damage;
    this.interceptors.forEach((interceptor) => {
      modifiedDamage = interceptor.interceptDamage(
        scene,
        modifiedDamage,
        dealer,
        type,
        this
      );
    });

    const actualDamage = Math.min(modifiedDamage, this.health);
    this.event.emit("takenDamage", scene, actualDamage, dealer, type);

    this.health -= actualDamage;
    if (this.health === 0) {
      this.event.emit("died", scene, dealer, type);
    }
  }

  /**
   * Kill self.
   *
   * @param scene Scene.
   * @param dealer Damage dealer killing self directory.
   * @param type Damage type.
   */
  die(scene: T, dealer: DamageDealer<T>, type: DamageType): void {
    this.health = 0;
    this.event.emit("died", scene, dealer, type);
  }

  /**
   * Current health.
   *
   * @returns Current health.
   */
  current(): number {
    return this.health;
  }

  /**
   * Max health.
   *
   * @returns Max health.
   */
  max(): number {
    return this.healthMax;
  }

  /**
   * Heal health.
   *
   * @param scene Scene.
   * @param amount Healing amount.
   */
  heal(scene: T, amount: number): void {
    this.health = Math.min(this.healthMax, this.health + amount);
    this.event.emit("healed", scene, amount);
  }

  /**
   * Return self is dead.
   *
   * @returns Self is dead.
   */
  isDead(): boolean {
    return this.healthMax > 0 && this.health <= 0;
  }

  /**
   * Add interceptor.
   *
   * @param interceptor
   * @returns this.
   */
  addInterceptor(interceptor: DamageInterceptor<T>): this {
    this.interceptors.add(interceptor);
    return this;
  }

  /**
   * Remove interceptor.
   *
   * @param interceptor
   * @returns this.
   */
  removeInterceptor(interceptor: DamageInterceptor<T>): this {
    this.interceptors.delete(interceptor);
    return this;
  }
}
