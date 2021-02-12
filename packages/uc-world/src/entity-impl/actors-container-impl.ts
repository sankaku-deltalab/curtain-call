import { injectable } from "@curtain-call/shared-dependencies";
import { ActorId, WorldId, ActorsContainer } from "@curtain-call/entity";

@injectable()
export class ActorsContainerImpl implements ActorsContainer {
  private readonly stageSet = new Map<WorldId, Set<ActorId>>();
  private readonly activeSet = new Map<WorldId, Set<ActorId>>();

  stage(world: WorldId, actor: ActorId): void {
    const set = this.getActorSetFromStage(world);
    set.add(actor);
  }

  /**
   * 1. Move actors to "active" set from "stage" set.
   * 2. Remove actors if should remove it.
   * 3. Destroy removed actors if should destroy it.
   */
  refresh(world: WorldId): void {
    const staged = this.getActorSetFromStage(world);
    const storage = this.getActorSetFromActive(world);
    staged.forEach((ac) => storage.add(ac));
    staged.clear();
  }

  getActiveActors(world: WorldId): ReadonlySet<ActorId> {
    return this.getActorSetFromActive(world);
  }

  private getActorSetFromStage(worldId: WorldId): Set<ActorId> {
    const set = this.stageSet.get(worldId);
    if (set) return set;

    const newSet = new Set<ActorId>();
    this.stageSet.set(worldId, newSet);
    return newSet;
  }

  private getActorSetFromActive(worldId: WorldId): Set<ActorId> {
    const set = this.activeSet.get(worldId);
    if (set) return set;

    const newSet = new Set<ActorId>();
    this.activeSet.set(worldId, newSet);
    return newSet;
  }
}
