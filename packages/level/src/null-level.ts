/* eslint-disable @typescript-eslint/no-empty-function */
import { Asset } from "@curtain-call/asset";
import { Level } from "./level";

export class NullLevel<T> implements Level<T> {
  private isLoadedInternal = false;
  private isActiveInternal = false;

  /**
   * Load assets.
   *
   * @returns Loading Promise.
   */
  async load(): Promise<void> {
    this.isLoadedInternal = true;
  }

  /**
   * Unload assets.
   *
   * @param _exclude Excluding assets.
   */
  unload(_exclude?: ReadonlySet<Asset>): void {
    this.isLoadedInternal = false;
  }

  /**
   * Assets was loaded.
   *
   * @returns Assets was loaded.
   */
  isLoaded(): boolean {
    return this.isLoadedInternal;
  }

  /**
   * Activate level.
   *
   * @param _world World.
   */
  activate(_world: T): void {
    this.isActiveInternal = true;
  }

  /**
   * Deactivate level.
   *
   * @param _world
   */
  deactivate(_world: T): void {
    this.isActiveInternal = false;
  }

  /**
   * Level is activated.
   *
   * @returns Level is activated.
   */
  isActive(): boolean {
    return this.isActiveInternal;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(): boolean {
    return false;
  }

  /**
   * Update level.
   *
   * @param _world World.
   * @param _deltaSec Delta seconds.
   */
  update(_world: T, _deltaSec: number): void {}
}
