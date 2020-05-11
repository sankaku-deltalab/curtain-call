import { promisify } from "util";
import * as PIXI from "pixi.js";

/**
 * @example
 * import * as PIXI from "pixi.js";
 *
 * const asset = new PixiAsset({
 *   player: "./path/to/pl.jpg",
 *   enemy: "./path/to/en.jpg",
 * });
 *
 * await asset.load();
 *
 * const texture = PIXI.Texture.from(asset.get("player"));
 */
export class PixiAsset<T extends { [key: string]: string }> {
  private isLoadedInternal = false;

  /**
   * @param items Pixi items like { player: "path/to/image.jpg" }.
   * @param loader Pixi Loader.
   */
  constructor(
    private readonly items: T,
    private readonly loader = new PIXI.Loader()
  ) {
    for (const key in this.items) {
      const val = this.items[key];
      loader.add(val, val);
    }
  }

  /**
   * Load asset.
   */
  async load(): Promise<void> {
    await promisify((cb) => this.loader.load(cb))();
    this.isLoadedInternal = true;
  }

  /**
   * Unload asset.
   * Unloaded images were removed from cache.
   */
  unload(): void {
    this.isLoadedInternal = false;
    this.loader.reset();
  }

  /**
   * Is loaded self.
   * @returns Is loaded.
   */
  isLoaded(): boolean {
    return this.isLoadedInternal;
  }

  /**
   * Get loaded asset URL.
   *
   * @param src Image key.
   * @returns Image URL.
   */
  get(src: keyof T): string {
    if (!this.isLoaded()) throw new Error("Asset was not loaded");
    return this.items[src];
  }
}
