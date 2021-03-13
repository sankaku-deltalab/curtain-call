import {
  injectable,
  inject,
  container,
} from "@curtain-call/shared-dependencies";
import { EngineId, Seconds } from "@curtain-call/entity";
import {
  EngineCreationUC,
  WorldUpdatingInEngineUC,
} from "@curtain-call/uc-engine";
import { RegisterRendererUC, SpriteLike } from "@curtain-call/uc-rendering";
import { injectTokens } from "../inject-tokens";

export interface EngineInput {
  update(deltaSec: Seconds): void;
}

@injectable()
export class EngineInputImpl {
  constructor(
    @inject(injectTokens.WorldUpdatingInEngineUC)
    private readonly worldUpdatingInEngineUC: WorldUpdatingInEngineUC
  ) {}

  update(engineId: EngineId, deltaSec: Seconds): void {
    this.worldUpdatingInEngineUC.updateWorldInEngine(engineId, deltaSec);
  }
}

export interface EngineInstance {
  setEngineInput(engineInput: EngineInput): void;
  render(sprites: readonly Readonly<SpriteLike>[]): void;
}

@injectable()
export class EngineRegisterer {
  constructor(
    @inject(injectTokens.DIContainer)
    private readonly diContainer: typeof container,
    @inject(injectTokens.EngineCreationUC)
    private readonly engineCreationUC: EngineCreationUC,
    @inject(injectTokens.RegisterRendererUC)
    private readonly registerRendererUC: RegisterRendererUC
  ) {}

  createEngineInput(): EngineInput {
    return this.diContainer.resolve<EngineInput>(injectTokens.EngineInput);
  }

  registerEngine(engineId: EngineId, instance: EngineInstance): void {
    this.engineCreationUC.create(engineId);
    this.registerRendererUC.registerRenderer(engineId, instance);
  }

  unregisterEngine(engineId: EngineId): void {
    this.engineCreationUC.delete(engineId);
    this.registerRendererUC.unregisterRenderer(engineId);
  }
}
