import { ActorId, EngineId, Seconds } from "@curtain-call/entity";

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
  getState(actor: ActorId): Readonly<DrawingObjectState>;
  setState(actor: ActorId, newObject: DrawingObjectState): void;
}

export interface RendererInstance {
  render(sprites: readonly Readonly<SpriteLike>[]): void;
}

export interface RendererInstanceStorage {
  setRendererInstance(engine: EngineId, instance: RendererInstance): void;
  getRendererInstance(engine: EngineId): Readonly<RendererInstance>;
}
