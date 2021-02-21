import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId, Seconds } from "@curtain-call/entity";
import { DrawingObjectStorage } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class UpdateDrawingObjectUC {
  constructor(
    @inject(injectTokens.DrawingObjectStorage)
    private readonly drawingObjectStorage: DrawingObjectStorage
  ) {}

  updateSprites(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    actors.forEach((actor) => {
      const delta = deltaSec.get(actor);
      if (delta === undefined) throw new Error("DeltaSec is not completed");
      const state = this.drawingObjectStorage.getState(actor);
      state.sprites.forEach((sprite) => {
        sprite.elapsedSec += delta;
      });
    });
  }
}
