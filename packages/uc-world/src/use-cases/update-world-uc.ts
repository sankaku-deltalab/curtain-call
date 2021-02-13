import { injectable, inject } from "@curtain-call/shared-dependencies";
import { WorldId, WorldCore, Seconds } from "@curtain-call/entity";
import { injectTokens } from "../inject-tokens";

@injectable()
export class UpdateWorldUC {
  constructor(
    @inject(injectTokens.WorldCore)
    private readonly worldCore: WorldCore
  ) {}

  updateWorld(world: WorldId, deltaSec: Seconds): void {
    this.worldCore.update(world, deltaSec);
  }
}
