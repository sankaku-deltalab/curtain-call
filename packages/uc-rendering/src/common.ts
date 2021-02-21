import { ActorId } from "@curtain-call/entity";

export interface SpriteLike {
  visible: boolean;
}

export type DrawingObjectState = {
  sprites: SpriteLike[];
  visible: boolean;
};

export interface DrawingObjectStorage {
  createDrawingObject(actor: ActorId, initialState: DrawingObjectState): void;
  deleteDrawingObject(actor: ActorId): void;
  getDrawingObject(actor: ActorId): Readonly<DrawingObjectState>;
}
