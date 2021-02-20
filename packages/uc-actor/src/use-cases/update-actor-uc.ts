import {
  injectable,
  inject,
  EventEmitter,
} from "@curtain-call/shared-dependencies";
import { ActorId, Seconds } from "@curtain-call/entity";
import { ActorStorage, ActorUpdateEvent } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class UpdateActorUC {
  constructor(
    @inject(injectTokens.ActorStorage)
    private readonly actorStorage: ActorStorage
  ) {}

  emitPreUpdateEvent(actor: ActorId, deltaSec: Seconds): void {
    this.getEmitter(actor).emit("preUpdate", deltaSec);
  }

  emitUpdateEvent(actor: ActorId, deltaSec: Seconds): void {
    this.getEmitter(actor).emit("updated", deltaSec);
  }

  emitPostUpdateEvent(actor: ActorId, deltaSec: Seconds): void {
    this.getEmitter(actor).emit("postUpdate", deltaSec);
  }

  addEventListener<V extends keyof ActorUpdateEvent>(
    actor: ActorId,
    name: V,
    cb: (...args: ActorUpdateEvent[V]) => void
  ): void {
    this.getEmitter(actor).on(name, cb);
  }

  removeEventListener<V extends keyof ActorUpdateEvent>(
    actor: ActorId,
    name: V,
    cb: (...args: ActorUpdateEvent[V]) => void
  ): void {
    this.getEmitter(actor).off(name, cb);
  }

  private getEmitter(actor: ActorId): EventEmitter<ActorUpdateEvent> {
    const state = this.actorStorage.getActor(actor);
    return state.eventEmitter;
  }
}
