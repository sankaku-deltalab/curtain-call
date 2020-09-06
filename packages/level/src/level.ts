import { Asset } from "@curtain-call/asset";
import { Updatable, World } from "@curtain-call/actor";

/**
 * Level manage asset loading.
 */
export interface Level extends Updatable {
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
  activate(world: World): void;

  /**
   * Deactivate level.
   *
   * @param world
   */
  deactivate(world: World): void;

  /**
   * Level is activated.
   *
   * @returns Level is activated.
   */
  isActive(): boolean;

  /**
   * If remove self from world, this function must be true.
   *
   * @param world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(world: World): boolean;

  /**
   * Update level.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void;
}
