import { Matrix, Vector } from "trans-vector2d";
import { DrawingRepresentation, Box2d } from "@curtain-call/entity";

/**
 * `DrawingRepresentationContainer` represent any multiple drawing thing.
 */
export interface DrawingRepresentationContainer extends DrawingRepresentation {
  readonly drawingRepresentationType: "container";
  readonly children: readonly DrawingRepresentation[];
}

export const isDrawingRepresentationContainer = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationContainer =>
  obj.drawingRepresentationType === "container";

/**
 * `DrawingRepresentationSprite` represent single image.
 */
export interface DrawingRepresentationSprite extends DrawingRepresentation {
  readonly drawingRepresentationType: "sprite";
  readonly imageId: string;
  readonly transform: Matrix;
}

export const isDrawingRepresentationSprite = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationSprite =>
  obj.drawingRepresentationType === "sprite";

/**
 * `DrawingRepresentationSprite` represent multiple AABB.
 * NOTE: Axes is axes of game, not rendering.
 */
export interface DrawingRepresentationRectangles extends DrawingRepresentation {
  readonly drawingRepresentationType: "rectangles";
  readonly rectangles: readonly Box2d[];
  readonly lineColor: number;
  readonly lineThickness: number;
  readonly fillColor: number;
}

export const isDrawingRepresentationRectangles = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationRectangles =>
  obj.drawingRepresentationType === "rectangles";

/**
 * `DrawingRepresentationLines` represent multiple lines.
 */
export interface DrawingRepresentationLines extends DrawingRepresentation {
  readonly drawingRepresentationType: "lines";
  readonly lines: readonly [Vector, Vector][];
  readonly lineColor: number;
  readonly lineThickness: number;
}

export const isDrawingRepresentationLines = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationLines =>
  obj.drawingRepresentationType === "lines";
