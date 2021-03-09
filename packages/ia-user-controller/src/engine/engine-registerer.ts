import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId } from "@curtain-call/entity";
import { EngineCreationUC } from "@curtain-call/uc-engine";
import {
  RendererInstance,
  RegisterRendererUC,
} from "@curtain-call/uc-rendering";
import { injectTokens } from "../inject-tokens";

@injectable()
export class EngineRegisterer {
  constructor(
    @inject(injectTokens.EngineCreationUC)
    private readonly engineCreationUC: EngineCreationUC,
    @inject(injectTokens.RegisterRendererUC)
    private readonly registerRendererUC: RegisterRendererUC
  ) {}

  registerEngine(args: {
    engineId: EngineId;
    renderer: RendererInstance;
  }): void {
    this.engineCreationUC.create(args.engineId);
    this.registerRendererUC.registerRenderer(args.engineId, args.renderer);
  }

  unregisterEngine(engineId: EngineId): void {
    this.engineCreationUC.delete(engineId);
    this.registerRendererUC.unregisterRenderer(engineId);
  }
}
