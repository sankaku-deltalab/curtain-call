import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorBase, ActorStorage } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorGetUC<TActor extends ActorBase> {
  constructor(
    @inject(injectTokens.ActorStorage)
    private readonly actorStorage: ActorStorage<TActor>
  ) {}

  getActor(actorId: ActorId): TActor {
    return this.actorStorage.getActor(actorId);
  }

  removeActor(actorId: ActorId): void {
    this.actorStorage.removeActor(actorId);
  }
}
