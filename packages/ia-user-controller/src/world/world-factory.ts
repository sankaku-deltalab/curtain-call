import {
  injectable,
  inject,
  container,
} from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { CreateWorldUC } from "@curtain-call/uc-world";
import { World } from "./world";
import { injectTokens } from "../inject-tokens";

@injectable()
export class WorldFactory {
  private readonly worldInstances = new Map<WorldId, World>();

  constructor(
    @inject(injectTokens.DIContainer)
    private readonly diContainer: typeof container,
    @inject(injectTokens.CreateWorldUC)
    private readonly createWorldUC: CreateWorldUC
  ) {}

  createWorld(): World {
    const worldId = this.createWorldUC.createWorld();
    const worldInstance = this.diContainer
      .resolve<World>(injectTokens.World)
      .setId(worldId);
    this.worldInstances.set(worldId, worldInstance);
    return worldInstance;
  }

  getWorld(worldId: WorldId): World {
    const worldInstance = this.worldInstances.get(worldId);
    if (!worldInstance) {
      if (!this.createWorldUC.hasWorld(worldId)) {
        return this.createWorld();
      }
      throw new Error("World is not created");
    }
    return worldInstance;
  }
}
