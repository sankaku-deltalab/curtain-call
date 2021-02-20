import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorStorage } from "../common";
import { injectTokens } from "../inject-tokens";

export interface ActorIdGenerator {
  create(): ActorId;
}

export interface ActorComponentDestroyer {
  destroyComponents(actorId: ActorId): void;
}

@injectable()
export class ActorCreateUC {
  constructor(
    @inject(injectTokens.ActorIdGenerator)
    private readonly actorIdGenerator: ActorIdGenerator,
    @inject(injectTokens.ActorStorage)
    private readonly actorStorage: ActorStorage,
    @inject(injectTokens.ActorComponentDestroyer)
    private readonly actorComponentDestroyer: ActorComponentDestroyer
  ) {}

  createActor(): ActorId {
    const actor = this.actorIdGenerator.create();
    this.actorStorage.addActor(actor);
    return actor;
  }

  destroyActor(actor: ActorId): void {
    this.actorComponentDestroyer.destroyComponents(actor);
    this.actorStorage.removeActor(actor);
  }
}
