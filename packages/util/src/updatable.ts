export interface Updatable<T> {
  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void;
}
