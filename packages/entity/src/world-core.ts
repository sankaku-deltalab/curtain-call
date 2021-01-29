import { inject, injectable } from "@curtain-call/shared-dependencies";
import { InjectTokens } from "./inject-tokens";

export type WorldId = symbol;
export type ActorId = symbol;
export type Seconds = number;

export interface ActorsContainer {
  stage(world: WorldId, actor: ActorId): void;
  /**
   * 1. Move actors to "active" set from "stage" set.
   * 2. Remove actors if should remove it.
   * 3. Destroy removed actors if should destroy it.
   */
  refresh(world: WorldId): void;
  getActiveActors(world: WorldId): ReadonlySet<ActorId>;
}

export interface WorldsTimeScale {
  calcTimeScale(world: WorldId): number;
  update(world: WorldId, deltaSec: Seconds): void;
}

export interface ActorsTimeScale {
  calcTimeScale(actors: ActorId[]): Map<ActorId, number>;
  update(actors: readonly ActorId[], deltaSec: Seconds): void;
}

export interface ActorsMover {
  update(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
}

export interface ActorsOverlapChecker {
  checkOverlap(actors: readonly ActorId[]): void;
}

export interface Renderer {
  update(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
  render(world: WorldId, actors: readonly ActorId[]): void;
}

export interface WorldsTimerUpdater {
  updateTime(world: WorldId, deltaSec: number): void;
  executeTimersIfTimeWasFilled(world: WorldId): void;
}

export interface ActorsTimerUpdater {
  updateTime(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
  executeTimersIfTimeWasFilled(actors: readonly ActorId[]): void;
}

export interface WorldsExtensionUpdater {
  notifyPreUpdate(world: WorldId, deltaSec: Seconds): void;
  update(world: WorldId, deltaSec: Seconds): void;
  notifyPostUpdate(world: WorldId, deltaSec: Seconds): void;
}

export interface ActorsExtensionUpdater {
  notifyPreUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
  update(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
  notifyPostUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
}

/**
 * `WorldCore` is "synchronizer" of actors.
 *
 * `WorldCore`
 *
 * - contains actors.
 * - be updated from engine.
 * - updates contained actors.
 * - update contained timers.
 * - update world extensions.
 * - check actors overlap.
 * - render actors.
 */
@injectable()
export class WorldCore {
  constructor(
    @inject(InjectTokens.WorldsTimeScale)
    private readonly worldsTimeScale: WorldsTimeScale,
    @inject(InjectTokens.ActorsContainer)
    private readonly actorsContainer: ActorsContainer,
    @inject(InjectTokens.ActorsTimeScale)
    private readonly actorsTimeScale: ActorsTimeScale,
    @inject(InjectTokens.ActorsMover)
    private readonly actorsMover: ActorsMover,
    @inject(InjectTokens.ActorsOverlapChecker)
    private readonly actorsOverlapChecker: ActorsOverlapChecker,
    @inject(InjectTokens.Renderer)
    private readonly renderer: Renderer,
    @inject(InjectTokens.WorldsExtensionUpdater)
    private readonly worldsExtensionUpdater: WorldsExtensionUpdater,
    @inject(InjectTokens.ActorsExtensionUpdater)
    private readonly actorsExtensionUpdater: ActorsExtensionUpdater,
    @inject(InjectTokens.WorldsTimerUpdater)
    private readonly worldsTimerUpdater: WorldsTimerUpdater,
    @inject(InjectTokens.ActorsTimerUpdater)
    private readonly actorsTimerUpdater: ActorsTimerUpdater
  ) {}

  update(world: WorldId, deltaSec: Seconds): void {
    this.actorsContainer.refresh(world);

    const actorIds = Array.from(this.actorsContainer.getActiveActors(world));
    const { worldDeltaSec, actorsDeltaSec } = this.calcDeltaTimes(
      world,
      actorIds,
      deltaSec
    );

    this.executeTimersIfTimeWasFilled(world, actorIds);

    this.notifyPreUpdateToExtensions(
      world,
      actorIds,
      worldDeltaSec,
      actorsDeltaSec
    );

    this.actorsMover.update(actorIds, actorsDeltaSec);
    this.actorsOverlapChecker.checkOverlap(actorIds);
    this.renderer.update(actorIds, actorsDeltaSec);

    this.updateExtensions(world, actorIds, worldDeltaSec, actorsDeltaSec);

    this.notifyPostUpdateToExtensions(
      world,
      actorIds,
      worldDeltaSec,
      actorsDeltaSec
    );

    this.updateTimers(world, actorIds, worldDeltaSec, actorsDeltaSec);

    this.worldsTimeScale.update(world, deltaSec);

    this.renderer.render(world, actorIds);
  }

  private calcDeltaTimes(
    world: WorldId,
    actors: ActorId[],
    originalDeltaSec: Seconds
  ): { worldDeltaSec: Seconds; actorsDeltaSec: Map<ActorId, Seconds> } {
    const worldScale = this.worldsTimeScale.calcTimeScale(world);
    const timeScales = this.actorsTimeScale.calcTimeScale(actors);
    const ts: [ActorId, Seconds][] = Array.from(
      timeScales
    ).map(([id, scale]) => [id, scale * worldScale * originalDeltaSec]);
    return {
      worldDeltaSec: worldScale * originalDeltaSec,
      actorsDeltaSec: new Map(ts),
    };
  }

  private executeTimersIfTimeWasFilled(
    world: WorldId,
    actors: readonly ActorId[]
  ): void {
    this.worldsTimerUpdater.executeTimersIfTimeWasFilled(world);
    this.actorsTimerUpdater.executeTimersIfTimeWasFilled(actors);
  }

  private notifyPreUpdateToExtensions(
    world: WorldId,
    actors: readonly ActorId[],
    worldDeltaSec: Seconds,
    actorsDeltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    this.worldsExtensionUpdater.notifyPreUpdate(world, worldDeltaSec);
    this.actorsExtensionUpdater.notifyPreUpdate(actors, actorsDeltaSec);
  }

  private updateExtensions(
    world: WorldId,
    actors: readonly ActorId[],
    worldDeltaSec: Seconds,
    actorsDeltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    this.worldsExtensionUpdater.update(world, worldDeltaSec);
    this.actorsExtensionUpdater.update(actors, actorsDeltaSec);
  }

  private notifyPostUpdateToExtensions(
    world: WorldId,
    actors: readonly ActorId[],
    worldDeltaSec: Seconds,
    actorsDeltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    this.worldsExtensionUpdater.notifyPreUpdate(world, worldDeltaSec);
    this.actorsExtensionUpdater.notifyPreUpdate(actors, actorsDeltaSec);
  }

  private updateTimers(
    world: WorldId,
    actors: readonly ActorId[],
    worldDeltaSec: Seconds,
    actorsDeltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    this.worldsTimerUpdater.updateTime(world, worldDeltaSec);
    this.actorsTimerUpdater.updateTime(actors, actorsDeltaSec);
  }
}
