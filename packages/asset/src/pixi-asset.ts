import { promisify } from "util";
import * as PIXI from "pixi.js";
import { Asset } from "./asset";

/**
 * @example
 * import * as PIXI from "pixi.js";
 *
 * const asset = new PixiAsset({
 *   player: "./path/to/pl.jpg",
 *   animPlayer: "./path/to/anim-pl.jpg",
 * });
 *
 * await asset.load();
 *
 * const playerSprite = new PIXI.Sprite(asset.get("player").texture);
 * const playerAnim = new PIXI.AnimatedSprite(
 *   asset.get("animPlayer").spritesheet?.animations["player-front"]
 * );
 *
 * const playerTexturePath = asset.get("player");
 *
 * asset.unload();
 */
export class PixiAsset<T extends { [key: string]: string }> implements Asset {
  private isLoadedInternal = false;

  /**
   * @param items Pixi items like { icon: "path/to/image.jpg", player: "path/to/data.json" }.
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
   * Get loaded resource.
   *
   * @param src Item key.
   * @returns Resource.
   */
  get(src: keyof T): PIXI.LoaderResource {
    if (!this.isLoaded()) throw new Error("Asset is not loaded");
    const srcPath = this.getPath(src);
    return this.loader.resources[srcPath];
  }

  private getPath(src: keyof T): string {
    return this.items[src];
  }
}
