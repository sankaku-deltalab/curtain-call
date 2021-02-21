import { ActorId, Seconds } from "@curtain-call/entity";

export interface SpriteLike<
  TCategoryProps extends Record<string, unknown> = {},
  TUniqueProps extends Record<string, unknown> = {}
> {
  categoryProps: Readonly<TCategoryProps>;
  props: Readonly<TUniqueProps>;
  elapsedSec: Seconds;
  visible: boolean;
}

export type DrawingObjectState = {
  sprites: readonly SpriteLike[];
  visible: boolean;
};

export interface DrawingObjectStorage {
  createDrawingObject(actor: ActorId, initialState: DrawingObjectState): void;
  deleteDrawingObject(actor: ActorId): void;
  getState(actor: ActorId): Readonly<DrawingObjectState>;
  setState(actor: ActorId, newObject: DrawingObjectState): void;
}
