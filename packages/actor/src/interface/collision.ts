import { Transformation } from "./transformation";

export type Box2d = [number, number, number, number];

/**
 * CollisionGroup.
 *
 * If ((alpha.mask & beta.category) !== 0), alpha can not collide with beta.
 * Nevertheless if ((beta.mask & alpha.category) !== 0), beta can collide with alpha.
 */
export interface CollisionGroup {
  readonly category: number;
  readonly mask: number;
}

/**
 * CollisionShape deal collision boxes for overlap checking.
 */
export interface CollisionShape {
  /** Transformation. */
  readonly trans: Transformation;

  /**
   * Get collision boxes for overlap checking.
   */
  getBox2Ds(): Box2d[];
}

/**
 * Collision.
 */
export interface Collision {
  readonly trans: Transformation;

  /**
   * Add collision shape.
   *
   * @param shape Adding collision shape.
   * @returns this.
   */
  addShape(shape: CollisionShape): this;

  /**
   * Remove collision shape.
   *
   * @param shape Removing collision shape.
   * @returns this.
   */
  removeShape(shape: CollisionShape): this;

  /**
   * Get collision boxes for overlap checking.
   *
   * @returns Collision boxes of shapes.
   */
  getBox2Ds(): Box2d[];

  /**
   * Set self is huge number collision.
   *
   * Huge number collision will collide with only non-huge number collisions.
   *
   * @param isHuge
   * @return this.
   */
  setIsHugeNumber(isHuge: boolean): this;

  /**
   * Self is huge number collision.
   *
   * @returns this.
   */
  isHugeNumber(): boolean;

  /**
   * Get this CollisionGroup.
   *
   * @returns Group of this.
   */
  getGroup(): CollisionGroup;

  /**
   * Set this CollisionGroup.
   *
   * @param newGroup New group of this.
   * @returns this.
   */
  setGroup(newGroup: CollisionGroup): this;

  /**
   * Return this can collide with other.
   *
   * NOTE: this.isEnabled() and other.isEnabled() will ignored in this function.
   *
   * @param other Other collision.
   * @return This can collide with other.
   */
  canCollideWith(other: Collision): boolean;

  /**
   * Set enable.
   *
   * @param newEnable Enabling.
   * @returns this.
   */
  setEnable(newEnable: boolean): this;

  /**
   * This collision is enabled.
   *
   * @returns This can collide with others.
   */
  isEnabled(): boolean;
}
