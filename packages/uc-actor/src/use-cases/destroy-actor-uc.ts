import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { injectTokens } from "../inject-tokens";

export interface ActorDestroyer {
  destroyActor(actorId: ActorId): void;
}

@injectable()
export class DestroyActorUC {
  constructor(
    @inject(injectTokens.ActorDestroyer)
    private readonly actorDestroyer: ActorDestroyer
  ) {}

  destroyActor(actorId: ActorId): void {
    return this.actorDestroyer.destroyActor(actorId);
  }
}
