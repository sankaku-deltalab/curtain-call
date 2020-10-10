import { Matrix } from "trans-vector2d";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import {
  IActor,
  Actor,
  ActorExtension,
  ActorExtensionBase,
  World,
  EventEmitter as IEventEmitter,
} from "@curtain-call/actor";

export { diContainer };

type IActorsSpawnerEvent = IEventEmitter<{
  allActorsWereDead: [World, readonly IActor[]];
  allActorsWereRemoved: [World, readonly IActor[]];
}>;

/**
 * ActorsSpawner spawn multiple actors.
 *
 * @example
 * import { Matrix } from "trans-vector2d";
 *
 * const world = new World();
 *
 * const spawner = new Actor().addExtension(
 *   new ActorsSpawner()
 *     .setSpawningFunction(() => new Actor())
 *     .setSchedule([
 *       [Matrix.identity, 0],
 *       [Matrix.translation({ x: 1, y: 2 }), 0.5],
 *     ])
 *     .start(world)
 * );
 *
 * world.addActor(spawner);
 */
@autoInjectable()
export class ActorsSpawner extends ActorExtensionBase {
  /** Events. */
  public readonly event: IActorsSpawnerEvent;
  public readonly thisIsActorsSpawner: true = true;

  private spawningFunction: (
    spawnedCount: number,
    spawnNum: number
  ) => IActor = (): IActor => new Actor();
  private schedule: readonly [number, Matrix][] = [];
  private isActive = false;
  private spawnedCount = 0;
  private elapsedSec = 0;
  private allActorsRemoved = false;
  private readonly deadActors = new Set<IActor>();
  private readonly removedActors = new Set<IActor>();

  static isActorsSpawner(ext: ActorExtension): ext is ActorsSpawner {
    return "thisIsActorsSpawner" in ext;
  }

  constructor(@inject("EventEmitter") event?: IActorsSpawnerEvent) {
    super();
    if (!event) throw new Error("DI failed");
    this.event = event;
  }

  /**
   * Set actor spawning function.
   *
   * @param func IActor spawning function.
   * @returns this.
   */
  setSpawningFunction(func: () => IActor): this {
    this.spawningFunction = func;
    return this;
  }

  /**
   * Set spawning schedule.
   *
   * @param schedule Spawning schedule.
   * @returns this.
   */
  setSchedule(schedule: readonly [number, Matrix][]): this {
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
   * @param actor Actor.
   * @param deltaSec Delta seconds.
   */
  update(world: World, actor: IActor, deltaSec: number): void {
    if (this.isActive) this.progress(world, deltaSec);
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldBeRemovedFromWorld(): boolean {
    return this.allActorsRemoved;
  }

  private progress(world: World, deltaSec: number): void {
    this.elapsedSec += deltaSec;
    while (
      this.spawnedCount < this.schedule.length &&
      this.elapsedSec >= this.schedule[this.spawnedCount][0]
    ) {
      const actor = this.spawnActor(this.spawnedCount, this.schedule.length);
      actor.setLocalTransform(this.schedule[this.spawnedCount][1]);
      this.spawnedCount += 1;
      world.addActor(actor);
    }
  }

  private spawnActor(spawnedCount: number, spawnNum: number): IActor {
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
        this.allActorsRemoved = true;
      }
    });
    return actor;
  }
}
