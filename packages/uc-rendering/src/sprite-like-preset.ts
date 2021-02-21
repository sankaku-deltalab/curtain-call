import { VectorLike } from "@curtain-call/shared-dependencies";
import { SpriteLike } from "./common";

export type SpriteProps = {
  imageId: string | symbol;
  state: string | symbol;
};

export type Sprite<
  TUniqueProps extends Record<string, unknown> = {}
> = SpriteLike<SpriteProps, TUniqueProps>;

export type RectsProps = {
  rects: { center: VectorLike; size: VectorLike }[];
  thickness: number;
  lineColor: [number, number, number, number] | string;
  fillColor: [number, number, number, number] | string;
};

export type Rects<
  TUniqueProps extends Record<string, unknown> = {}
> = SpriteLike<RectsProps, TUniqueProps>;

export type LinesProps = {
  rects: { start: VectorLike; end: VectorLike }[];
  thickness: number;
  lineColor: [number, number, number, number] | string;
};

export type Lines<
  TUniqueProps extends Record<string, unknown> = {}
> = SpriteLike<RectsProps, TUniqueProps>;
