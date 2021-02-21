import {
  injectable,
  inject,
  EventEmitter,
  EventEmitterFactory,
} from "@curtain-call/shared-dependencies";
import { ActorId } from "@curtain-call/entity";
import { ActorEvent } from "@curtain-call/uc-actor";
import { CollisionState, CollisionEvent } from "@curtain-call/uc-collision";
import { DrawingObjectState } from "@curtain-call/uc-rendering";
import { injectTokens } from "./inject-tokens";

export type ActorAllEvent = ActorEvent & CollisionEvent;

export type ActorAllState = {
  eventEmitter: EventEmitter<ActorEvent & CollisionEvent>;
  collision: Omit<CollisionState, "eventEmitter">;
  drawingObject: DrawingObjectState;
};

@injectable()
export class ActorAllStorage {
  private readonly storage = new Map<ActorId, ActorAllState>();

  constructor(
    @inject(injectTokens.EventEmitterFactory)
    private readonly eventEmitterFactory: EventEmitterFactory
  ) {}

  create(actor: ActorId): void {
    if (this.storage.has(actor)) throw new Error("Actor is already created");
    const state: ActorAllState = {
      eventEmitter: this.eventEmitterFactory.create<ActorAllEvent>(),
      collision: {
        shapes: [],
        enable: true,
        group: { category: 0, mask: 0 },
        isExcess: false,
      },
      drawingObject: {
        sprites: [],
        visible: true,
      },
    };
    this.storage.set(actor, state);
  }

  delete(actor: ActorId): void {
    if (!this.storage.has(actor)) throw new Error("Actor is not created");
    this.storage.delete(actor);
  }

  has(actor: ActorId): boolean {
    return this.storage.has(actor);
  }

  get(actor: ActorId): ActorAllState {
    const state = this.storage.get(actor);
    if (!state) throw new Error("Actor is not created");
    return state;
  }
}
