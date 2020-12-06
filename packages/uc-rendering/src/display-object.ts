import { Matrix } from "trans-vector2d";
import { DrawingObject } from "@curtain-call/entity";

/**
 * `DisplayObject` deal `DrawingObject` for rendering.
 */
export interface DisplayObject {
  /**
   * Update image status.
   *
   * @param deltaSec Delta seconds.
   */
  update(deltaSec: number): void;

  /**
   * Calculate drawing objects.
   *
   * @param parentTransform Parent transformation matrix.
   * @returns Drawing objects.
   */
  calcDrawingObject(parentTransform: Matrix): readonly DrawingObject[];
}
