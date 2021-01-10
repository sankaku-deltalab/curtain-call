import { Matrix, Vector } from "trans-vector2d";
import { DrawingRepresentation, Box2d } from "@curtain-call/entity";

/**
 * `DrawingRepresentationContainer` represent any multiple drawing thing.
 */
export interface DrawingRepresentationContainer extends DrawingRepresentation {
  readonly style: "container";
  readonly children: readonly DrawingRepresentation[];
}

export const isDrawingRepresentationContainer = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationContainer => obj.style === "container";

/**
 * `DrawingRepresentationSprite` represent single image.
 */
export interface DrawingRepresentationSprite extends DrawingRepresentation {
  readonly style: "sprite";
  readonly imageId: string;
  readonly transform: Matrix;
}

export const isDrawingRepresentationSprite = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationSprite => obj.style === "sprite";

/**
 * `DrawingRepresentationSprite` represent multiple AABB.
 * NOTE: Axes is axes of game, not rendering.
 */
export interface DrawingRepresentationRectangles extends DrawingRepresentation {
  readonly style: "rectangles";
  readonly rectangles: readonly Box2d[];
  readonly lineColor: number;
  readonly lineThickness: number;
  readonly fillColor: number;
}

export const isDrawingRepresentationRectangles = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationRectangles => obj.style === "rectangles";

/**
 * `DrawingRepresentationLines` represent multiple lines.
 */
export interface DrawingRepresentationLines extends DrawingRepresentation {
  readonly style: "lines";
  readonly lines: readonly [Vector, Vector][];
  readonly lineColor: number;
  readonly lineThickness: number;
}

export const isDrawingRepresentationLines = (
  obj: DrawingRepresentation
): obj is DrawingRepresentationLines => obj.style === "lines";
