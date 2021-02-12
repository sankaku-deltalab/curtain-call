import { ActorId } from "@curtain-call/entity";
import { ActorStorage, ActorBase } from "@curtain-call/uc-actor";

export class ActorStorageImpl<TActor extends ActorBase>
  implements ActorStorage<TActor> {
  private readonly storage = new Map<ActorId, TActor>();

  addActor(actor: TActor): void {
    if (this.storage.has(actor.id)) throw new Error("Actor was already added");
    this.storage.set(actor.id, actor);
  }

  removeActor(actorId: ActorId): void {
    if (!this.storage.has(actorId)) throw new Error("Actor is not added");
    this.storage.delete(actorId);
  }

  getActor(actorId: ActorId): TActor {
    const actor = this.storage.get(actorId);
    if (!actor) throw new Error("Actor is not added");
    return actor;
  }
}
