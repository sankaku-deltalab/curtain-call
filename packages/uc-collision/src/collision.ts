import { Matrix } from "trans-vector2d";
import {
  CollisionGroup,
  Box2d,
  CollisionRepresentation,
} from "@curtain-call/entity";

/**
 * `CollisionShape` express global collision shape.
 */
export interface CollisionShape {
  /**
   * Calculate collision boxes.
   *
   * @param parentTransform Global transformation matrix of parent.
   */
  calcCollisionBox2ds(parentTransform: Matrix): readonly Box2d[];
}

/**
 * `Collision` is used for collision expression of actor.
 */
export interface Collision {
  /**
   * Initialize collision.
   *
   * @param args.shapes Shapes used for this.
   * @param args.group Group of this.
   * @param args.isExcess This is excess collision.
   */
  init(args: {
    shapes: CollisionShape[];
    group: CollisionGroup;
    isExcess: boolean;
  }): void;

  /**
   * Calc collision representation of this.
   *
   * @param parentTransform Global transformation matrix of parent.
   * @returns Collision Representation.
   */
  calcCollisionRepresentation(parentTransform: Matrix): CollisionRepresentation;

  /**
   * Enable this.
   */
  enable(): void;

  /**
   * Disable this.
   */
  disable(): void;
}
