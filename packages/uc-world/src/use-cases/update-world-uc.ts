import {
  injectable,
  inject,
  EventEmitter,
} from "@curtain-call/shared-dependencies";
import { WorldId, WorldCore, Seconds } from "@curtain-call/entity";
import { injectTokens } from "../inject-tokens";

export type WorldUpdateEvent = {
  preUpdate: [Seconds];
  updated: [Seconds];
  postUpdate: [Seconds];
};

export interface WorldUpdateEventEmitterStorage {
  getEventEmitter(world: WorldId): EventEmitter<WorldUpdateEvent>;
  deleteEventEmitter(world: WorldId): void;
}

@injectable()
export class UpdateWorldUC {
  constructor(
    @inject(injectTokens.WorldCore)
    private readonly worldCore: WorldCore,
    @inject(injectTokens.WorldUpdateEventEmitterStorage)
    private readonly worldUpdateEventEmitterStorage: WorldUpdateEventEmitterStorage
  ) {}

  updateWorld(world: WorldId, deltaSec: Seconds): void {
    this.worldCore.update(world, deltaSec);
  }

  emitPreUpdateEvent(world: WorldId, deltaSec: Seconds): void {
    this.worldUpdateEventEmitterStorage
      .getEventEmitter(world)
      .emit("preUpdate", deltaSec);
  }

  emitUpdateEvent(world: WorldId, deltaSec: Seconds): void {
    this.worldUpdateEventEmitterStorage
      .getEventEmitter(world)
      .emit("updated", deltaSec);
  }

  emitPostUpdateEvent(world: WorldId, deltaSec: Seconds): void {
    this.worldUpdateEventEmitterStorage
      .getEventEmitter(world)
      .emit("postUpdate", deltaSec);
  }

  addEventListener<V extends keyof WorldUpdateEvent>(
    world: WorldId,
    name: V,
    cb: (...args: WorldUpdateEvent[V]) => void
  ): void {
    this.worldUpdateEventEmitterStorage.getEventEmitter(world).on(name, cb);
  }

  removeEventListener<V extends keyof WorldUpdateEvent>(
    world: WorldId,
    name: V,
    cb: (...args: WorldUpdateEvent[V]) => void
  ): void {
    this.worldUpdateEventEmitterStorage.getEventEmitter(world).off(name, cb);
  }
}
