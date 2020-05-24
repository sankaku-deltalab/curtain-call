import { EventEmitter } from "eventemitter3";
import { Transformation, Updatable } from "@curtain-call/util";
import { Health } from "@curtain-call/health";
import { DisplayObjects } from "./display-objects";
import { Movers } from "./movers";

/**
 * Actor is main object used in Scene.
 */
export class Actor<T> implements Updatable<T> {
  /** Event. */
  public readonly event = new EventEmitter<{
    addedToScene: [T];
    removedFromScene: [T];
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
   * @param scene Scene.
   * @param deltaSec Delta seconds.
   */
  update(scene: T, deltaSec: number): void {
    this.trans.setLocal(
      this.movers.update(scene, deltaSec, this.trans.getLocal()).newTrans
    );
    this.displayObjects.update(scene, deltaSec);
  }

  /**
   * Notify added to scene.
   * Called from Scene.
   *
   * @param scene Added Scene.
   */
  notifyAddedToScene(scene: T): void {
    this.event.emit("addedToScene", scene);
  }

  /**
   * Notify removed from scene.
   * Called from Scene.
   *
   * @param scene Removed Scene.
   */
  notifyRemovedFromScene(scene: T): void {
    this.event.emit("removedFromScene", scene);
  }
}
