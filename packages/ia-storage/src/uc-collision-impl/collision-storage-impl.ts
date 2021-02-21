import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { CollisionStorage, CollisionState } from "@curtain-call/uc-collision";
import { ActorAllState, ActorAllStorage } from "../actor-all-storage";
import { injectTokens } from "../inject-tokens";

@injectable()
export class CollisionStorageImpl implements CollisionStorage {
  constructor(
    @inject(injectTokens.ActorAllStorage)
    private readonly actorAllStorage: ActorAllStorage
  ) {}

  updateCollision(
    actor: ActorId,
    state: Omit<CollisionState, "eventEmitter">
  ): void {
    const oldState = this.actorAllStorage.get(actor);
    const newState: ActorAllState = {
      ...oldState,
      collision: state,
    };
    this.actorAllStorage.set(actor, newState);
  }

  getCollision(actor: ActorId): Readonly<CollisionState> {
    const state = this.actorAllStorage.get(actor);
    return {
      ...state.collision,
      eventEmitter: state.eventEmitter,
    };
  }

  getCollisions(
    actor: readonly ActorId[]
  ): Map<ActorId, Readonly<CollisionState>> {
    return new Map(actor.map((actor) => [actor, this.getCollision(actor)]));
  }
}
