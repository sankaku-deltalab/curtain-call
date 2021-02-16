import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { DestroyActorUC } from "@curtain-call/uc-actor";
import { ActorDestroyingRequester } from "@curtain-call/uc-world";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorDestroyingRequesterImpl implements ActorDestroyingRequester {
  constructor(
    @inject(injectTokens.DestroyActorUC)
    private readonly destroyActorUC: DestroyActorUC
  ) {}

  requestDestroy(actor: ActorId): void {
    this.destroyActorUC.destroyActor(actor);
  }
}
