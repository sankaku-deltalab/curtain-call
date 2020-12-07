import { DrawingObject } from "@curtain-call/entity";

export interface Renderer {
  /**
   * Load images.
   *
   * @param asset Image ids and image url.
   */
  load(asset: Map<string, string>): Promise<void>;

  /**
   * Unload images.
   *
   * @param imageIds Unloading image ids.
   */
  unload(imageIds: Set<string>): void;

  /**
   * Render drawing objects.
   *
   * @param objects
   */
  render(objects: readonly DrawingObject[]): void;
}
