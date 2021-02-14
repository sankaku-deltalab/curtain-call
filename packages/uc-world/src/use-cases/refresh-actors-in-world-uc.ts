import { injectable, inject } from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import {
  ActorToWorldMapping,
  ActorDestroyingEnablerForWorld,
  ActorDestroyingRequester,
} from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class RefreshActorsInWorldUC {
  constructor(
    @inject(injectTokens.ActorToWorldMapping)
    private readonly actorToWorldMapping: ActorToWorldMapping,
    @inject(injectTokens.ActorDestroyingEnablerForWorld)
    private readonly actorDestroyingEnablerForWorld: ActorDestroyingEnablerForWorld,
    @inject(injectTokens.ActorDestroyingRequester)
    private readonly actorDestroyingRequester: ActorDestroyingRequester
  ) {}

  refreshActorsInWorld(world: WorldId): void {
    // Move actors to "active" set from "stage" set.
    const staged = this.actorToWorldMapping.popStagedActors(world);
    const actives = this.actorToWorldMapping.popActiveActors(world);
    staged.forEach((ac) => actives.add(ac));

    // Remove actors if should remove it.
    const removing = this.actorToWorldMapping.popRemovingActors(world);
    removing.forEach((actor) => {
      actives.delete(actor);
    });
    this.actorToWorldMapping.setActiveActors(world, actives);

    removing.forEach((actor) => {
      const shouldDestroy = this.actorDestroyingEnablerForWorld.actorShouldDestroyWhenRemovedFromWorld(
        actor
      );
      if (shouldDestroy) this.actorDestroyingRequester.requestDestroy(actor);
    });
    removing.clear();
  }
}
