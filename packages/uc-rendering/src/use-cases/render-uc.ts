import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId, ActorId } from "@curtain-call/entity";
import { DrawingObjectStorage, RendererInstanceStorage } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class RenderUC {
  constructor(
    @inject(injectTokens.DrawingObjectStorage)
    private readonly drawingObjectStorage: DrawingObjectStorage,
    @inject(injectTokens.RendererInstanceStorage)
    private readonly rendererInstanceStorage: RendererInstanceStorage
  ) {}

  render(engine: EngineId, actors: readonly ActorId[]): void {
    const renderer = this.rendererInstanceStorage.getRendererInstance(engine);
    const sprites = actors.flatMap(
      (actor) => this.drawingObjectStorage.getState(actor).sprites
    );
    renderer.render(sprites);
  }
}
