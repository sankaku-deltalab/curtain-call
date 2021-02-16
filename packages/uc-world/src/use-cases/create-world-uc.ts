import { injectable, inject } from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { ActorToWorldMapping } from "../common";
import { injectTokens } from "../inject-tokens";

export interface WorldBase {
  readonly id: WorldId;
}

export interface WorldIdGenerator {
  generate(): WorldId;
}

export interface WorldFactory<TWorld extends WorldBase> {
  createWorld(newWorldId: WorldId): TWorld;
}

export interface WorldStorage<TWorld extends WorldBase> {
  addWorld(worldInstance: TWorld): void;
  getWorldInstance(world: WorldId): TWorld | undefined;
  removeWorld(world: WorldId): void;
}

@injectable()
export class CreateWorldUC<TWorld extends WorldBase> {
  constructor(
    @inject(injectTokens.WorldIdGenerator)
    private readonly worldIdGenerator: WorldIdGenerator,
    @inject(injectTokens.WorldFactory)
    private readonly worldFactory: WorldFactory<TWorld>,
    @inject(injectTokens.WorldStorage)
    private readonly worldStorage: WorldStorage<TWorld>,
    @inject(injectTokens.ActorToWorldMapping)
    private readonly actorToWorldMapping: ActorToWorldMapping
  ) {}

  createWorld(): TWorld {
    const worldId = this.worldIdGenerator.generate();
    const worldInstance = this.worldFactory.createWorld(worldId);
    this.worldStorage.addWorld(worldInstance);
    return worldInstance;
  }

  deleteWorld(world: WorldId): void {
    this.actorToWorldMapping.removeWorld(world);
    this.worldStorage.removeWorld(world);
  }

  getWorldInstance(world: WorldId): TWorld | undefined {
    return this.worldStorage.getWorldInstance(world);
  }
}
