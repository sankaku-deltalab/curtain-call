import { Vector, VectorLike } from "trans-vector2d";
import { inject, autoInjectable, container as diContainer } from "tsyringe";
import { Transformation, Box2d } from "@curtain-call/actor";
import { RectCollisionShape as IRectCollisionShape } from "@curtain-call/weapon";

export { diContainer };

/**
 * RectCollisionShape deal single rectangle collision.
 * Collision center was set by `trans` and size was set by `setSize` and `trans` scale.
 *
 * @example
 * const shape = new RectCollisionShape().setSize({ x: 2, y: 2 });
 */
@autoInjectable()
export class RectCollisionShape implements IRectCollisionShape {
  public readonly trans: Transformation;
  private size = Vector.zero;

  /**
   * @param trans Transformation.
   */
  constructor(@inject("Transformation") trans?: Transformation) {
    if (!trans) throw new Error("DI failed");
    this.trans = trans;
  }

  /**
   * Get collision boxes for overlap checking.
   *
   * @returns Collision boxes of shapes.
   */
  getBox2Ds(): Box2d[] {
    const { translation, scale } = this.trans.getGlobal().decompose();
    const globalSizeHalf = this.size.hadamard(scale).div(2);
    const nw = Vector.from(translation).sub(globalSizeHalf);
    const se = Vector.from(translation).add(globalSizeHalf);
    return [[nw.x, nw.y, se.x, se.y]];
  }

  /**
   * Set collision size.
   *
   * @param size New size.
   * @returns this.
   */
  setSize(size: VectorLike): this {
    this.size = Vector.from(size);
    return this;
  }
}
