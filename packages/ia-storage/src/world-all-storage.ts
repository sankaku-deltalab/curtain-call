import {
  injectable,
  inject,
  EventEmitter,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { WorldId } from "@curtain-call/entity";
import { WorldEvent } from "@curtain-call/uc-world";
import { injectTokens } from "./inject-tokens";

export type WorldAllEvent = WorldEvent;

export type WorldAllState = {
  eventEmitter: EventEmitter<WorldEvent>;
};

@injectable()
export class WorldAllStorage {
  private readonly storage = new Map<WorldId, WorldAllState>();

  constructor(
    @inject(injectTokens.EventEmitterFactory)
    private readonly eventEmitterFworldy: EventEmitterFactory
  ) {}

  create(world: WorldId): void {
    if (this.storage.has(world)) throw new Error("World is already created");
    const state: WorldAllState = {
      eventEmitter: this.eventEmitterFworldy.create<WorldAllEvent>(),
    };
    this.storage.set(world, state);
  }

  delete(world: WorldId): void {
    const state = this.storage.get(world);
    if (!state) throw new Error("World is not created");
    state.eventEmitter.clear();
    this.storage.delete(world);
  }

  has(world: WorldId): boolean {
    return this.storage.has(world);
  }

  get(world: WorldId): Readonly<WorldAllState> {
    const state = this.storage.get(world);
    if (!state) throw new Error("World is not created");
    return state;
  }

  set(world: WorldId, state: WorldAllState): void {
    if (!this.storage.has(world)) throw new Error("World is not created");
    this.storage.set(world, state);
  }
}
