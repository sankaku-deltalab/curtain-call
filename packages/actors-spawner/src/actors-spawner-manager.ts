import {
  IActor,
  World,
  EventEmitter as IEventEmitter,
  ActorExtensionBase,
} from "@curtain-call/actor";
import EventEmitter from "eventemitter3";
import { ActorsSpawner } from "./actors-spawner";

type ActorsSpawnerManagerEvent = IEventEmitter<{
  allSpawnersWereFinished: [World];
  pauseCompleted: [World];
}>;

/**
 * ActorsSpawnerManager start ActorsSpawner as parallel.
 *
 * @example
 * const asm = new ActorsSpawnerManager()
 *   .setActiveSpawnersLimit(2)
 *   .setSpawnDelay(0.2)
 *   .setSpawnIntervalMin(1)
 *   .setActorGenerator((spawner, index) => new Actor()) // optional
 *   .setSpawners(spawners)
 *   .start(world);
 * const actor = new Actor().addExtension(asm);
 * world.addActor(actor);
 */
export class ActorsSpawnerManager extends ActorExtensionBase {
  /** Events. */
  public readonly event: ActorsSpawnerManagerEvent = new EventEmitter<{
    allSpawnersWereFinished: [World];
    pauseCompleted: [World];
  }>();

  private activeSpawnersLimit = 1;
  private spawnDelay = 0;
  private spawnIntervalMin = 0;
  private activeSpawners = new Set<ActorsSpawner>();
  private deactivatingSpawners = new Map<ActorsSpawner, number>();
  private spawners: readonly IActor[] = [];
  private lastSpawnedTimeSec = Number.NEGATIVE_INFINITY;
  private elapsedSec = 0;
  private isStarted = false;
  private isPaused = false;
  private startedCount = 0;
  private allSpawnersWereFinished = false;

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(): boolean {
    return this.allSpawnersWereFinished;
  }

  setActiveSpawnersLimit(limit: number): this {
    this.activeSpawnersLimit = limit;
    return this;
  }

  setSpawnDelay(delay: number): this {
    this.spawnDelay = delay;
    return this;
  }

  setSpawnIntervalMin(intervalMinSec: number): this {
    this.spawnIntervalMin = intervalMinSec;
    return this;
  }

  /**
   * Set spawners.
   *
   * @param spawners Actors contain ActorsSpawner extension.
   * @returns this.
   */
  setSpawners(spawners: readonly IActor[]): this {
    this.spawners = spawners;
    return this;
  }

  /**
   * Start spawning.
   *
   * @param world World.
   */
  start(world: World): this {
    this.isStarted = true;
    this.isPaused = false;
    this.progress(world, 0);
    return this;
  }

  /**
   * Pause spawning.
   *
   * @param world World.
   */
  pause(world: World): this {
    this.isPaused = true;
    if (this.activeSpawners.size === 0) {
      this.event.emit("pauseCompleted", world);
    }
    return this;
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param actor Actor.
   * @param deltaSec Delta seconds.
   */
  update(world: World, actor: IActor, deltaSec: number): void {
    if (this.isActive()) this.progress(world, deltaSec);
  }

  private progress(world: World, deltaSec: number): void {
    this.deactivatingSpawners.forEach((remain, spawner) => {
      const newRemain = remain - deltaSec;
      if (newRemain <= 0) {
        this.deactivatingSpawners.delete(spawner);
        return;
      }
      this.deactivatingSpawners.set(spawner, newRemain);
    });

    this.elapsedSec += deltaSec;

    while (
      this.startedCount < this.spawners.length &&
      this.activeSpawners.size + this.deactivatingSpawners.size <
        this.activeSpawnersLimit &&
      this.elapsedSec >= this.lastSpawnedTimeSec + this.spawnIntervalMin
    ) {
      const spawnerActor = this.spawners[this.startedCount];
      const spawner = spawnerActor.getOneExtension(
        ActorsSpawner.isActorsSpawner
      );
      if (!spawner) throw new Error("Actor don't have ActorsSpawner");
      this.setupSpawner(spawner);
      world.addActor(spawnerActor);
      spawner.start(world);

      this.startedCount += 1;
      this.activeSpawners.add(spawner);
      this.lastSpawnedTimeSec = this.elapsedSec;
    }
  }

  private setupSpawner(spawner: ActorsSpawner): void {
    spawner.event.on("allActorsWereRemoved", (world) => {
      if (this.spawnDelay > 0) {
        this.deactivatingSpawners.set(spawner, this.spawnDelay);
      }
      this.activeSpawners.delete(spawner);
      if (this.isPaused && this.activeSpawners.size === 0) {
        this.event.emit("pauseCompleted", world);
      }
      if (
        this.startedCount == this.spawners.length &&
        this.activeSpawners.size === 0
      ) {
        this.event.emit("allSpawnersWereFinished", world);
        this.allSpawnersWereFinished = true;
      }
    });
  }

  private isActive(): boolean {
    return this.isStarted && !this.isPaused;
  }
}
