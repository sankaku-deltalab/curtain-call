import { ActorId } from "@curtain-call/entity";

export interface ActorBase {
  readonly id: ActorId;
}

export interface ActorStorage<TActor extends ActorBase> {
  addActor(actor: TActor): void;
  removeActor(actorId: ActorId): void;
  getActor(actorId: ActorId): TActor;
}
