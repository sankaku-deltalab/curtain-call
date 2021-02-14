import { injectable } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId } from "@curtain-call/entity";
import { ActorToWorldMapping } from "@curtain-call/uc-world";

@injectable()
export class ActorToWorldMappingImpl implements ActorToWorldMapping {
  private readonly stagedActors = new Map<WorldId, Set<ActorId>>();
  private readonly activeActors = new Map<WorldId, Set<ActorId>>();
  private readonly removingActors = new Map<WorldId, Set<ActorId>>();
  private readonly actorToWorld = new Map<ActorId, WorldId>();

  stage(world: WorldId, actor: ActorId): void {
    const set = this.getActorSetFromStage(world);
    set.add(actor);
    this.actorToWorld.set(world, actor);
  }

  getActiveActors(world: WorldId): ReadonlySet<ActorId> {
    return this.getActorSetFromActive(world);
  }

  remove(world: WorldId, actor: ActorId): void {
    this.getActorSetFromRemoving(world).add(actor);
  }

  popStagedActors(world: WorldId): Set<ActorId> {
    const actors = this.getActorSetFromStage(world);
    this.stagedActors.delete(world);
    return actors;
  }

  popActiveActors(world: WorldId): Set<ActorId> {
    const actors = this.getActorSetFromActive(world);
    this.activeActors.delete(world);
    actors.forEach((actor) => {
      this.actorToWorld.delete(actor);
    });
    return actors;
  }

  popRemovingActors(world: WorldId): Set<ActorId> {
    const actors = this.getActorSetFromRemoving(world);
    this.removingActors.delete(world);
    return actors;
  }

  setActiveActors(world: WorldId, actors: Set<ActorId>): void {
    const currentActiveActors = this.activeActors.get(world);
    if (currentActiveActors && currentActiveActors.size > 0) {
      this.popActiveActors(world);
    }

    this.activeActors.set(world, actors);
    actors.forEach((actor) => {
      this.actorToWorld.set(actor, world);
    });
  }

  getWorldContainsActor(actor: ActorId): WorldId | undefined {
    return this.actorToWorld.get(actor);
  }

  private getActorSetFromStage(worldId: WorldId): Set<ActorId> {
    return this.getActorSetFromGivenMap(this.stagedActors, worldId);
  }

  private getActorSetFromActive(worldId: WorldId): Set<ActorId> {
    return this.getActorSetFromGivenMap(this.activeActors, worldId);
  }

  private getActorSetFromRemoving(worldId: WorldId): Set<ActorId> {
    return this.getActorSetFromGivenMap(this.removingActors, worldId);
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
