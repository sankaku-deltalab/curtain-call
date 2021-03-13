import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId, WorldId } from "@curtain-call/entity";
import { EngineWorldMapping } from "@curtain-call/uc-engine";
import { EngineAllStorage } from "../engine-all-storage";
import { injectTokens } from "../inject-tokens";

@injectable()
export class EngineWorldMappingImpl implements EngineWorldMapping {
  constructor(
    @inject(injectTokens.EngineAllStorage)
    private readonly engineAllStorage: EngineAllStorage
  ) {}

  addWorldToEngine(engine: EngineId, world: WorldId): void {
    const state = this.engineAllStorage.get(engine);
    state.containingWorlds.add(world);
  }

  removeWorldFromEngine(engine: EngineId, world: WorldId): void {
    const state = this.engineAllStorage.get(engine);
    state.containingWorlds.delete(world);
  }

  getWorldsFromEngine(engine: EngineId): readonly WorldId[] {
    const state = this.engineAllStorage.get(engine);
    return Array.from(state.containingWorlds);
  }
}
