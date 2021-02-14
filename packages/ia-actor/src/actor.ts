import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorBase, ActorStorage } from "@curtain-call/uc-actor";
import {
  CollisionShape,
  CollisionGroup,
  CollisionModifyUC,
  CollisionManipulationUC,
} from "@curtain-call/uc-collision";
import { injectTokens } from "./inject-tokens";

export type ActorEvent = {
  overlap: [readonly ActorId[]];
};

const eventNameMapping = {
  overlap: "collision",
} as const;

export interface ActorIdGenerator {
  generateId(): ActorId;
}

@injectable()
export class Actor implements ActorBase {
  constructor(
    @inject(injectTokens.ActorStorage)
    private readonly actorStorage: ActorStorage<Actor>,
    @inject(injectTokens.CollisionModifyUC)
    private readonly collisionModifyUC: CollisionModifyUC,
    @inject(injectTokens.CollisionManipulationUC)
    private readonly collisionManipulationUC: CollisionManipulationUC
  ) {}

  private idMaybeNotSet?: ActorId;

  get id(): ActorId {
    if (this.idMaybeNotSet === undefined) throw new Error("Id not set");
    return this.idMaybeNotSet;
  }

  setId(id: ActorId): this {
    this.idMaybeNotSet = id;
    return this;
  }

  // mixed

  on<V extends keyof ActorEvent>(
    name: V,
    cb: (...args: ActorEvent[V]) => void
  ): this {
    if (eventNameMapping[name] === "collision") {
      this.collisionManipulationUC.addEventListener(this.id, name, cb);
    }
    return this;
  }

  off<V extends keyof ActorEvent>(
    name: V,
    cb: (...args: ActorEvent[V]) => void
  ): this {
    if (eventNameMapping[name] === "collision") {
      this.collisionManipulationUC.removeEventListener(this.id, name, cb);
    }
    return this;
  }

  destroySelf(): void {
    // TODO: Remove self from world if still self in world
    // TODO: Delete collision data
  }

  // actor

  getActor(actorId: ActorId): Actor {
    return this.actorStorage.getActor(actorId);
  }

  // collision

  initCollision(
    args: Readonly<{
      shapes: readonly CollisionShape[];
      group: CollisionGroup;
      enable: boolean;
      isExcess: boolean;
    }>
  ): this {
    this.collisionModifyUC.initCollision(this.id, args);
    return this;
  }

  setCollisionEnable(enable: boolean): this {
    this.collisionModifyUC.setCollisionEnable(this.id, enable);
    return this;
  }

  waitOverlap(
    args: Readonly<{
      signal: AbortSignal;
    }>
  ): Promise<readonly ActorId[]> {
    return this.collisionManipulationUC.waitOverlap(this.id, {
      signal: args.signal,
    });
  }
}
