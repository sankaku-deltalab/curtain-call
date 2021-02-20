import {
  injectable,
  inject,
  EventEmitter,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import {
  ActorUpdateEventEmitterStorage,
  ActorUpdateEvent,
} from "@curtain-call/uc-actor";
import { injectTokens } from "../inject-tokens";

@injectable()
export class ActorUpdateEventEmitterStorageImpl
  implements ActorUpdateEventEmitterStorage {
  private readonly emitters = new Map<
    ActorId,
    EventEmitter<ActorUpdateEvent>
  >();

  constructor(
    @inject(injectTokens.EventEmitterFactory)
    private readonly eventEmitterFactory: EventEmitterFactory
  ) {}

  getEventEmitter(actor: ActorId): EventEmitter<ActorUpdateEvent> {
    const ee = this.emitters.get(actor);
    if (ee) return ee;

    const newEe = this.eventEmitterFactory.create<ActorUpdateEvent>();
    this.emitters.set(actor, newEe);
    return newEe;
  }

  deleteEventEmitter(actor: ActorId): void {
    this.emitters.delete(actor);
  }
}
