import { EventEmitter } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId, Seconds } from "@curtain-call/entity";

export interface ActorDestroyingRequester {
  requestDestroy(actor: ActorId): void;
}

export interface ActorToWorldMapping {
  stage(world: WorldId, actor: ActorId): void;

  getActiveActors(world: WorldId): ReadonlySet<ActorId>;

  remove(world: WorldId, actor: ActorId): void;

  popStagedActors(world: WorldId): Set<ActorId>;
  popActiveActors(world: WorldId): Set<ActorId>;
  popRemovingActors(world: WorldId): Set<ActorId>;

  setActiveActors(world: WorldId, actors: Set<ActorId>): void;

  getWorldContainsActor(actor: ActorId): WorldId | undefined;

  removeWorld(world: WorldId): void;
}

export interface ActorDestroyingEnablerForWorld {
  actorShouldDestroyWhenRemovedFromWorld(actor: ActorId): boolean;
  protectActorFromDestroyingWhenRemovedFromWorld(actor: ActorId): void;
}

export type WorldState = {
  eventEmitter: EventEmitter<WorldEvent>;
};

export type WorldUpdateEvent = {
  preUpdate: [Seconds];
  updated: [Seconds];
  postUpdate: [Seconds];
};

export type WorldEvent = WorldUpdateEvent;

export interface WorldStorage {
  addWorld(world: WorldId): void;
  removeWorld(world: WorldId): void;
  hasWorld(world: WorldId): boolean;
  getWorld(world: WorldId): Readonly<WorldState>;
}
