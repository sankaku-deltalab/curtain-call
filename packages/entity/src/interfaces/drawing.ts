import { Matrix, Vector } from "trans-vector2d";
import { Box2d } from "./misc";

export type DrawingObjectId = string | symbol;
export type DrawingStyle = string | symbol;

/**
 * `DrawingRepresentation` represent drawing thing.
 */
export type DrawingRepresentation<
  T extends DrawingStyle = DrawingStyle,
  U extends Record<string, unknown> = {}
> = {
  /** `objectId` is used for linking between in-game drawing thing and in-rendering drawing thing for speed. */
  readonly objectId: DrawingObjectId;
  readonly style: T;
  readonly props: U;
  readonly zIndex: number;
};

export type ImageId = string | symbol;
export type ImageState = string | symbol;

/**
 * `SpriteLikeDrawing` represent image like object.
 * Image contains
 *
 * - State
 * - Animation time
 */
export type SpriteLikeDrawing = DrawingRepresentation<
  "sprite",
  {
    imageId: ImageId;
    state: ImageState;
    elapsedSec: number;
    transform: Matrix;
  }
>;

export const isSpriteLikeDrawing = (
  obj: DrawingRepresentation
): obj is SpriteLikeDrawing => obj.style === "sprite";

/**
 * `RectanglesDrawing` represent multiple AABB.
 * NOTE: Axes is axes of game, not rendering.
 */
export type RectanglesDrawing = DrawingRepresentation<
  "rectangles",
  {
    rectangles: readonly Readonly<Box2d>[];
    lineColor: number;
    lineThickness: number;
    fillColor: number;
  }
>;

export const isRectanglesDrawing = (
  obj: DrawingRepresentation
): obj is RectanglesDrawing => obj.style === "rectangles";

/**
 * `LinesDrawing` represent multiple lines.
 */
export type LinesDrawing = DrawingRepresentation<
  "lines",
  {
    lines: readonly Readonly<[Vector, Vector]>[];
    lineColor: number;
    lineThickness: number;
  }
>;

export const isLinesDrawing = (
  obj: DrawingRepresentation
): obj is LinesDrawing => obj.style === "lines";
