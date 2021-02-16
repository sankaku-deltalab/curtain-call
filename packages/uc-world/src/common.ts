import { ActorId, WorldId } from "@curtain-call/entity";

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
