import { inject, autoInjectable, container as diContainer } from "tsyringe";
import {
  Actor,
  World,
  Transformation,
  EventEmitter as IEventEmitter,
  DamageType,
  FiniteResource,
  Collision,
} from "@curtain-call/actor";
import EventEmitter from "eventemitter3";
import { ActorsSpawner } from "./actors-spawner";

export { diContainer };

type ActorsSpawnerManagerEvent = IEventEmitter<{
  // world
  addedToWorld: [World];
  removedFromWorld: [World];
  updated: [World, number];
  // collision
  overlapped: [World, Set<Actor>];
  // health
  takenDamage: [World, number, Actor, DamageType];
  dead: [World, Actor, DamageType];
  beHealed: [World, number];
  // damage dealer
  dealDamage: [World, number, Actor, DamageType];
  killed: [World, Actor, DamageType];
  // spawner
  allSpawnersWereFinished: [World];
  pauseCompleted: [World];
}>;

@autoInjectable()
export class ActorsSpawnerManager extends Actor {
  /** Events. */
  public readonly event: ActorsSpawnerManagerEvent = new EventEmitter<{
    // world
    addedToWorld: [World];
    removedFromWorld: [World];
    updated: [World, number];
    // collision
    overlapped: [World, Set<Actor>];
    // health
    takenDamage: [World, number, Actor, DamageType];
    dead: [World, Actor, DamageType];
    beHealed: [World, number];
    // damage dealer
    dealDamage: [World, number, Actor, DamageType];
    killed: [World, Actor, DamageType];
    // spawner
    allSpawnersWereFinished: [World];
    pauseCompleted: [World];
  }>();

  private activeSpawnersLimit = 1;
  private spawnDelay = 0;
  private spawnIntervalMin = 0;
  private activeSpawners = new Set<ActorsSpawner>();
  private deactivatingSpawners = new Map<ActorsSpawner, number>();
  private spawners: readonly ActorsSpawner[] = [];
  private lastSpawnedTimeSec = Number.NEGATIVE_INFINITY;
  private elapsedSec = 0;
  private isStarted = false;
  private isPaused = false;
  private startedCount = 0;

  constructor(
    @inject("EventEmitter") event?: ActorsSpawnerManagerEvent,
    @inject("Transformation") trans?: Transformation,
    @inject("FiniteResource") health?: FiniteResource,
    @inject("Collision") collision?: Collision
  ) {
    super(event, trans, health, collision);
    if (!event) throw new Error("DI failed");
    this.event = event;
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

  setSpawners(spawners: readonly ActorsSpawner[]): this {
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
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
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
      const spawner = this.spawners[this.startedCount];
      this.setupSpawner(spawner);
      world.addActor(spawner);
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
      }
    });
  }

  private isActive(): boolean {
    return this.isStarted && !this.isPaused;
  }
}
