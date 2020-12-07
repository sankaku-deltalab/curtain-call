import { Matrix, Vector } from "trans-vector2d";
import { DrawingObject, Box2d } from "@curtain-call/entity";

/**
 * `DrawingObjectContainer` represent any multiple drawing thing.
 */
export interface DrawingObjectContainer extends DrawingObject {
  readonly drawingObjectType: "container";
  readonly children: readonly DrawingObject[];
}

export const isDrawingObjectContainer = (
  obj: DrawingObject
): obj is DrawingObjectContainer => obj.drawingObjectType === "container";

/**
 * `DrawingObjectSprite` represent single image.
 */
export interface DrawingObjectSprite extends DrawingObject {
  readonly drawingObjectType: "sprite";
  readonly imageId: string;
  readonly transform: Matrix;
}

export const isDrawingObjectSprite = (
  obj: DrawingObject
): obj is DrawingObjectSprite => obj.drawingObjectType === "sprite";

/**
 * `DrawingObjectSprite` represent multiple AABB.
 * NOTE: Axes is axes of game, not rendering.
 */
export interface DrawingObjectRectangles extends DrawingObject {
  readonly drawingObjectType: "rectangles";
  readonly rectangles: readonly Box2d[];
  readonly lineColor: number;
  readonly lineThickness: number;
  readonly fillColor: number;
}

export const isDrawingObjectRectangles = (
  obj: DrawingObject
): obj is DrawingObjectRectangles => obj.drawingObjectType === "rectangles";

/**
 * `DrawingObjectLines` represent multiple lines.
 */
export interface DrawingObjectLines extends DrawingObject {
  readonly drawingObjectType: "lines";
  readonly lines: readonly [Vector, Vector][];
  readonly lineColor: number;
  readonly lineThickness: number;
}

export const isDrawingObjectLines = (
  obj: DrawingObject
): obj is DrawingObjectLines => obj.drawingObjectType === "lines";
