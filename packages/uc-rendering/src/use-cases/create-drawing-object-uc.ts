import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { DrawingObjectStorage } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class CreateDrawingObjectUC {
  constructor(
    @inject(injectTokens.DrawingObjectStorage)
    private readonly drawingObjectStorage: DrawingObjectStorage
  ) {}

  createDrawingObject(actor: ActorId): void {
    this.drawingObjectStorage.createDrawingObject(actor, {
      sprites: [],
      visible: true,
    });
  }

  deleteDrawingObject(actor: ActorId): void {
    this.drawingObjectStorage.deleteDrawingObject(actor);
  }
}
