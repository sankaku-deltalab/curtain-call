import { VectorLike } from "@curtain-call/shared-dependencies";
import { Seconds } from "@curtain-call/entity";

export type SpriteId = symbol | "__lines" | "__rects" | "__SpriteId__";
export type ImageId = symbol | "__ImageId__";

export type RectsProps = {
  rects: { center: VectorLike; size: VectorLike }[];
  thickness: number;
  lineColor: [number, number, number, number] | string;
  fillColor: [number, number, number, number] | string;
};

export type LinesProps = {
  rects: { start: VectorLike; end: VectorLike }[];
  thickness: number;
  lineColor: [number, number, number, number] | string;
};

export type SpriteLikeProps<TImageId> = TImageId extends "__rects"
  ? RectsProps
  : TImageId extends "__lines"
  ? LinesProps
  : Record<string, unknown>;

export interface SpriteLike<
  TImageId extends ImageId = ImageId,
  TProps extends SpriteLikeProps<TImageId> = SpriteLikeProps<TImageId>
> {
  spriteId: SpriteId;
  imageId: ImageId;
  visible: boolean;
  elapsedSec: Seconds;
  props: Readonly<TProps>;
}
