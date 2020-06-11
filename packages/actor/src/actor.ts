import { EventEmitter } from "eventemitter3";
import { Vector, Matrix } from "trans-vector2d";
import { Transformation, Updatable } from "@curtain-call/util";
import { Health, DamageDealer } from "@curtain-call/health";
import { Mover } from "@curtain-call/mover";
import { DisplayObject } from "@curtain-call/display-object";
import { Collision, CollisionShape } from "@curtain-call/collision";
import { DisplayObjects } from "./display-objects";
import { Movers } from "./movers";

/**
 * Actor is main object used in World.
 */
export class Actor<T> implements Updatable<T> {
  private shouldRemoveSelf = false;

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

  /** Damage dealer. */
  public readonly damageDealer = new DamageDealer<T>();

  /** Collision. */
  public readonly collision = new Collision<T, Actor<T>>().ownedBy(this);

  /**
   * Remove self from world at next update.
   *
   * @returns Self must remove from world.
   */
  removeSelfFromWorld(): this {
    this.shouldRemoveSelf = true;
    return this;
  }

  /**
   * If remove self from world, this function must be true.
   *
   * @returns Self must remove from world.
   */
  shouldRemoveSelfFromWorld(): boolean {
    return this.shouldRemoveSelf;
  }

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

  /**
   * Move to specified position.
   *
   * @param pos New position. Not delta.
   * @returns this.
   */
  moveTo(pos: Vector): this {
    const { rotation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation: pos, rotation, scale }));
    return this;
  }

  /**
   * Rotate to specified angle.
   *
   * @param angle New angle. Not delta.
   * @returns this.
   */
  rotateTo(angle: number): this {
    const { translation, scale } = this.trans.getLocal().decompose();
    this.trans.setLocal(Matrix.from({ translation, rotation: angle, scale }));
    return this;
  }

  /**
   * Attach self Transformation to other.
   *
   * @param parent Parent Transformation.
   * @returns this.
   */
  attachTo(parent: Transformation): this {
    this.trans.attachTo(parent);
    return this;
  }

  /**
   * Init health.
   *
   * @param healthAmount New health and healthMax amount.
   * @retuns this.
   */
  healthInitialized(healthAmount: number): this {
    this.health.init(healthAmount);
    return this;
  }

  /**
   * Add Mover.
   *
   * @param mover Adding Mover.
   * @returns this.
   */
  movedBy(mover: Mover<T>): this {
    this.movers.add(mover);
    return this;
  }

  /**
   * Add DisplayObject.
   *
   * @param displayObject Adding DisplayObject.
   * @returns this.
   */
  visualizedBy(displayObject: DisplayObject<T>): this {
    this.displayObjects.add(displayObject);
    return this;
  }

  /**
   * Add CollisionShape.
   *
   * @param collisionShape Adding CollisionShape.
   * @returns this.
   */
  collideWith(collisionShape: CollisionShape): this {
    this.collision.add(collisionShape);
    return this;
  }
}
