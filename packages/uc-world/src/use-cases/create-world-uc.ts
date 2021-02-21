import { injectable, inject } from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { ActorToWorldMapping, WorldStorage } from "../common";
import { injectTokens } from "../inject-tokens";

export interface WorldIdGenerator {
  generate(): WorldId;
}

@injectable()
export class CreateWorldUC {
  constructor(
    @inject(injectTokens.WorldIdGenerator)
    private readonly worldIdGenerator: WorldIdGenerator,
    @inject(injectTokens.WorldStorage)
    private readonly worldStorage: WorldStorage,
    @inject(injectTokens.ActorToWorldMapping)
    private readonly actorToWorldMapping: ActorToWorldMapping
  ) {}

  createWorld(): WorldId {
    const worldId = this.worldIdGenerator.generate();
    this.worldStorage.addWorld(worldId);
    return worldId;
  }

  deleteWorld(world: WorldId): void {
    this.actorToWorldMapping.removeWorld(world);
    this.worldStorage.removeWorld(world);
  }

  hasWorld(world: WorldId): boolean {
    return this.worldStorage.hasWorld(world);
  }
}
