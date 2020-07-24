import { promisify } from "util";
import * as PIXI from "pixi.js";
import { Asset } from "./asset";

function simplePromisify(
  func: (callback: () => void) => void
): () => Promise<void> {
  const cbFunc = (callback: (err: null) => void): void => {
    func(() => {
      callback(null);
    });
  };
  return promisify(cbFunc);
}

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
 * const playerTextureResource = asset.get("player");
 * const playerSprite = new PIXI.Sprite(asset.getTexture("player"));
 * const playerAnim = new PIXI.AnimatedSprite(
 *   asset.getAnimationTextures("animPlayer", "player-front")
 * );
 *
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
    await simplePromisify((cb) => this.loader.load(cb))();
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

  /**
   * Get loaded texture.
   *
   * @param src Item key.
   * @returns Resource.
   */
  getTexture(src: keyof T): PIXI.Texture {
    const resource = this.get(src);
    return resource.texture;
  }

  /**
   * Get loaded animations texture.
   *
   * @param src Item key.
   * @returns Resource.
   */
  getAnimationTextures(src: keyof T, imageName: string): PIXI.Texture[] {
    const resource = this.get(src);
    const sheet = resource.spritesheet;
    if (!sheet) throw new Error(`${src} do not has spritesheet`);
    if (!(imageName in sheet.animations))
      throw new Error(`${src} spritesheet do not has ${imageName}`);

    return sheet.animations[imageName] as PIXI.Texture[];
  }

  private getPath(src: keyof T): string {
    return this.items[src];
  }
}
