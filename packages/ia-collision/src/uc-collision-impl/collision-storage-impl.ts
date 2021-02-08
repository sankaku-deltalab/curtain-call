import { ActorId } from "@curtain-call/entity";
import { CollisionStorage, CollisionState } from "@curtain-call/uc-collision";

export class CollisionStorageImpl implements CollisionStorage {
  private readonly storage = new Map<ActorId, Readonly<CollisionState>>();

  addCollision(actorId: ActorId, state: CollisionState): void {
    if (this.storage.has(actorId)) throw new Error("Already collision added");
    this.storage.set(actorId, state);
  }

  deleteCollision(actorId: ActorId): void {
    this.storage.delete(actorId);
  }

  updateCollision(actorId: ActorId, state: CollisionState): void {
    if (!this.storage.has(actorId)) throw new Error("Yet not collision added");
    this.storage.set(actorId, state);
  }

  getCollision(actorId: ActorId): Readonly<CollisionState> {
    const state = this.storage.get(actorId);
    if (!state) throw new Error("Yet not collision added");
    return state;
  }

  getCollisions(
    actorIds: readonly ActorId[]
  ): Map<ActorId, Readonly<CollisionState>> {
    return new Map(actorIds.map((actor) => [actor, this.getCollision(actor)]));
  }
}
