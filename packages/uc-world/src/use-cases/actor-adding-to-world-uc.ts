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

  removeActorToWorld(world: WorldId, actor: ActorId): void {
    this.actorToWorldMapping.remove(world, actor);
  }

  protectActorFromDestroyingWhenRemovedFromWorld(actor: ActorId): void {
    this.actorDestroyingEnablerForWorld.protectActorFromDestroyingWhenRemovedFromWorld(
      actor
    );
  }
}
