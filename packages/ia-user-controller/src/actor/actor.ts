import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import {
  ActorCreateUC,
  ActorEvent,
  UpdateActorUC,
} from "@curtain-call/uc-actor";
import {
  CollisionEvent,
  CollisionShape,
  CollisionGroup,
  CollisionModifyUC,
  CollisionManipulationUC,
} from "@curtain-call/uc-collision";
import { injectTokens } from "../inject-tokens";

export type ActorInstanceEvent = ActorEvent & CollisionEvent;

const eventNameMapping = {
  preUpdate: "actor",
  updated: "actor",
  postUpdate: "actor",
  overlap: "collision",
} as const;

export interface ActorIdGenerator {
  generateId(): ActorId;
}

@injectable()
export class Actor {
  constructor(
    @inject(injectTokens.ActorCreateUC)
    private readonly actorCreateUC: ActorCreateUC,
    @inject(injectTokens.UpdateActorUC)
    private readonly updateActorUC: UpdateActorUC,
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

  on<V extends string & keyof ActorInstanceEvent>(
    name: V,
    cb: (...args: ActorInstanceEvent[V]) => void
  ): this {
    // Bad typing
    if (eventNameMapping[name] === "collision") {
      const name2 = name as "overlap";
      const cb2 = cb as (...args: ActorInstanceEvent["overlap"]) => void;
      this.collisionManipulationUC.addEventListener(this.id, name2, cb2);
    } else if (eventNameMapping[name] === "actor") {
      const name2 = name as "updated";
      const cb2 = cb as (...args: ActorInstanceEvent["updated"]) => void;
      this.updateActorUC.addEventListener(this.id, name2, cb2);
    }
    return this;
  }

  off<V extends keyof ActorInstanceEvent>(
    name: V,
    cb: (...args: ActorInstanceEvent[V]) => void
  ): this {
    if (eventNameMapping[name] === "collision") {
      const name2 = name as "overlap";
      const cb2 = cb as (...args: ActorInstanceEvent["overlap"]) => void;
      this.collisionManipulationUC.removeEventListener(this.id, name2, cb2);
    } else if (eventNameMapping[name] === "actor") {
      const name2 = name as "updated";
      const cb2 = cb as (...args: ActorInstanceEvent["updated"]) => void;
      this.updateActorUC.removeEventListener(this.id, name2, cb2);
    }
    return this;
  }

  destroySelf(): void {
    this.actorCreateUC.destroyActor(this.id);
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
