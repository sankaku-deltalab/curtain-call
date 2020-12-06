import { Matrix } from "trans-vector2d";
import { CollisionGroup, Box2d, CollisionStatus } from "@curtain-call/entity";

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
export class Collision {
  private shapes: CollisionShape[] = [];
  private group: CollisionGroup = { category: 0, mask: 0 };
  private isExcess = false;
  private enabled = true;

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
  }): void {
    this.shapes = args.shapes;
    this.group = args.group;
    this.isExcess = args.isExcess;
  }

  /**
   * Calc collision status of this.
   *
   * @param parentTransform Global transformation matrix of parent.
   * @returns Collision Status.
   */
  calcCollisionStatus(parentTransform: Matrix): CollisionStatus {
    const box2ds: readonly Box2d[] = !this.enabled
      ? []
      : this.shapes
          .map((shape) => shape.calcCollisionBox2ds(parentTransform))
          .flat(1);
    return {
      box2ds,
      group: this.group,
      isExcess: this.isExcess,
    };
  }

  /**
   * Enable this.
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable this.
   */
  disable(): void {
    this.enabled = false;
  }
}
