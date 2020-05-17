export interface Asset {
  /**
   * Load asset.
   */
  load(): Promise<void>;

  /**
   * Unload asset.
   * Unloaded images were removed from cache.
   */
  unload(): void;

  /**
   * Is loaded self.
   * @returns Is loaded.
   */
  isLoaded(): boolean;
}
