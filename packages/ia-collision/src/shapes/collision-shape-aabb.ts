import { Matrix, Vector, VectorLike } from "trans-vector2d";
import { Box2d } from "@curtain-call/entity";
import { CollisionShape } from "@curtain-call/uc-collision";

/**
 * CollisionShape represent single AABB.
 */
export class CollisionShapeAABB implements CollisionShape {
  private sizeHalf: Vector = Vector.zero;

  /**
   * Init collision size.
   *
   * @param size Size of AABB.
   * @returns this.
   */
  init(size: VectorLike): this {
    this.sizeHalf = Vector.from(size).div(2);
    return this;
  }

  /**
   * Calculate collision boxes.
   *
   * @param parentTransform Global transformation matrix of parent.
   */
  calcCollisionBox2ds(parentTransform: Matrix): readonly Box2d[] {
    const sizeHalf = this.sizeHalf;
    const localPoints = [
      { x: sizeHalf.x, y: 0 },
      { x: -sizeHalf.x, y: 0 },
      { x: 0, y: sizeHalf.y },
      { x: 0, y: -sizeHalf.y },
    ];
    const globalPoints = localPoints.map((p) =>
      parentTransform.globalizePoint(p)
    );
    const xMax = Math.max(...globalPoints.map((p) => p.x));
    const xMin = Math.min(...globalPoints.map((p) => p.x));
    const yMax = Math.max(...globalPoints.map((p) => p.y));
    const yMin = Math.min(...globalPoints.map((p) => p.y));
    return [[xMin, yMin, xMax, yMax]];
  }
}
