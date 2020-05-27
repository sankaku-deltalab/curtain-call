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
   * @param world World.
   */
  activate(world: T): void;

  /**
   * Deactivate level.
   *
   * @param world
   */
  deactivate(world: T): void;

  /**
   * Level is activated.
   *
   * @returns Level is activated.
   */
  isActive(): boolean;

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(): boolean;

  /**
   * Update level.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void;
}
