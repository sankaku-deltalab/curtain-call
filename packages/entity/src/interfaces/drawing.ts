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
 * `SpriteLikeDrawing` represent image like object.
 * Image contains
 *
 * - State
 * - Animation time
 */
export interface SpriteLikeDrawing extends DrawingRepresentation {
  style: "sprite";
  imageId: string;
  state: string;
  elapsedSec: number;
  transform: Matrix;
}

export const isSpriteLikeDrawing = (
  obj: DrawingRepresentation
): obj is SpriteLikeDrawing => obj.style === "sprite";

/**
 * `RectanglesDrawing` represent multiple AABB.
 * NOTE: Axes is axes of game, not rendering.
 */
export interface RectanglesDrawing extends DrawingRepresentation {
  style: "rectangles";
  rectangles: readonly Box2d[];
  lineColor: number;
  lineThickness: number;
  fillColor: number;
}

export const isRectanglesDrawing = (
  obj: DrawingRepresentation
): obj is RectanglesDrawing => obj.style === "rectangles";

/**
 * `LinesDrawing` represent multiple lines.
 */
export interface LinesDrawing extends DrawingRepresentation {
  style: "lines";
  lines: readonly [Vector, Vector][];
  lineColor: number;
  lineThickness: number;
}

export const isLinesDrawing = (
  obj: DrawingRepresentation
): obj is LinesDrawing => obj.style === "lines";
