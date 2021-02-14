import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId, ActorsContainer } from "@curtain-call/entity";
import { RefreshActorsInWorldUC, ActorAddingToWorldUC } from "../use-cases";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorsContainerImpl implements ActorsContainer {
  constructor(
    @inject(injectTokens.RefreshActorsInWorldUC)
    private readonly refreshActorsInWorldUC: RefreshActorsInWorldUC,
    @inject(injectTokens.ActorAddingToWorldUC)
    private readonly actorAddingToWorldUC: ActorAddingToWorldUC
  ) {}

  /**
   * 1. Move actors to "active" set from "stage" set.
   * 2. Remove actors if should remove it.
   * 3. Destroy removed actors if should destroy it.
   */
  refresh(world: WorldId): void {
    this.refreshActorsInWorldUC.refreshActorsInWorld(world);
  }

  getActiveActors(world: WorldId): ReadonlySet<ActorId> {
    return this.actorAddingToWorldUC.getActiveActorsInWorld(world);
  }
}
