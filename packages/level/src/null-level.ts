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
   * @param _scene Scene.
   */
  activate(_scene: T): void {
    this.isActiveInternal = true;
  }

  /**
   * Deactivate level.
   *
   * @param _scene
   */
  deactivate(_scene: T): void {
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
   * Update level.
   *
   * @param _scene Scene.
   * @param _deltaSec Delta seconds.
   */
  update(_scene: T, _deltaSec: number): void {}
}
