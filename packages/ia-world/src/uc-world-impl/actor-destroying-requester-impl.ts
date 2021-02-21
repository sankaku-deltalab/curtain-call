import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorCreateUC } from "@curtain-call/uc-actor";
import { ActorDestroyingRequester } from "@curtain-call/uc-world";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorDestroyingRequesterImpl implements ActorDestroyingRequester {
  constructor(
    @inject(injectTokens.ActorCreateUC)
    private readonly actorCreateUC: ActorCreateUC
  ) {}

  requestDestroy(actor: ActorId): void {
    this.actorCreateUC.destroyActor(actor);
  }
}
