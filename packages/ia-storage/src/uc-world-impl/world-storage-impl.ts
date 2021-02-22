import { injectable, inject } from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { WorldState, WorldStorage } from "@curtain-call/uc-world";
import { WorldAllStorage } from "../world-all-storage";
import { injectTokens } from "../inject-tokens";

@injectable()
export class WorldStorageImpl implements WorldStorage {
  constructor(
    @inject(injectTokens.WorldAllStorage)
    private readonly worldAllStorage: WorldAllStorage
  ) {}

  addWorld(world: WorldId): void {
    this.worldAllStorage.create(world);
  }

  removeWorld(world: WorldId): void {
    this.worldAllStorage.delete(world);
  }

  hasWorld(world: WorldId): boolean {
    return this.worldAllStorage.has(world);
  }

  getWorld(world: WorldId): Readonly<WorldState> {
    const allState = this.worldAllStorage.get(world);
    return {
      eventEmitter: allState.eventEmitter,
    };
  }
}
