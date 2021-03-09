import { ActorId, EngineId } from "@curtain-call/entity";
import { SpriteLike } from "./sprite-like";

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
  deleteRendererInstance(engine: EngineId): void;
  getRendererInstance(engine: EngineId): Readonly<RendererInstance>;
}
