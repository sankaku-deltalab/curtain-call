import { Matrix } from "trans-vector2d";
import { Box2d, CollisionGroup, CollisionStatus } from "@curtain-call/entity";

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

export type ActorCollisionData = {
  enabled: boolean;
  shapes: CollisionShape[];
  group: CollisionGroup;
  isExcess: boolean;
};

export class ActorCollisionUseCase {
  /**
   * Initialize collision.
   *
   * @param data ActorCollisionData would be modified.
   * @param args.shapes Shapes used for this.
   * @param args.group Group of this.
   * @param args.isExcess This is excess collision.
   */
  initCollision(
    data: ActorCollisionData,
    args: {
      shapes: CollisionShape[];
      group: CollisionGroup;
      isExcess: boolean;
    }
  ): void {
    data.shapes = args.shapes;
    data.group = args.group;
    data.isExcess = args.isExcess;
  }

  /**
   * Enable collision.
   */
  enable(data: ActorCollisionData): void {
    data.enabled = true;
  }

  /**
   * Disable collision.
   */
  disable(data: ActorCollisionData): void {
    data.enabled = false;
  }

  /**
   * Calc collision status of this.
   *
   * @param data ActorCollisionData would be used.
   * @param parentTransform Global transformation matrix of parent.
   * @returns Collision Status.
   */
  calcCollisionStatus(
    data: Readonly<ActorCollisionData>,
    parentTransform: Matrix
  ): CollisionStatus {
    const box2ds: readonly Box2d[] = !data.enabled
      ? []
      : data.shapes
          .map((shape) => shape.calcCollisionBox2ds(parentTransform))
          .flat(1);
    return {
      box2ds,
      group: data.group,
      isExcess: data.isExcess,
    };
  }
}