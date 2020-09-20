import { World, Updatable, EventEmitter as IEventEmitter } from "../interface";

export type ActorWithWorldEvent = IEventEmitter<{
  addedToWorld: [World];
  removedFromWorld: [World];
}>;

export class ActorWithWorld implements Updatable {
  private lifeTimeSec?: number;
  private shouldRemoveSelf = false;

  constructor(private readonly sharedEvent: ActorWithWorldEvent) {}

  /**
   * Remove self from world at next world update.
   *
   * @returns this.
   */
  reserveRemovingSelfFromWorld(): this {
    this.shouldRemoveSelf = true;
    return this;
  }

  /**
   * Cancel removing self from world at next world update.
   *
   * @returns this.
   */
  cancelRemovingSelfFromWorld(): this {
    this.shouldRemoveSelf = false;
    return this;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @param _world World.
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(_world: World): boolean {
    const lifeTimeIsOver =
      this.lifeTimeSec !== undefined && this.lifeTimeSec <= 0;
    return this.shouldRemoveSelf || lifeTimeIsOver;
  }

  /**
   * Notify added to world.
   * Called from only World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: World): void {
    this.sharedEvent.emit("addedToWorld", world);
  }

  /**
   * Notify removed from world.
   * Called from only World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: World): void {
    this.sharedEvent.emit("removedFromWorld", world);
  }

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: World, deltaSec: number): void {
    if (this.lifeTimeSec !== undefined) this.lifeTimeSec -= deltaSec;
  }

  /**
   * Set life time.
   * When life time was over, this should remove self from world.
   *
   * @param lifeTimeSec Life time in seconds.
   * @returns this.
   */
  setLifeTime(lifeTimeSec: number): this {
    this.lifeTimeSec = lifeTimeSec;
    return this;
  }
}
