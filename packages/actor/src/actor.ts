import { EventEmitter } from "eventemitter3";
import { Transformation, Updatable } from "@curtain-call/util";
import { Health } from "@curtain-call/health";
import { DisplayObjects } from "./display-objects";
import { Movers } from "./movers";

/**
 * Actor is main object used in World.
 */
export class Actor<T> implements Updatable<T> {
  /** Event. */
  public readonly event = new EventEmitter<{
    addedToWorld: [T];
    removedFromWorld: [T];
  }>();

  /** Transformation. */
  public readonly trans = new Transformation();

  /** DisplayObjects. */
  public readonly displayObjects = new DisplayObjects<T>();

  /** Movers. */
  public readonly movers = new Movers<T>();

  /** Health. */
  public readonly health = new Health<T>();

  /**
   * Update self.
   *
   * @param world World.
   * @param deltaSec Delta seconds.
   */
  update(world: T, deltaSec: number): void {
    this.trans.setLocal(
      this.movers.update(world, deltaSec, this.trans.getLocal()).newTrans
    );
    this.displayObjects.update(world, deltaSec);
  }

  /**
   * Notify added to world.
   * Called from World.
   *
   * @param world Added World.
   */
  notifyAddedToWorld(world: T): void {
    this.event.emit("addedToWorld", world);
  }

  /**
   * Notify removed from world.
   * Called from World.
   *
   * @param world Removed World.
   */
  notifyRemovedFromWorld(world: T): void {
    this.event.emit("removedFromWorld", world);
  }
}
