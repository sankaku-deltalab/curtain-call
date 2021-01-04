import { Matrix } from "trans-vector2d";
import { DrawingRepresentation } from "@curtain-call/entity";

/**
 * `DisplayObject` deal `DrawingRepresentation` for rendering.
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
  calcDrawingRepresentation(
    parentTransform: Matrix
  ): readonly DrawingRepresentation[];
}
