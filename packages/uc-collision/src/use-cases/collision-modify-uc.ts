import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import {
  CollisionStorage,
  CollisionState,
  EventEmitter,
  CollisionShape,
  CollisionGroup,
} from "../common";
import { injectTokens } from "../inject-tokens";

export interface EventEmitterFactory {
  create<T extends Record<string, unknown[]>>(): EventEmitter<T>;
}

/**
 * User want to modify collision.
 */
@injectable()
export class CollisionModifyUC {
  constructor(
    @inject(injectTokens.CollisionStorage)
    private readonly collisionStorage: CollisionStorage,
    @inject(injectTokens.EventEmitterFactory)
    private readonly eventEmitterFactory: EventEmitterFactory
  ) {}

  initCollision(
    actorId: ActorId,
    args: Readonly<{
      shapes: readonly CollisionShape[];
      group: CollisionGroup;
      enable: boolean;
      isExcess: boolean;
    }>
  ): void {
    const state: CollisionState = {
      shapes: args.shapes,
      group: args.group,
      enable: args.enable,
      isExcess: args.isExcess,
      eventEmitter: this.eventEmitterFactory.create(),
    };
    this.collisionStorage.addCollision(actorId, state);
  }

  setCollisionEnable(actorId: ActorId, enable: boolean): void {
    const state = this.collisionStorage.getCollision(actorId);
    this.collisionStorage.updateCollision(actorId, {
      ...state,
      enable,
    });
  }
}
