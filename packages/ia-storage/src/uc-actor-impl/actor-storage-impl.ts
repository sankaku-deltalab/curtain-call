import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorStorage, ActorState } from "@curtain-call/uc-actor";
import { ActorAllStorage } from "../actor-all-storage";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorStorageImpl implements ActorStorage {
  constructor(
    @inject(injectTokens.ActorAllStorage)
    private readonly actorAllStorage: ActorAllStorage
  ) {}

  addActor(actor: ActorId): void {
    this.actorAllStorage.create(actor);
  }

  removeActor(actor: ActorId): void {
    this.actorAllStorage.delete(actor);
  }

  hasActor(actor: ActorId): boolean {
    return this.actorAllStorage.has(actor);
  }

  getActor(actor: ActorId): Readonly<ActorState> {
    const allState = this.actorAllStorage.get(actor);
    return { eventEmitter: allState.eventEmitter };
  }
}
