import { Matrix, Vector } from "trans-vector2d";
import { DrawingObject, Box2d } from "@curtain-call/entity";

/**
 * `DrawingObjectContainer` represent any multiple drawing thing.
 */
export interface DrawingObjectContainer extends DrawingObject {
  readonly children: readonly DrawingObject[];
}

/**
 * `DrawingObjectSprite` represent single image.
 */
export interface DrawingObjectSprite extends DrawingObject {
  readonly imageId: string;
  readonly transform: Matrix;
}

/**
 * `DrawingObjectSprite` represent multiple AABB.
 * NOTE: Axes is axes of game, not rendering.
 */
export interface DrawingObjectRectangles extends DrawingObject {
  readonly rectangles: readonly Box2d[];
  readonly lineColor: number;
  readonly lineThickness: number;
  readonly fillColor: number;
}

/**
 * `DrawingObjectLines` represent multiple lines.
 */
export interface DrawingObjectLines extends DrawingObject {
  readonly lines: readonly [Vector, Vector][];
  readonly lineColor: number;
  readonly lineThickness: number;
}
