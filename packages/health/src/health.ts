/**
 * Health.
 */
export class Health {
  private health = 0;
  private healthMax = 0;

  /**
   * Init health and healthMax.
   *
   * @param health Initial health.
   * @param health HealthMax.
   * @returns this.
   */
  init(health: number, healthMax: number): this {
    if (health < 0) throw new Error("Initial health must be > 0");
    if (healthMax < 0) throw new Error("Initial health max must be > 0");
    if (health > healthMax) throw new Error("Initial health must be <= max");

    this.health = health;
    this.healthMax = healthMax;
    return this;
  }

  /**
   * Take damage to self.
   *
   * @param damage Damage amount.
   */
  takeDamage(damage: number): { actualDamage: number; died: boolean } {
    if (this.isDead()) return { actualDamage: 0, died: false };

    const actualDamage = Math.min(damage, this.health);
    this.health -= actualDamage;

    return { actualDamage, died: this.health === 0 };
  }

  /**
   * Kill self.
   */
  kill(): void {
    this.health = 0;
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
   * @param amount Healing amount.
   */
  heal(amount: number): { actualHealed: number } {
    const actualHealed = Math.min(this.healthMax - this.health, amount);
    this.health += actualHealed;
    return { actualHealed };
  }

  /**
   * Return self is dead.
   *
   * @returns Self is dead.
   */
  isDead(): boolean {
    return this.health <= 0;
  }
}
