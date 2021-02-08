import {
  injectable,
  Matrix,
  MatrixLike,
  Vector,
  VectorLike,
} from "@curtain-call/shared-dependencies";
import { CollisionShape, Box2d } from "@curtain-call/uc-collision";

@injectable()
export class CollisionShapeSingleRect implements CollisionShape {
  private size: Vector = Vector.zero;
  private offset: Matrix = Matrix.identity;

  setSize(size: VectorLike): this {
    this.size = Vector.from(size);
    return this;
  }

  setOffset(offset: MatrixLike): this {
    this.offset = Matrix.from(offset);
    return this;
  }

  /**
   * Calculate collision boxes.
   *
   * @param parentTransform Global transformation matrix of parent.
   */
  calcCollisionBox2ds(parentTransform: Matrix): readonly Box2d[] {
    const trans = parentTransform.globalize(this.offset);
    const localPoints: Vector[] = [
      new Vector(this.size.x / 2, 0),
      new Vector(-this.size.x / 2, 0),
      new Vector(0, this.size.y / 2),
      new Vector(0, -this.size.y / 2),
    ];
    const globalPoints = localPoints.map((p) => trans.globalizePoint(p));
    const xMax = Math.max(...globalPoints.map((p) => p.x));
    const xMin = Math.min(...globalPoints.map((p) => p.x));
    const yMax = Math.max(...globalPoints.map((p) => p.y));
    const yMin = Math.min(...globalPoints.map((p) => p.y));
    return [[xMin, yMin, xMax, yMax]];
  }
}
