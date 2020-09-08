import { Vector, VectorLike } from "trans-vector2d";
import { Transformation } from "@curtain-call/util";
import { RectCollisionShape as IRectCollisionShape } from "@curtain-call/weapon";
import { Box2d } from "./common";

/**
 * RectCollisionShape deal single rectangle collision.
 * Collision center was set by `trans` and size was set by `setSize` and `trans` scale.
 */
export class RectCollisionShape implements IRectCollisionShape {
  private size = Vector.zero;

  /**
   * @param trans Transformation.
   */
  constructor(public readonly trans = new Transformation()) {}

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
