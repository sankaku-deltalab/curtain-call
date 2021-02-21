import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId } from "@curtain-call/entity";
import {
  ActorAddingToWorldUC,
  UpdateWorldUC,
  WorldEvent,
} from "@curtain-call/uc-world";
import { injectTokens } from "../inject-tokens";

const eventNameMapping = {
  preUpdate: "worldUpdateEvent",
  updated: "worldUpdateEvent",
  postUpdate: "worldUpdateEvent",
} as const;

@injectable()
export class World {
  constructor(
    @inject(injectTokens.ActorAddingToWorldUC)
    private readonly actorAddingToWorldUC: ActorAddingToWorldUC,
    @inject(injectTokens.UpdateWorldUC)
    private readonly updateWorldUC: UpdateWorldUC
  ) {}

  private idMaybeNotSet?: WorldId;

  get id(): WorldId {
    if (this.idMaybeNotSet === undefined) throw new Error("Id not set");
    return this.idMaybeNotSet;
  }

  setId(id: WorldId): this {
    this.idMaybeNotSet = id;
    return this;
  }

  // mixed

  on<V extends keyof WorldEvent>(
    name: V,
    cb: (...args: WorldEvent[V]) => void
  ): this {
    if (eventNameMapping[name] === "worldUpdateEvent") {
      this.updateWorldUC.addEventListener(this.id, name, cb);
    }
    return this;
  }

  off<V extends keyof WorldEvent>(
    name: V,
    cb: (...args: WorldEvent[V]) => void
  ): this {
    if (eventNameMapping[name] === "worldUpdateEvent") {
      this.updateWorldUC.removeEventListener(this.id, name, cb);
    }
    return this;
  }

  // actor

  addActor(actor: ActorId): void {
    this.actorAddingToWorldUC.addActorToWorld(this.id, actor);
  }
}
