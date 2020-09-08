import { Weapon } from "./weapon";

/**
 * Weapon do nothing.
 */
export class NullWeapon extends Weapon {
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

  /**
   * Update firing process.
   */
  update(): void {
    // do nothing
  }
}
