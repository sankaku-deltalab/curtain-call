import { Matrix } from "trans-vector2d";
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

export { diContainer };

type ActorsSpawnerEvent = IEventEmitter<{
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
  allActorsWereDead: [World, readonly Actor[]];
  allActorsWereRemoved: [World, readonly Actor[]];
}>;

/**
 * ActorsSpawner spawn multiple actors.
 *
 * @example
 * import { Matrix } from "trans-vector2d";
 * import { Actor } from "@curtain-call/actor";
 * import { World } from "@curtain-call/world";
 *
 * const spawner = new ActorsSpawner()
 *   .setSpawningFunction(() => new Actor())
 *   .setSchedule([
 *     [Matrix.identity, 0],
 *     [Matrix.translation({ x: 1, y: 2 }), 0.5],
 *   ]);
 *
 * const world = new World();
 * world.addActor(spawner);
 * world.update(0.125);
 */
@autoInjectable()
export class ActorsSpawner extends Actor {
  /** Events. */
  public readonly event: ActorsSpawnerEvent = new EventEmitter<{
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
    allActorsWereDead: [World, readonly Actor[]];
    allActorsWereRemoved: [World, readonly Actor[]];
  }>();

  private spawningFunction: (
    spawnedCount: number,
    spawnNum: number
  ) => Actor = (): Actor => new Actor();
  private schedule: readonly [Matrix, number][] = [];
  private isActive = false;
  private spawnedCount = 0;
  private elapsedSec = 0;
  private readonly deadActors = new Set<Actor>();
  private readonly removedActors = new Set<Actor>();

  constructor(
    @inject("EventEmitter") event?: ActorsSpawnerEvent,
    @inject("Transformation") trans?: Transformation,
    @inject("FiniteResource") health?: FiniteResource,
    @inject("Collision") collision?: Collision
  ) {
    super(event, trans, health, collision);
    if (!event) throw new Error("DI failed");
    this.event = event;
  }

  /**
   * Set actor spawning function.
   *
   * @param func Actor spawning function.
   * @returns this.
   */
  setSpawningFunction(func: () => Actor): this {
    this.spawningFunction = func;
    return this;
  }

  /**
   * Set spawning schedule.
   *
   * @param schedule Spawning schedule.
   * @returns this.
   */
  setSchedule(schedule: readonly [Matrix, number][]): this {
    this.schedule = schedule;
    return this;
  }

  /**
   * Start spawning.
   *
   * @param world World.
   */
  start(world: World): this {
    this.isActive = true;
    this.progress(world, 0);
    return this;
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    if (this.isActive) this.progress(world, deltaSec);
  }

  private progress(world: World, deltaSec: number): void {
    this.elapsedSec += deltaSec;
    while (
      this.spawnedCount < this.schedule.length &&
      this.elapsedSec >= this.schedule[this.spawnedCount][1]
    ) {
      const actor = this.spawnActor(this.spawnedCount, this.schedule.length);
      actor.setLocalTransform(this.schedule[this.spawnedCount][0]);
      this.spawnedCount += 1;
      world.addActor(actor);
    }
  }

  private spawnActor(spawnedCount: number, spawnNum: number): Actor {
    const actor = this.spawningFunction(spawnedCount, spawnNum);
    actor.event.on("dead", (world) => {
      this.deadActors.add(actor);
      if (this.deadActors.size === this.schedule.length) {
        this.event.emit(
          "allActorsWereDead",
          world,
          Array.from(this.deadActors)
        );
      }
    });

    actor.event.once("removedFromWorld", (world) => {
      this.removedActors.add(actor);
      if (this.removedActors.size === this.schedule.length) {
        this.event.emit(
          "allActorsWereRemoved",
          world,
          Array.from(this.removedActors)
        );
        this.reserveRemovingSelfFromWorld();
      }
    });
    return actor;
  }
}
