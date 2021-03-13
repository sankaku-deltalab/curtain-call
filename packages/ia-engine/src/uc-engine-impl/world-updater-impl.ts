import { injectable, inject } from "@curtain-call/shared-dependencies";
import { EngineId, WorldId, Seconds } from "@curtain-call/entity";
import { WorldUpdater } from "@curtain-call/uc-engine";
import { UpdateWorldUC } from "@curtain-call/uc-world";
import { injectTokens } from "../inject-tokens";

@injectable()
export class WorldUpdaterImpl implements WorldUpdater {
  constructor(
    @inject(injectTokens.UpdateWorldUC)
    private readonly updateWorldUC: UpdateWorldUC
  ) {}

  updateWorlds(
    engine: EngineId,
    worlds: readonly WorldId[],
    engineDeltaSec: Seconds
  ): void {
    worlds.forEach((world) => {
      this.updateWorldUC.updateWorld(engine, world, engineDeltaSec);
    });
  }
}
