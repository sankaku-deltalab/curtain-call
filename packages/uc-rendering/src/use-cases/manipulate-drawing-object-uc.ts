import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import {
  DrawingObjectStorage,
  DrawingObjectState,
  SpriteLike,
} from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ManipulateDrawingObjectUC {
  constructor(
    @inject(injectTokens.DrawingObjectStorage)
    private readonly drawingObjectStorage: DrawingObjectStorage
  ) {}

  addSprites(actor: ActorId, ...sprites: SpriteLike[]): void {
    const oldState = this.drawingObjectStorage.getState(actor);
    const newState: DrawingObjectState = {
      ...oldState,
      sprites: [...oldState.sprites, ...sprites],
    };
    this.drawingObjectStorage.setState(actor, newState);
  }

  getSprites(actor: ActorId): readonly Readonly<SpriteLike>[] {
    return this.drawingObjectStorage.getState(actor).sprites;
  }

  setSprites(actor: ActorId, sprites: SpriteLike[]): void {
    const oldState = this.drawingObjectStorage.getState(actor);
    const newState: DrawingObjectState = {
      ...oldState,
      sprites,
    };
    this.drawingObjectStorage.setState(actor, newState);
  }
}
