export interface Updatable<T> {
  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(): boolean;

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void;
}
