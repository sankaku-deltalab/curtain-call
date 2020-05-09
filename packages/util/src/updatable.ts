export interface Updatable<T> {
  /**
   * Update self.
   *
   * @param scene Scene.
   * @param deltaSec Delta seconds.
   */
  update(scene: T, deltaSec: number): void;
}
