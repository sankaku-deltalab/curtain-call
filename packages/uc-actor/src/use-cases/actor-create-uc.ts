import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { injectTokens } from "../inject-tokens";

export interface ActorBase {
  readonly id: ActorId;
}

export interface ActorFactory<TActor extends ActorBase> {
  createActor(): TActor;
}

export interface ActorStorage<TActor extends ActorBase> {
  addActor(actor: TActor): void;
  removeActor(actorId: ActorId): void;
  getActor(actorId: ActorId): TActor;
}

@injectable()
export class ActorCreateUC<TActor extends ActorBase> {
  constructor(
    @inject(injectTokens.ActorFactory)
    private readonly actorFactory: ActorFactory<TActor>,
    @inject(injectTokens.ActorStorage)
    private readonly actorStorage: ActorStorage<TActor>
  ) {}

  createActor(): TActor {
    const actor = this.actorFactory.createActor();
    this.actorStorage.addActor(actor);
    return actor;
  }

  removeActor(actorId: ActorId): void {
    this.actorStorage.removeActor(actorId);
  }
}
