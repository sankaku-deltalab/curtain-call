import { World } from "./world";

/**
 * Timer.
 */
export interface Timer {
  /**
   * Timer is active.
   *
   * @returns Timer is active.
   */
  isActive(): boolean;

  /**
   * Deactivate timer.
   *
   * @returns this.
   */
  deactivate(): this;

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void;
}
