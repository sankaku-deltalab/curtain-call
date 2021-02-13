import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId, ActorsContainer } from "@curtain-call/entity";
import { ActorToWorldMapping } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorsContainerImpl implements ActorsContainer {
  constructor(
    @inject(injectTokens.ActorToWorldMapping)
    private readonly actorToWorldMapping: ActorToWorldMapping
  ) {}

  /**
   * 1. Move actors to "active" set from "stage" set.
   * 2. Remove actors if should remove it.
   * 3. Destroy removed actors if should destroy it.
   */
  refresh(world: WorldId): void {
    this.actorToWorldMapping.refresh(world);
  }

  getActiveActors(world: WorldId): ReadonlySet<ActorId> {
    return this.actorToWorldMapping.getActiveActors(world);
  }
}
