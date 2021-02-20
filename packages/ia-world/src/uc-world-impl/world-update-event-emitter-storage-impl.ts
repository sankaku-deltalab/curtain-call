import {
  injectable,
  inject,
  EventEmitter,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import {
  WorldUpdateEventEmitterStorage,
  WorldUpdateEvent,
} from "@curtain-call/uc-world";
import { injectTokens } from "../inject-tokens";

@injectable()
export class WorldUpdateEventEmitterStorageImpl
  implements WorldUpdateEventEmitterStorage {
  private readonly emitters = new Map<
    WorldId,
    EventEmitter<WorldUpdateEvent>
  >();

  constructor(
    @inject(injectTokens.EventEmitterFactory)
    private readonly eventEmitterFactory: EventEmitterFactory
  ) {}

  getEventEmitter(world: WorldId): EventEmitter<WorldUpdateEvent> {
    const ee = this.emitters.get(world);
    if (ee) return ee;

    const newEe = this.eventEmitterFactory.create<WorldUpdateEvent>();
    this.emitters.set(world, newEe);
    return newEe;
  }

  deleteEventEmitter(world: WorldId): void {
    this.emitters.delete(world);
  }
}
