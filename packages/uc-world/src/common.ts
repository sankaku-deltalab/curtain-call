import { ActorId, WorldId } from "@curtain-call/entity";

export interface ActorDestroyingRequester {
  requestDestroy(actor: ActorId): void;
}

export interface ActorToWorldMapping {
  stage(world: WorldId, actor: ActorId): void;
  /**
   * 1. Move actors to "active" set from "stage" set.
   * 2. Remove actors if should remove it.
   * 3. Destroy removed actors if should destroy it.
   */
  refresh(world: WorldId): void;

  getActiveActors(world: WorldId): ReadonlySet<ActorId>;

  remove(world: WorldId, actor: ActorId): void;

  popStagedActors(world: WorldId): Set<ActorId>;
  popActiveActors(world: WorldId): Set<ActorId>;
  popRemovingActors(world: WorldId): Set<ActorId>;

  setActiveActors(world: WorldId, actors: Set<ActorId>): void;

  getWorldContainsActor(actor: ActorId): WorldId | undefined;
}

export interface ActorDestroyingEnablerForWorld {
  actorShouldDestroyWhenRemovedFromWorld(actor: ActorId): boolean;
  protectActorFromDestroyingWhenRemovedFromWorld(actor: ActorId): void;
}
