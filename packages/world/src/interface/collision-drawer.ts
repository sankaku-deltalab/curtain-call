import { DisplayObject, Collision } from "@curtain-call/actor";

/**
 * CollisionDrawer draw rectangles of collision.
 */
export interface CollisionDrawer extends DisplayObject {
  /**
   * Update pixi object transformation.
   */
  update(): void;

  /**
   * Enable drawing.
   *
   * @param enable Enable
   * @returns this.
   */
  setEnable(enable: boolean): this;

  /**
   * Update drawing.
   *
   * @param collisions Collisions would be drawn.
   */
  updateDrawing(collisions: readonly Collision[]): void;
}
