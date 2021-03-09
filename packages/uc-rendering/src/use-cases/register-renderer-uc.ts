import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId } from "@curtain-call/entity";
import { RendererInstanceStorage, RendererInstance } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class RegisterRendererUC {
  constructor(
    @inject(injectTokens.RendererInstanceStorage)
    private readonly rendererInstanceStorage: RendererInstanceStorage
  ) {}

  registerRenderer(engine: EngineId, rendererInstance: RendererInstance): void {
    this.rendererInstanceStorage.setRendererInstance(engine, rendererInstance);
  }

  unregisterRenderer(engine: EngineId): void {
    this.rendererInstanceStorage.deleteRendererInstance(engine);
  }
}
