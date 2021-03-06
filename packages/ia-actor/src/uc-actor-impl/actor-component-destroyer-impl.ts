import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorComponentDestroyer } from "@curtain-call/uc-actor";
import { ActorAddingToWorldUC } from "@curtain-call/uc-world";
import { CollisionModifyUC } from "@curtain-call/uc-collision";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorComponentDestroyerImpl implements ActorComponentDestroyer {
  constructor(
    @inject(injectTokens.ActorAddingToWorldUC)
    private readonly actorAddingToWorldUC: ActorAddingToWorldUC,
    @inject(injectTokens.CollisionModifyUC)
    private readonly collisionModifyUC: CollisionModifyUC
  ) {}

  destroyComponents(actor: ActorId): void {
    if (this.actorAddingToWorldUC.getWorldContainsActor(actor)) {
      throw new Error("Do not delete actor while actor in world");
    }
  }
}
