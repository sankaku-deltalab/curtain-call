import { EventEmitter } from "@curtain-call/shared-dependencies";
import { ActorId, Seconds } from "@curtain-call/entity";

export type ActorState = {
  eventEmitter: EventEmitter<ActorUpdateEvent>;
};

export type ActorUpdateEvent = {
  preUpdate: [Seconds];
  updated: [Seconds];
  postUpdate: [Seconds];
};

export type ActorEvent = ActorUpdateEvent;

export interface ActorStorage {
  addActor(actor: ActorId): void;
  removeActor(actorId: ActorId): void;
  getActor(actor: ActorId): Readonly<ActorState>;
}
