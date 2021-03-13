import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId, WorldId } from "@curtain-call/entity";
import { EngineWorldMapping } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class EngineAddingWorldUC {
  constructor(
    @inject(injectTokens.EngineWorldMapping)
    private readonly engineWorldMapping: EngineWorldMapping
  ) {}

  addWorldToEngine(engine: EngineId, world: WorldId): void {
    this.engineWorldMapping.addWorldToEngine(engine, world);
  }

  removeWorldFromEngine(engine: EngineId, world: WorldId): void {
    this.engineWorldMapping.removeWorldFromEngine(engine, world);
  }
}
