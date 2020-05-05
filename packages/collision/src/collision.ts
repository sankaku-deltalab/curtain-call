import { EventEmitter } from "eventemitter3";
import { Transformation } from "@curtain-call/util";
import { CollisionShape } from "./collision-shape";
import { Box2d } from "./common";

/**
 * Collision.
 */
export class Collision<T> {
  /** Events. */
  public readonly event = new EventEmitter<{
    overlapped: [T, Set<Collision<T>>];
  }>();

  private isHugeNumberInternal = false;
  private readonly shapes = new Set<CollisionShape>();

  /**
   * @param trans Transformation
   */
  constructor(public readonly trans = new Transformation()) {}

  /**
   * Add collision shape.
   *
   * @param shape Adding collision shape.
   * @returns this.
   */
  add(shape: CollisionShape): this {
    if (this.shapes.has(shape)) throw new Error("Shape was already added");
    this.shapes.add(shape);
    shape.trans.attachTo(this.trans);
    return this;
  }

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  remove(shape: CollisionShape): this {
    if (!this.shapes.has(shape)) throw new Error("Shape is not added");
    this.shapes.delete(shape);
    shape.trans.detachFromParent();
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
}
