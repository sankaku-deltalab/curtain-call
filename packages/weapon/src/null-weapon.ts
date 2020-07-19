import { BasicDamageDealer } from "@curtain-call/health";
import { Weapon } from "./weapon";

/**
 * Weapon do nothing.
 */
export class NullWeapon<T, A> implements Weapon<T, A> {
  constructor(public readonly damageDealer = new BasicDamageDealer<T, A>()) {}

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
