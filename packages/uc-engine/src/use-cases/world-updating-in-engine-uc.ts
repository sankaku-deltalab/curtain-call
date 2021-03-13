import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId, Seconds, WorldId } from "@curtain-call/entity";
import { EngineWorldMapping } from "../common";
import { injectTokens } from "../inject-tokens";

export interface WorldUpdater {
  updateWorlds(
    engine: EngineId,
    world: readonly WorldId[],
    engineDeltaSec: Seconds
  ): void;
}

@injectable()
export class WorldUpdatingInEngineUC {
  constructor(
    @inject(injectTokens.EngineWorldMapping)
    private readonly engineWorldMapping: EngineWorldMapping,
    @inject(injectTokens.WorldUpdater)
    private readonly worldUpdater: WorldUpdater
  ) {}

  updateWorldInEngine(engine: EngineId, deltaSec: Seconds): void {
    const worlds = this.engineWorldMapping.getWorldsFromEngine(engine);
    this.worldUpdater.updateWorlds(engine, worlds, deltaSec);
  }
}
