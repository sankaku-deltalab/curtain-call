export interface Weapon<T> {
  /**
   * Start firing.
   *
   * @param world World.
   */
  start(world: T): void;

  /**
   * Is firing now.
   *
   * @returns Is firing.
   */
  isFiring(): boolean;

  /**
   * Request stop firing.
   */
  stop(): void;

  /**
   * Stop firing process immediately.
   */
  forceStop(): void;

  /**
   * Update firing process.
   *
   * @param _world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void;
}
