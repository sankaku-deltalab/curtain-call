import { Asset } from "@curtain-call/asset";
import { Updatable } from "@curtain-call/util";

/**
 * Level manage asset loading.
 */
export interface Level<T> extends Updatable<T> {
  /**
   * Load assets.
   *
   * @returns Loading Promise.
   */
  load(): Promise<void>;

  /**
   * Unload assets.
   *
   * @param exclude Excluding assets.
   */
  unload(exclude?: ReadonlySet<Asset>): void;

  /**
   * Assets was loaded.
   *
   * @returns Assets was loaded.
   */
  isLoaded(): boolean;

  /**
   * Activate level.
   *
   * @param scene Scene.
   */
  activate(scene: T): void;

  /**
   * Deactivate level.
   *
   * @param scene
   */
  deactivate(scene: T): void;

  /**
   * Level is activated.
   *
   * @returns Level is activated.
   */
  isActive(): boolean;

  /**
   * Update level.
   *
   * @param scene Scene.
   * @param deltaSec Delta seconds.
   */
  update(scene: T, deltaSec: number): void;
}
