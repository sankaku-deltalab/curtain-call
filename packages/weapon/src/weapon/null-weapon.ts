import { Weapon } from "./weapon";

/**
 * Weapon do nothing.
 */
export class NullWeapon implements Weapon {
  /**
   * Notify added to actor.
   */
  notifyAddedToActor(): void {
    // do nothing
  }

  /**
   * Update self.
   */
  update(): void {
    // do nothing
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(): boolean {
    return false;
  }

  /**
   * Calculate taken damage multiplier.
   *
   * @returns Damage multiplier.
   */
  calcTakingDamageMultiplier(): number {
    return 1;
  }

  /**
   * Start firing.
   */
  startFire(): void {
    // do nothing
  }

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  isFiring(): boolean {
    return false;
  }

  /**
   * Request stop firing.
   */
  stopFire(): void {
    // do nothing
  }

  /**
   * Stop firing process immediately.
   */
  forceStopFire(): void {
    // do nothing
  }
}
