import {
  injectable,
  inject,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorStorage, ActorState } from "@curtain-call/uc-actor";
import { injectTokens } from "../inject-tokens";
import { ActorEvent } from "@curtain-call/uc-actor/dist/common";

@injectable()
export class ActorStorageImpl implements ActorStorage {
  private readonly storage = new Map<ActorId, ActorState>();

  constructor(
    @inject(injectTokens.EventEmitterFactory)
    private readonly eventEmitterFactory: EventEmitterFactory
  ) {}

  addActor(actor: ActorId): void {
    if (this.storage.has(actor)) throw new Error("Actor was already added");
    const state: ActorState = {
      eventEmitter: this.eventEmitterFactory.create<ActorEvent>(),
    };
    this.storage.set(actor, state);
  }

  removeActor(actor: ActorId): void {
    if (!this.storage.has(actor)) throw new Error("Actor is not added");
    this.storage.delete(actor);
  }

  getActor(actor: ActorId): Readonly<ActorState> {
    const state = this.storage.get(actor);
    if (!state) throw new Error("Actor is not added");
    return state;
  }
}
