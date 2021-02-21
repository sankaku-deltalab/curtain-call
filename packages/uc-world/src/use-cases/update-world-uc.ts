import {
  injectable,
  inject,
  EventEmitter,
} from "@curtain-call/shared-dependencies";
import { WorldId, WorldCore, Seconds } from "@curtain-call/entity";
import { WorldEvent, WorldStorage, WorldUpdateEvent } from "../common";
import { injectTokens } from "../inject-tokens";

@injectable()
export class UpdateWorldUC {
  constructor(
    @inject(injectTokens.WorldCore)
    private readonly worldCore: WorldCore,
    @inject(injectTokens.WorldStorage)
    private readonly worldStorage: WorldStorage
  ) {}

  updateWorld(world: WorldId, deltaSec: Seconds): void {
    this.worldCore.update(world, deltaSec);
  }

  emitPreUpdateEvent(world: WorldId, deltaSec: Seconds): void {
    this.getEmitter(world).emit("preUpdate", deltaSec);
  }

  emitUpdateEvent(world: WorldId, deltaSec: Seconds): void {
    this.getEmitter(world).emit("updated", deltaSec);
  }

  emitPostUpdateEvent(world: WorldId, deltaSec: Seconds): void {
    this.getEmitter(world).emit("postUpdate", deltaSec);
  }

  private getEmitter(world: WorldId): EventEmitter<WorldEvent> {
    return this.worldStorage.getWorld(world).eventEmitter;
  }

  addEventListener<V extends keyof WorldUpdateEvent>(
    world: WorldId,
    name: V,
    cb: (...args: WorldUpdateEvent[V]) => void
  ): void {
    this.getEmitter(world).on(name, cb);
  }

  removeEventListener<V extends keyof WorldUpdateEvent>(
    world: WorldId,
    name: V,
    cb: (...args: WorldUpdateEvent[V]) => void
  ): void {
    this.getEmitter(world).off(name, cb);
  }
}
