import { injectable, inject } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId } from "@curtain-call/entity";
import { injectTokens } from "./inject-tokens";

export interface ActorDestroyingRequester {
  requestDestroy(actor: ActorId): void;
}

@injectable()
export class ActorToWorldMapping {
  private readonly stageSet = new Map<WorldId, Set<ActorId>>();
  private readonly activeSet = new Map<WorldId, Set<ActorId>>();
  private readonly removingSet = new Map<WorldId, Set<ActorId>>();
  private readonly actorToWorld = new Map<ActorId, WorldId>();

  constructor(
    @inject(injectTokens.ActorDestroyingRequester)
    private readonly actorDestroyingRequester: ActorDestroyingRequester,
    @inject(injectTokens.ActorDestroyingEnablerForWorld)
    private readonly actorDestroyingEnablerForWorld: ActorDestroyingEnablerForWorld
  ) {}

  stage(world: WorldId, actor: ActorId): void {
    const set = this.getActorSetFromStage(world);
    set.add(actor);
    this.actorToWorld.set(world, actor);
  }

  /**
   * 1. Move actors to "active" set from "stage" set.
   * 2. Remove actors if should remove it.
   * 3. Destroy removed actors if should destroy it.
   */
  refresh(world: WorldId): void {
    // Move actors to "active" set from "stage" set.
    const staged = this.getActorSetFromStage(world);
    const actives = this.getActorSetFromActive(world);
    staged.forEach((ac) => actives.add(ac));
    staged.clear();

    // Remove actors if should remove it.
    const removing = this.getActorSetFromRemoving(world);
    removing.forEach((actor) => {
      actives.delete(actor);
      this.actorToWorld.delete(actor);
    });
    removing.forEach((actor) => {
      const shouldDestroy = this.actorDestroyingEnablerForWorld.actorShouldDestroyWhenRemovedFromWorld(
        actor
      );
      if (shouldDestroy) this.actorDestroyingRequester.requestDestroy(actor);
    });
    removing.clear();
  }

  getActiveActors(world: WorldId): ReadonlySet<ActorId> {
    return this.getActorSetFromActive(world);
  }

  remove(world: WorldId, actor: ActorId): void {
    this.getActorSetFromRemoving(world).add(actor);
  }

  private getActorSetFromStage(worldId: WorldId): Set<ActorId> {
    return this.getActorSetFromGivenMap(this.stageSet, worldId);
  }

  private getActorSetFromActive(worldId: WorldId): Set<ActorId> {
    return this.getActorSetFromGivenMap(this.activeSet, worldId);
  }

  private getActorSetFromRemoving(worldId: WorldId): Set<ActorId> {
    return this.getActorSetFromGivenMap(this.removingSet, worldId);
  }

  private getActorSetFromGivenMap(
    worldActors: Map<WorldId, Set<ActorId>>,
    worldId: WorldId
  ): Set<ActorId> {
    const set = worldActors.get(worldId);
    if (set) return set;

    const newSet = new Set<ActorId>();
    worldActors.set(worldId, newSet);
    return newSet;
  }
}

@injectable()
export class ActorDestroyingEnablerForWorld {
  private readonly actorsDoNotDestroy = new Set<ActorId>();

  protectActorFromDestroyingWhenRemovedFromWorld(actor: ActorId): void {
    this.actorsDoNotDestroy.add(actor);
  }

  actorShouldDestroyWhenRemovedFromWorld(actor: ActorId): boolean {
    return !this.actorsDoNotDestroy.has(actor);
  }
}
