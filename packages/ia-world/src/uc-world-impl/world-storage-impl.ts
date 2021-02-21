import {
  injectable,
  inject,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { WorldStorage, WorldState, WorldEvent } from "@curtain-call/uc-world";
import { injectTokens } from "../inject-tokens";

@injectable()
export class WorldStorageImpl implements WorldStorage {
  private readonly storage = new Map<WorldId, WorldState>();

  constructor(
    @inject(injectTokens.EventEmitterFactory)
    private readonly eventEmitterFactory: EventEmitterFactory
  ) {}

  addWorld(world: WorldId): void {
    if (this.storage.has(world)) throw new Error("World was already added");
    const state: WorldState = {
      eventEmitter: this.eventEmitterFactory.create<WorldEvent>(),
    };
    this.storage.set(world, state);
  }

  removeWorld(world: WorldId): void {
    if (!this.storage.has(world)) throw new Error("World is not added");
    this.storage.delete(world);
  }

  hasWorld(world: WorldId): boolean {
    return this.storage.has(world);
  }

  getWorld(world: WorldId): Readonly<WorldState> {
    const state = this.storage.get(world);
    if (!state) throw new Error("World is not added");
    return state;
  }
}
