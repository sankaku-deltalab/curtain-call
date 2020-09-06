import { Asset } from "@curtain-call/asset";
import { Level } from "./level";

export class NullLevel implements Level {
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
   */
  activate(): void {
    this.isActiveInternal = true;
  }

  /**
   * Deactivate level.
   */
  deactivate(): void {
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
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update(): void {}
}
