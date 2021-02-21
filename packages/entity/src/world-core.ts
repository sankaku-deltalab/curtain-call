import { inject, injectable } from "@curtain-call/shared-dependencies";
import { WorldId, ActorId, EngineId } from "./main-object-ids";
import { injectTokens } from "./inject-tokens";

export type Seconds = number;

export interface ActorsContainer {
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
  render(engine: EngineId, world: WorldId, actors: readonly ActorId[]): void;
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

export interface ActorsUpdateEventEmitter {
  notifyPreUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
  notifyUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
  notifyPostUpdate(
    actors: readonly ActorId[],
    deltaSec: ReadonlyMap<ActorId, Seconds>
  ): void;
}

export interface WorldsUpdateEventEmitter {
  notifyPreUpdate(world: WorldId, deltaSec: Seconds): void;
  notifyUpdate(world: WorldId, deltaSec: Seconds): void;
  notifyPostUpdate(world: WorldId, deltaSec: Seconds): void;
}

export interface InputConsumer {
  consumeInput(world: WorldId, actors: readonly ActorId[]): void;
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
    @inject(injectTokens.WorldsTimeScale)
    private readonly worldsTimeScale: WorldsTimeScale,
    @inject(injectTokens.ActorsContainer)
    private readonly actorsContainer: ActorsContainer,
    @inject(injectTokens.ActorsTimeScale)
    private readonly actorsTimeScale: ActorsTimeScale,
    @inject(injectTokens.ActorsMover)
    private readonly actorsMover: ActorsMover,
    @inject(injectTokens.ActorsOverlapChecker)
    private readonly actorsOverlapChecker: ActorsOverlapChecker,
    @inject(injectTokens.Renderer)
    private readonly renderer: Renderer,
    @inject(injectTokens.WorldsExtensionUpdater)
    private readonly worldsExtensionUpdater: WorldsExtensionUpdater,
    @inject(injectTokens.ActorsExtensionUpdater)
    private readonly actorsExtensionUpdater: ActorsExtensionUpdater,
    @inject(injectTokens.WorldsTimerUpdater)
    private readonly worldsTimerUpdater: WorldsTimerUpdater,
    @inject(injectTokens.ActorsTimerUpdater)
    private readonly actorsTimerUpdater: ActorsTimerUpdater,
    @inject(injectTokens.InputConsumer)
    private readonly inputConsumer: InputConsumer,
    @inject(injectTokens.WorldsUpdateEventEmitter)
    private readonly worldsUpdateEventEmitter: WorldsUpdateEventEmitter,
    @inject(injectTokens.ActorsUpdateEventEmitter)
    private readonly actorsUpdateEventEmitter: ActorsUpdateEventEmitter
  ) {}

  update(engine: EngineId, world: WorldId, deltaSec: Seconds): void {
    this.actorsContainer.refresh(world);

    const actorIds = Array.from(this.actorsContainer.getActiveActors(world));

    this.inputConsumer.consumeInput(world, actorIds);

    const { worldDeltaSec, actorsDeltaSec } = this.calcDeltaTimes(
      world,
      actorIds,
      deltaSec
    );

    this.executeTimersIfTimeWasFilled(world, actorIds);

    this.notifyPreUpdating(world, actorIds, worldDeltaSec, actorsDeltaSec);

    this.actorsMover.update(actorIds, actorsDeltaSec);
    this.actorsOverlapChecker.checkOverlap(actorIds);
    this.renderer.update(actorIds, actorsDeltaSec);

    this.updateExtensions(world, actorIds, worldDeltaSec, actorsDeltaSec);
    this.actorsUpdateEventEmitter.notifyUpdate(actorIds, actorsDeltaSec);

    this.notifyPostUpdating(world, actorIds, worldDeltaSec, actorsDeltaSec);

    this.updateTimers(world, actorIds, worldDeltaSec, actorsDeltaSec);

    this.worldsTimeScale.update(world, deltaSec);

    this.renderer.render(engine, world, actorIds);
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

  private notifyPreUpdating(
    world: WorldId,
    actors: readonly ActorId[],
    worldDeltaSec: Seconds,
    actorsDeltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    this.worldsExtensionUpdater.notifyPreUpdate(world, worldDeltaSec);
    this.worldsUpdateEventEmitter.notifyPreUpdate(world, worldDeltaSec);
    this.actorsExtensionUpdater.notifyPreUpdate(actors, actorsDeltaSec);
    this.actorsUpdateEventEmitter.notifyPreUpdate(actors, actorsDeltaSec);
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

  private notifyPostUpdating(
    world: WorldId,
    actors: readonly ActorId[],
    worldDeltaSec: Seconds,
    actorsDeltaSec: ReadonlyMap<ActorId, Seconds>
  ): void {
    this.worldsExtensionUpdater.notifyPostUpdate(world, worldDeltaSec);
    this.worldsUpdateEventEmitter.notifyPostUpdate(world, worldDeltaSec);
    this.actorsExtensionUpdater.notifyPostUpdate(actors, actorsDeltaSec);
    this.actorsUpdateEventEmitter.notifyPostUpdate(actors, actorsDeltaSec);
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
