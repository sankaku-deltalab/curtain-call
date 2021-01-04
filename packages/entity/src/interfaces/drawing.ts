import { Matrix, Vector } from "trans-vector2d";
import { Box2d } from "./misc";

/**
 * `DrawingRepresentation` represent drawing thing.
 */
export interface DrawingRepresentation {
  /** `objectId` is used for linking between in-game drawing thing and in-rendering drawing thing for speed. */
  readonly objectId: string;
  readonly style: string;
  readonly zIndex: number;
}

/**
 * `ContainerDrawing` represent any multiple drawing thing.
 */
export interface ContainerDrawing extends DrawingRepresentation {
  readonly style: "container";
  readonly children: readonly DrawingRepresentation[];
}

export const isContainerDrawing = (
  obj: DrawingRepresentation
): obj is ContainerDrawing => obj.style === "container";

/**
 * `SpriteDrawing` represent single image.
 */
export interface SpriteDrawing extends DrawingRepresentation {
  readonly style: "sprite";
  readonly imageId: string;
  readonly transform: Matrix;
}

export const isSpriteDrawing = (
  obj: DrawingRepresentation
): obj is SpriteDrawing => obj.style === "sprite";

/**
 * `RectanglesDrawing` represent multiple AABB.
 * NOTE: Axes is axes of game, not rendering.
 */
export interface RectanglesDrawing extends DrawingRepresentation {
  readonly style: "rectangles";
  readonly rectangles: readonly Box2d[];
  readonly lineColor: number;
  readonly lineThickness: number;
  readonly fillColor: number;
}

export const isRectanglesDrawing = (
  obj: DrawingRepresentation
): obj is RectanglesDrawing => obj.style === "rectangles";

/**
 * `LinesDrawing` represent multiple lines.
 */
export interface LinesDrawing extends DrawingRepresentation {
  readonly style: "lines";
  readonly lines: readonly [Vector, Vector][];
  readonly lineColor: number;
  readonly lineThickness: number;
}

export const isLinesDrawing = (
  obj: DrawingRepresentation
): obj is LinesDrawing => obj.style === "lines";
