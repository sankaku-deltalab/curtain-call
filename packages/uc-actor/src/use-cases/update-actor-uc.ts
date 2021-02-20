import {
  injectable,
  inject,
  EventEmitter,
} from "@curtain-call/shared-dependencies";
import { ActorId, Seconds } from "@curtain-call/entity";
import { injectTokens } from "../inject-tokens";

export type ActorUpdateEvent = {
  preUpdate: [Seconds];
  updated: [Seconds];
  postUpdate: [Seconds];
};

export interface ActorUpdateEventEmitterStorage {
  getEventEmitter(actor: ActorId): EventEmitter<ActorUpdateEvent>;
  deleteEventEmitter(actor: ActorId): void;
}

@injectable()
export class UpdateActorUC {
  constructor(
    @inject(injectTokens.ActorUpdateEventEmitterStorage)
    private readonly ActorUpdateEventEmitterStorage: ActorUpdateEventEmitterStorage
  ) {}

  emitPreUpdateEvent(actor: ActorId, deltaSec: Seconds): void {
    this.ActorUpdateEventEmitterStorage.getEventEmitter(actor).emit(
      "preUpdate",
      deltaSec
    );
  }

  emitUpdateEvent(actor: ActorId, deltaSec: Seconds): void {
    this.ActorUpdateEventEmitterStorage.getEventEmitter(actor).emit(
      "updated",
      deltaSec
    );
  }

  emitPostUpdateEvent(actor: ActorId, deltaSec: Seconds): void {
    this.ActorUpdateEventEmitterStorage.getEventEmitter(actor).emit(
      "postUpdate",
      deltaSec
    );
  }

  addEventListener<V extends keyof ActorUpdateEvent>(
    actor: ActorId,
    name: V,
    cb: (...args: ActorUpdateEvent[V]) => void
  ): void {
    this.ActorUpdateEventEmitterStorage.getEventEmitter(actor).on(name, cb);
  }

  removeEventListener<V extends keyof ActorUpdateEvent>(
    actor: ActorId,
    name: V,
    cb: (...args: ActorUpdateEvent[V]) => void
  ): void {
    this.ActorUpdateEventEmitterStorage.getEventEmitter(actor).off(name, cb);
  }
}
