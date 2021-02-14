import { injectable } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorDestroyingEnablerForWorld } from "@curtain-call/uc-world";

@injectable()
export class ActorDestroyingEnablerForWorldImpl
  implements ActorDestroyingEnablerForWorld {
  private readonly actorsDoNotDestroy = new Set<ActorId>();

  protectActorFromDestroyingWhenRemovedFromWorld(actor: ActorId): void {
    this.actorsDoNotDestroy.add(actor);
  }

  actorShouldDestroyWhenRemovedFromWorld(actor: ActorId): boolean {
    return !this.actorsDoNotDestroy.has(actor);
  }
}
