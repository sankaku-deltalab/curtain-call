import { PredefinedPromise } from "predefined-promise";
import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { CollisionStorage, CollisionEvent } from "../common";
import { injectTokens } from "../inject-token";

/**
 * User use collision for game sequence.
 */
@injectable()
export class CollisionManipulationUC {
  constructor(
    @inject(injectTokens.CollisionStorage)
    private readonly collisionStorage: CollisionStorage
  ) {}

  addEventListener<V extends keyof CollisionEvent>(
    actorId: ActorId,
    name: V,
    cb: (...args: CollisionEvent[V]) => void
  ): void {
    this.collisionStorage.getCollision(actorId).eventEmitter.on(name, cb);
  }

  removeEventListener<V extends keyof CollisionEvent>(
    actorId: ActorId,
    name: V,
    cb: (...args: CollisionEvent[V]) => void
  ): void {
    this.collisionStorage.getCollision(actorId).eventEmitter.off(name, cb);
  }

  waitOverlap(
    actorId: ActorId,
    option: { signal: AbortSignal }
  ): Promise<readonly ActorId[]> {
    const pp = new PredefinedPromise<readonly ActorId[]>();
    const ee = this.collisionStorage.getCollision(actorId).eventEmitter;

    const overlapEvent = (others: readonly ActorId[]): void => {
      pp.resolve(others);
    };

    const abortEvent = (): void => {
      pp.reject(new Error("Aborted"));
    };

    ee.on("overlap", overlapEvent);
    option.signal.addEventListener("abort", abortEvent);

    return pp.wait().finally(() => {
      ee.off("overlap", overlapEvent);
      option.signal.removeEventListener("abort", abortEvent);
    });
  }
}
