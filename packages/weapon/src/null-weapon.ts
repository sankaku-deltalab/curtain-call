import { Weapon } from "./weapon";

/**
 * Weapon do nothing.
 */
export class NullWeapon<T> implements Weapon<T> {
  /**
   * Start firing.
   */
  start(): void {
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
  stop(): void {
    // do nothing
  }

  /**
   * Stop firing process immediately.
   */
  forceStop(): void {
    // do nothing
  }

  /**
   * Update firing process.
   */
  update(): void {
    // do nothing
  }
}
