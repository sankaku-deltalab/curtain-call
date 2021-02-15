import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId } from "@curtain-call/entity";
import { ActorToWorldMapping, ActorDestroyingEnablerForWorld } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorAddingToWorldUC {
  constructor(
    @inject(injectTokens.ActorToWorldMapping)
    private readonly actorToWorldMapping: ActorToWorldMapping,
    @inject(injectTokens.ActorDestroyingEnablerForWorld)
    private readonly actorDestroyingEnablerForWorld: ActorDestroyingEnablerForWorld
  ) {}

  addActorToWorld(world: WorldId, actor: ActorId): void {
    this.actorToWorldMapping.stage(world, actor);
  }

  removeActorFromWorld(world: WorldId, actor: ActorId): void {
    this.actorToWorldMapping.remove(world, actor);
  }

  getWorldContainsActor(actor: ActorId): WorldId | undefined {
    return this.actorToWorldMapping.getWorldContainsActor(actor);
  }

  getActiveActorsInWorld(world: WorldId): ReadonlySet<ActorId> {
    return this.actorToWorldMapping.getActiveActors(world);
  }

  protectActorFromDestroyingWhenRemovedFromWorld(actor: ActorId): void {
    this.actorDestroyingEnablerForWorld.protectActorFromDestroyingWhenRemovedFromWorld(
      actor
    );
  }
}
