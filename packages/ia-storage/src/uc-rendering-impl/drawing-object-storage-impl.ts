import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import {
  DrawingObjectStorage,
  DrawingObjectState,
} from "@curtain-call/uc-rendering";
import { ActorAllState, ActorAllStorage } from "../actor-all-storage";
import { injectTokens } from "../inject-tokens";

@injectable()
export class DrawingObjectStorageImpl implements DrawingObjectStorage {
  constructor(
    @inject(injectTokens.ActorAllStorage)
    private readonly actorAllStorage: ActorAllStorage
  ) {}

  getState(actor: ActorId): Readonly<DrawingObjectState> {
    return this.actorAllStorage.get(actor).drawingObject;
  }

  setState(actor: ActorId, newObject: DrawingObjectState): void {
    const oldState = this.actorAllStorage.get(actor);
    const newState: ActorAllState = {
      ...oldState,
      drawingObject: newObject,
    };
    this.actorAllStorage.set(actor, newState);
  }
}
