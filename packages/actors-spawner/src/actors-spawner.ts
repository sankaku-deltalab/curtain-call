import { EventEmitter } from "eventemitter3";
import { Matrix } from "trans-vector2d";
import { Actor } from "@curtain-call/actor";
import { World } from "@curtain-call/world";
import { Transformation } from "@curtain-call/util";

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
 * world.addActor(world);
 * world.update(0.125);
 */
export class ActorsSpawner<TWorld extends World = World> {
  /** Events. */
  public readonly event = new EventEmitter<{
    allActorsWereDead: [readonly Actor<TWorld>[]];
    allActorsWereRemoved: [readonly Actor<TWorld>[]];
  }>();

  private spawningFunction: (
    spawnedCount: number,
    spawnNum: number
  ) => Actor<TWorld> = (): Actor<TWorld> => new Actor();
  private schedule: readonly [Matrix, number][] = [];
  private isActive = false;
  private spawnedCount = 0;
  private elapsedSec = 0;
  private possessingActor?: Actor<TWorld>;
  private readonly deadActors = new Set<Actor<TWorld>>();
  private readonly removedActors = new Set<Actor<TWorld>>();

  constructor(private readonly trans: Transformation = new Transformation()) {}

  /**
   * Possess to Actor.
   * This would act with given actor.
   *
   * @param actor Base actor.
   * @returns this.
   */
  possessTo(actor: Actor<TWorld>): this {
    if (this.possessingActor) throw new Error("Do not possess twice");
    this.possessingActor = actor;
    actor.attachTransformation(this.trans);
    actor.event.on("updated", (world, deltaSec) =>
      this.update(world, deltaSec)
    );
    actor.event.on("removedFromWorld", () => {
      this.destroy();
    });
    return this;
  }

  /**
   * Set actor spawning function.
   *
   * @param func Actor spawning function.
   * @returns this.
   */
  setSpawningFunction(func: () => Actor<TWorld>): this {
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
  start(world: TWorld): this {
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
  update(world: TWorld, deltaSec: number): void {
    if (this.isActive) this.progress(world, deltaSec);
  }

  private progress(world: TWorld, deltaSec: number): void {
    if (!this.possessingActor) throw new Error();
    this.elapsedSec += deltaSec;
    while (
      this.spawnedCount < this.schedule.length &&
      this.elapsedSec >= this.schedule[this.spawnedCount][1]
    ) {
      const actor = this.spawnActor(this.spawnedCount, this.schedule.length);
      actor.setLocalTransform(this.schedule[this.spawnedCount][0]);
      this.spawnedCount += 1;
      world.addActor(actor);

      if (this.spawnedCount === this.schedule.length)
        this.possessingActor.removeSelfFromWorld(true);
    }
  }

  private spawnActor(spawnedCount: number, spawnNum: number): Actor<TWorld> {
    const actor = this.spawningFunction(spawnedCount, spawnNum);
    actor.event.on("dead", () => {
      this.deadActors.delete(actor);
      this.deadActors.add(actor);
      if (this.deadActors.size === this.schedule.length) {
        this.event.emit("allActorsWereDead", Array.from(this.deadActors));
      }
    });

    actor.event.once("removedFromWorld", () => {
      this.removedActors.delete(actor);
      this.removedActors.add(actor);
      if (this.removedActors.size === this.schedule.length) {
        this.event.emit("allActorsWereRemoved", Array.from(this.removedActors));
      }
    });
    return actor;
  }

  private destroy(): void {
    this.isActive = false;
    this.event.removeAllListeners();
  }
}
