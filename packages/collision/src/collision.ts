import { inject, autoInjectable } from "tsyringe";
import {
  Collision as ICollision,
  CollisionShape,
  CollisionGroup,
  Transformation,
} from "@curtain-call/actor";
import { CollisionGroupPresets } from "./collision-group";
import { Box2d } from "./common";

/**
 * Collision.
 */
@autoInjectable()
export class Collision implements ICollision {
  public readonly trans: Transformation;

  private isHugeNumberInternal = false;
  private readonly shapes = new Set<CollisionShape>();
  private collisionGroup = CollisionGroupPresets.all;
  private enabled = true;

  /**
   * @param trans Transformation
   */
  constructor(@inject("Transformation") trans?: Transformation) {
    if (!trans) throw new Error("DI failed");
    this.trans = trans;
  }

  /**
   * Add collision shape.
   *
   * @param shape Adding collision shape.
   * @returns this.
   */
  addShape(shape: CollisionShape): this {
    if (this.shapes.has(shape)) throw new Error("Shape was already added");
    this.shapes.add(shape);
    this.trans.attachChild(shape.trans, false);
    return this;
  }

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  removeShape(shape: CollisionShape): this {
    if (!this.shapes.has(shape)) throw new Error("Shape is not added");
    this.shapes.delete(shape);
    this.trans.detachChild(shape.trans, false);
    return this;
  }

  /**
   * Get collision boxes for overlap checking.
   *
   * @returns Collision boxes of shapes.
   */
  getBox2Ds(): Box2d[] {
    let boxes: Box2d[] = [];
    this.shapes.forEach((shape) => {
      boxes = [...boxes, ...shape.getBox2Ds()];
    });
    return boxes;
  }

  /**
   * Set self is huge number collision.
   *
   * Huge number collision will collide with only non-huge number collisions.
   *
   * @param isHuge
   * @return this.
   */
  setIsHugeNumber(isHuge: boolean): this {
    this.isHugeNumberInternal = isHuge;
    return this;
  }

  /**
   * Self is huge number collision.
   *
   * @returns this.
   */
  isHugeNumber(): boolean {
    return this.isHugeNumberInternal;
  }

  /**
   * Get this CollisionGroup.
   *
   * @returns Group of this.
   */
  getGroup(): CollisionGroup {
    return this.collisionGroup;
  }

  /**
   * Set this CollisionGroup.
   *
   * @param newGroup New group of this.
   * @returns this.
   */
  setGroup(newGroup: CollisionGroup): this {
    this.collisionGroup = newGroup;
    return this;
  }

  /**
   * Return this can collide with other.
   *
   * NOTE: this.isEnable() and other.isEnable() will ignored.
   *
   * @param other Other collision.
   * @return This can collide with other.
   */
  canCollideWith(other: ICollision): boolean {
    return (this.getGroup().mask & other.getGroup().category) !== 0;
  }

  /**
   * Set enable.
   *
   * @param newEnable Enabling.
   * @returns this.
   */
  setEnable(newEnable: boolean): this {
    this.enabled = newEnable;
    return this;
  }

  /**
   * This collision is enabled.
   *
   * @returns This can collide with others.
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}
