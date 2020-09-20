import {
  World,
  Collision,
  CollisionShape,
  CollisionGroup,
  Transformation,
  EventEmitter as IEventEmitter,
} from "../interface";
import { Actor as IActor } from "../actor-interface";

export type ActorWithCollisionEvent = IEventEmitter<{
  overlapped: [World, Set<IActor>];
}>;

export class ActorWithCollision {
  constructor(
    private readonly sharedEvent: ActorWithCollisionEvent,
    private readonly collision: Collision,
    sharedTrans: Transformation
  ) {
    sharedTrans.attachChild(collision.trans, false);
  }

  /**
   * Add collision shape.
   *
   * @param shape Adding collision shape.
   * @returns this.
   */
  addCollisionShape(shape: CollisionShape): this {
    this.collision.addShape(shape);
    return this;
  }

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  removeCollisionShape(shape: CollisionShape): this {
    this.collision.removeShape(shape);
    return this;
  }

  /**
   * Set self is huge number collision.
   *
   * Huge number collision will collide with only non-huge number collisions.
   *
   * @param isHuge
   * @return this.
   */
  setCollisionAsHugeNumber(isHuge: boolean): this {
    this.collision.setIsHugeNumber(isHuge);
    return this;
  }

  /**
   * Set this CollisionGroup.
   *
   * @param newGroup New group of this.
   * @returns this.
   */
  setCollisionGroup(newGroup: CollisionGroup): this {
    this.collision.setGroup(newGroup);
    return this;
  }

  /**
   * Set collision enable.
   *
   * @param newEnable Enabling.
   * @returns this.
   */
  setCollisionEnable(newEnable: boolean): this {
    this.collision.setEnable(newEnable);
    return this;
  }

  /**
   * Get this collision.
   *
   * @returns This collision.
   */
  getCollision(): Collision {
    return this.collision;
  }

  /**
   * Notify overlapped with other actor.
   *
   * @param world Our world.
   * @param others Collided Other actors.
   */
  notifyOverlappedWith(world: World, others: Set<IActor>): void {
    this.sharedEvent.emit("overlapped", world, others);
  }
}
