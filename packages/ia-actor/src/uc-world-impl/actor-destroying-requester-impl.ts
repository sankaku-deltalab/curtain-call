import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorStorage } from "@curtain-call/uc-actor";
import { ActorDestroyingRequester } from "@curtain-call/uc-world";
import { Actor } from "../actor";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorDestroyingRequesterImpl implements ActorDestroyingRequester {
  constructor(
    @inject(injectTokens.ActorStorage)
    private readonly actorStorage: ActorStorage<Actor>
  ) {}

  requestDestroy(actor: ActorId): void {
    this.actorStorage.getActor(actor).destroySelf();
  }
}
